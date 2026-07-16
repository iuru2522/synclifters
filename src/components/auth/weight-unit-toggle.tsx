import { useCallback } from "react";
import { Pressable, Text, View, type LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, globalStyles, spacing } from "@/styles/global";

export type WeightUnit = "kg" | "lb";

type WeightUnitToggleProps = {
  value: WeightUnit;
  onChange: (unit: WeightUnit) => void;
};

const segments: { unit: WeightUnit; label: string; accessibilityLabel: string }[] = [
  { unit: "kg", label: "KG", accessibilityLabel: "Kilograms" },
  { unit: "lb", label: "LB", accessibilityLabel: "Pounds" },
];

const kgThumbColor = colors.backArrow;
const lbThumbColor = colors.white;

const springConfig = {
  overshootClamping: true,
};

function unitToIndex(unit: WeightUnit) {
  return unit === "kg" ? 0 : 1;
}

function unitToThumbColor(unit: WeightUnit) {
  return unit === "kg" ? kgThumbColor : lbThumbColor;
}

function offsetToThumbColor(offset: number) {
  "worklet";
  return offset > 0 ? lbThumbColor : kgThumbColor;
}

export function WeightUnitToggle({ value, onChange }: WeightUnitToggleProps) {
  const segmentWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const thumbColor = useSharedValue(unitToThumbColor(value));
  const animationGeneration = useSharedValue(0);

  const commitUnit = useCallback(
    (unit: WeightUnit) => {
      onChange(unit);
    },
    [onChange],
  );

  const settleToOffset = useCallback(
    (offset: number, unit: WeightUnit, notifyChange: boolean) => {
      animationGeneration.value += 1;
      const generation = animationGeneration.value;

      cancelAnimation(translateX);

      if (notifyChange) {
        onChange(unit);
      }

      translateX.value = withSpring(offset, springConfig, (finished) => {
        if (finished && animationGeneration.value === generation) {
          thumbColor.value = offsetToThumbColor(offset);
        }
      });
    },
    [animationGeneration, onChange, translateX, thumbColor],
  );

  const snapToUnit = useCallback(
    (unit: WeightUnit) => {
      const target = unitToIndex(unit) * segmentWidth.value;
      settleToOffset(target, unit, true);
    },
    [segmentWidth, settleToOffset],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    const half = width / 2;
    const offset = unitToIndex(value) * half;

    animationGeneration.value += 1;
    cancelAnimation(translateX);
    segmentWidth.value = half;
    translateX.value = offset;
    thumbColor.value = unitToThumbColor(value);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-16, 16])
    .onStart(() => {
      dragStartX.value = translateX.value;
    })
    .onUpdate((event) => {
      const max = segmentWidth.value;
      translateX.value = Math.max(0, Math.min(max, dragStartX.value + event.translationX));
    })
    .onEnd((event) => {
      const max = segmentWidth.value;
      const midpoint = max / 2;
      const shouldSelectLb = translateX.value > midpoint || event.velocityX > spacing.swipeBackVelocity;
      const nextOffset = shouldSelectLb ? max : 0;
      const nextUnit = shouldSelectLb ? "lb" : "kg";

      animationGeneration.value += 1;
      const generation = animationGeneration.value;

      cancelAnimation(translateX);
      translateX.value = withSpring(nextOffset, springConfig, (finished) => {
        if (finished && animationGeneration.value === generation) {
          thumbColor.value = offsetToThumbColor(nextOffset);
        }
      });
      runOnJS(commitUnit)(nextUnit);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    width: segmentWidth.value,
    transform: [{ translateX: translateX.value }],
    backgroundColor: thumbColor.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={globalStyles.weightUnitToggle}
        onLayout={handleLayout}
        accessibilityRole="tablist"
      >
        <Animated.View style={[globalStyles.weightUnitToggleThumb, thumbStyle]} />
        <View style={globalStyles.weightUnitToggleSegments}>
          {segments.map((segment) => {
            const selected = value === segment.unit;

            return (
              <Pressable
                key={segment.unit}
                style={globalStyles.weightUnitToggleSegment}
                onPress={() => {
                  snapToUnit(segment.unit);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={segment.accessibilityLabel}
              >
                <Text style={globalStyles.weightUnitToggleLabel}>{segment.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </GestureDetector>
  );
}
