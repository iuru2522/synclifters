import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { colors, globalStyles, sizes, spacing, typography } from "@/styles/global";
import { AuthReadoutArrow } from "./auth-readout-arrow";
import {
  getWeightRulerConfig,
  indexToWeight,
  weightToIndex,
  type WeightRulerConfig,
} from "./weight-ruler-units";
import type { WeightUnit } from "./weight-unit-toggle";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<number>);

type WeightRulerPickerProps = {
  value: number;
  unit: WeightUnit;
  onChange: (value: number) => void;
};

function formatRulerLabel(value: number) {
  return String(Math.round(value));
}

function formatReadoutValue(value: number) {
  return String(Math.round(value));
}

function formatUnitLabel(unit: WeightUnit) {
  return unit === "kg" ? "Kg" : "Lb";
}

type WeightRulerReadoutProps = {
  value: number;
  unit: WeightUnit;
};

function WeightRulerReadout({ value, unit }: WeightRulerReadoutProps) {
  return (
    <View style={globalStyles.weightRulerReadout}>
      <AuthReadoutArrow />
      <View style={globalStyles.weightRulerReadoutRow}>
        <Text style={globalStyles.weightRulerReadoutValue}>{formatReadoutValue(value)}</Text>
        <Text style={globalStyles.weightRulerReadoutUnit}>{formatUnitLabel(unit)}</Text>
      </View>
    </View>
  );
}

type RulerNumberLabelProps = {
  index: number;
  label: string;
  scrollX: SharedValue<number>;
  stepWidth: number;
};

function RulerNumberLabel({ index, label, scrollX, stepWidth }: RulerNumberLabelProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index * stepWidth - scrollX.value);
    const scale = interpolate(
      distance,
      [0, stepWidth * 10, stepWidth * 20],
      [
        sizes.weightRulerSelectedScale,
        sizes.weightRulerAdjacentScale,
        sizes.weightRulerFarScale,
      ],
      Extrapolation.CLAMP,
    );
    const fontSize = interpolate(
      distance,
      [0, stepWidth * 10],
      [
        typography.weightRulerSelectedNumber.fontSize,
        typography.weightRulerAdjacentNumber.fontSize,
      ],
      Extrapolation.CLAMP,
    );
    const lineHeight = interpolate(
      distance,
      [0, stepWidth * 10],
      [
        typography.weightRulerSelectedNumber.lineHeight,
        typography.weightRulerAdjacentNumber.lineHeight,
      ],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      fontSize,
      lineHeight,
      color: distance < stepWidth * 0.75 ? colors.backArrow : colors.white,
      opacity: distance < stepWidth * 0.75 ? 1 : sizes.weightRulerAdjacentOpacity,
    };
  });

  return (
    <Animated.Text style={[globalStyles.weightRulerNumberLabel, animatedStyle]}>
      {label}
    </Animated.Text>
  );
}

type RulerStepProps = {
  index: number;
  config: WeightRulerConfig;
  scrollX: SharedValue<number>;
  stepWidth: number;
  columnHeight: number;
};

function RulerStep({ index, config, scrollX, stepWidth, columnHeight }: RulerStepProps) {
  const isWhole = index % 10 === 0;
  const isHalf = index % 5 === 0 && !isWhole;
  const stepValue = indexToWeight(index, config);

  const tickStyle = isWhole
    ? [
        globalStyles.weightRulerTickMajor,
        {
          height: sizes.weightRulerTickMajorHeight,
          width: sizes.weightRulerTickMajorWidth,
        },
      ]
    : isHalf
      ? [
          globalStyles.weightRulerTickHalf,
          {
            height: sizes.weightRulerTickHalfHeight,
            width: sizes.weightRulerTickHalfWidth,
          },
        ]
      : [
          globalStyles.weightRulerTickMinor,
          {
            height: sizes.weightRulerTickMinorHeight,
            width: sizes.weightRulerTickMinorWidth,
          },
        ];

  return (
    <View
      style={[
        globalStyles.weightRulerStepColumn,
        { width: stepWidth, height: columnHeight },
      ]}
    >
      {isWhole ? (
        <View
          style={[
            globalStyles.weightRulerNumberLabelSlot,
            {
              width: sizes.weightRulerMajorLabelWidth,
              left: (stepWidth - sizes.weightRulerMajorLabelWidth) / 2,
            },
          ]}
        >
          <RulerNumberLabel
            index={index}
            label={formatRulerLabel(stepValue)}
            scrollX={scrollX}
            stepWidth={stepWidth}
          />
        </View>
      ) : null}
      <View
        style={[
          globalStyles.weightRulerBarSegment,
          { height: sizes.weightRulerBarHeight },
        ]}
      >
        <View style={tickStyle} />
      </View>
    </View>
  );
}

export function WeightRulerPicker({ value, unit, onChange }: WeightRulerPickerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);
  const scrollX = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(value);
  const hasScrolledToInitial = useRef(false);
  const prevUnitRef = useRef(unit);
  const config = useMemo(() => getWeightRulerConfig(unit), [unit]);

  const stepWidth = sizes.weightRulerStepWidth;
  const stepCount = Math.round((config.max - config.min) / config.step);
  const steps = useMemo(
    () => Array.from({ length: stepCount + 1 }, (_, index) => index),
    [stepCount],
  );
  const sidePadding = Math.max(0, windowWidth / 2 - stepWidth / 2);
  const columnHeight =
    sizes.weightRulerNumberRowHeight + spacing.weightRulerNumberToBar + sizes.weightRulerBarHeight;

  const updateDisplayFromOffset = useCallback(
    (offset: number) => {
      const index = Math.round(offset / stepWidth);
      setDisplayValue(indexToWeight(index, config));
    },
    [config, stepWidth],
  );

  const scrollToValue = useCallback(
    (nextValue: number, animated: boolean) => {
      const index = weightToIndex(nextValue, config);
      const offset = index * stepWidth;
      listRef.current?.scrollToOffset({ offset, animated });
      scrollX.value = offset;
      setDisplayValue(nextValue);
    },
    [config, scrollX, stepWidth],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (!hasScrolledToInitial.current && windowWidth > 0) {
      hasScrolledToInitial.current = true;
      requestAnimationFrame(() => {
        scrollToValue(value, false);
      });
    }
  }, [scrollToValue, value, windowWidth]);

  useEffect(() => {
    if (!hasScrolledToInitial.current || windowWidth <= 0 || prevUnitRef.current === unit) {
      return;
    }

    prevUnitRef.current = unit;
    requestAnimationFrame(() => {
      scrollToValue(value, false);
    });
  }, [scrollToValue, unit, value, windowWidth]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateDisplayFromOffset)(event.contentOffset.x);
    },
  });

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / stepWidth);
    const nextValue = indexToWeight(index, config);
    setDisplayValue(nextValue);
    onChange(nextValue);
  };

  const renderStep = useCallback(
    ({ item: index }: { item: number }) => (
      <RulerStep
        index={index}
        config={config}
        scrollX={scrollX}
        stepWidth={stepWidth}
        columnHeight={columnHeight}
      />
    ),
    [columnHeight, config, scrollX, stepWidth],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, index: number) => ({
      length: stepWidth,
      offset: stepWidth * index,
      index,
    }),
    [stepWidth],
  );

  return (
    <View style={globalStyles.weightRulerPicker}>
      <View style={globalStyles.weightRulerPickerBody}>
        <View style={[globalStyles.weightRulerPickerViewport, { width: windowWidth }]}>
          <AnimatedFlatList
            key={unit}
            ref={listRef}
            horizontal
            data={steps}
            keyExtractor={(index) => String(index)}
            renderItem={renderStep}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={stepWidth}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
          />
          <View pointerEvents="none" style={globalStyles.weightRulerNeedle} />
        </View>
      </View>
      <WeightRulerReadout value={displayValue} unit={unit} />
    </View>
  );
}
