import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { type LegendListRef } from "@legendapp/list/react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
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

type WeightRulerPickerProps = {
  value: number;
  unit: WeightUnit;
  onChange: (value: number) => void;
};

const ADJACENT_FONT_SCALE =
  typography.weightRulerAdjacentNumber.fontSize /
  typography.weightRulerSelectedNumber.fontSize;

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
        sizes.weightRulerAdjacentScale * ADJACENT_FONT_SCALE,
        sizes.weightRulerFarScale * ADJACENT_FONT_SCALE,
      ],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      color: distance < stepWidth * 0.75 ? colors.backArrow : colors.white,
      opacity: distance < stepWidth * 0.75 ? 1 : sizes.weightRulerAdjacentOpacity,
    };
  });

  return (
    <Animated.Text
      style={[
        globalStyles.weightRulerNumberLabel,
        typography.weightRulerSelectedNumber,
        animatedStyle,
      ]}
    >
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
  const listRef = useRef<LegendListRef>(null);
  const config = useMemo(() => getWeightRulerConfig(unit), [unit]);

  const stepWidth = sizes.weightRulerStepWidth;
  const stepCount = Math.round((config.max - config.min) / config.step);
  const initialIndex = useMemo(
    () => Math.max(0, Math.min(stepCount, weightToIndex(value, config))),
    // Compute initial index per unit mount so user scrolling doesn't reset initialScrollOffset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, stepCount, unit],
  );
  const initialOffset = initialIndex * stepWidth;

  const scrollX = useSharedValue(initialOffset);
  const sharedValues = useMemo(() => ({ scrollOffset: scrollX }), [scrollX]);
  const [displayValue, setDisplayValue] = useState(value);
  const isMomentumScrolling = useRef(false);

  const steps = useMemo(
    () => Array.from({ length: stepCount + 1 }, (_, index) => index),
    [stepCount],
  );
  const sidePadding = Math.max(0, windowWidth / 2 - stepWidth / 2);
  const columnHeight =
    sizes.weightRulerNumberRowHeight + spacing.weightRulerNumberToBar + sizes.weightRulerBarHeight;

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(stepCount, index)),
    [stepCount],
  );

  const updateDisplayByIndex = useCallback(
    (index: number) => {
      const clamped = clampIndex(index);
      setDisplayValue(indexToWeight(clamped, config));
    },
    [clampIndex, config],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    scrollX.value = initialOffset;
  }, [initialOffset, scrollX]);

  useAnimatedReaction(
    () => Math.round(scrollX.value / stepWidth),
    (currentIndex, previousIndex) => {
      if (previousIndex !== null && currentIndex !== previousIndex) {
        runOnJS(updateDisplayByIndex)(currentIndex);
      }
    },
    [stepWidth, updateDisplayByIndex],
  );

  const commitOffset = useCallback(
    (offset: number) => {
      const index = clampIndex(Math.round(offset / stepWidth));
      const nextValue = indexToWeight(index, config);
      setDisplayValue(nextValue);
      onChange(nextValue);
    },
    [clampIndex, config, onChange, stepWidth],
  );

  const handleMomentumScrollBegin = useCallback(() => {
    isMomentumScrolling.current = true;
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isMomentumScrolling.current = false;
      commitOffset(event.nativeEvent.contentOffset.x);
    },
    [commitOffset],
  );

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityX = event.nativeEvent.velocity?.x ?? 0;
      if (Math.abs(velocityX) < 0.05 && !isMomentumScrolling.current) {
        commitOffset(event.nativeEvent.contentOffset.x);
      }
    },
    [commitOffset],
  );

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

  const getFixedItemSize = useCallback(() => stepWidth, [stepWidth]);
  const getItemType = useCallback(
    (index: number) => (index % 10 === 0 ? "major" : "tick"),
    [],
  );
  const keyExtractor = useCallback((index: number) => String(index), []);

  return (
    <View style={globalStyles.weightRulerPicker}>
      <View style={globalStyles.weightRulerPickerBody}>
        <View style={[globalStyles.weightRulerPickerViewport, { width: windowWidth }]}>
          {windowWidth > 0 ? (
            <AnimatedLegendList
              key={unit}
              ref={listRef}
              horizontal
              data={steps}
              keyExtractor={keyExtractor}
              renderItem={renderStep}
              getFixedItemSize={getFixedItemSize}
              getItemType={getItemType}
              estimatedItemSize={stepWidth}
              estimatedListSize={{ width: windowWidth, height: columnHeight }}
              initialScrollOffset={initialOffset}
              recycleItems
              drawDistance={windowWidth}
              sharedValues={sharedValues}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              decelerationRate="fast"
              snapToInterval={stepWidth}
              onMomentumScrollBegin={handleMomentumScrollBegin}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScrollEndDrag={handleScrollEndDrag}
              contentContainerStyle={{ paddingHorizontal: sidePadding }}
            />
          ) : null}
          <View pointerEvents="none" style={globalStyles.weightRulerNeedle} />
        </View>
      </View>
      <WeightRulerReadout value={displayValue} unit={unit} />
    </View>
  );
}
