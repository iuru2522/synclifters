import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
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
import type { WeightUnit } from "@/features/onboarding/types";
import { colors, globalStyles, sizes, spacing, typography } from "@/styles/global";
import { AuthReadoutArrow } from "./auth-readout-arrow";
import {
  formatHeightUnitLabel,
  getHeightRulerConfig,
  heightToIndex,
  indexToHeight,
  type HeightRulerConfig,
} from "./height-ruler-units";

type HeightRulerPickerProps = {
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

type HeightRulerReadoutProps = {
  value: number;
  unit: WeightUnit;
};

function HeightRulerReadout({ value, unit }: HeightRulerReadoutProps) {
  return (
    <View style={globalStyles.heightRulerReadout}>
      <View style={globalStyles.heightRulerReadoutRow}>
        <Text style={globalStyles.heightRulerReadoutValue}>{formatRulerLabel(value)}</Text>
        <Text style={globalStyles.heightRulerReadoutUnit}>{formatHeightUnitLabel(unit)}</Text>
      </View>
    </View>
  );
}

type RulerNumberLabelProps = {
  index: number;
  label: string;
  scrollY: SharedValue<number>;
  stepHeight: number;
  sidePadding: number;
  viewportHeight: number;
};

function RulerNumberLabel({
  index,
  label,
  scrollY,
  stepHeight,
  sidePadding,
  viewportHeight,
}: RulerNumberLabelProps) {
  const labelHeight = sizes.weightRulerNumberRowHeight;

  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index * stepHeight - scrollY.value);
    const scale = interpolate(
      distance,
      [0, stepHeight * 10, stepHeight * 20],
      [
        sizes.weightRulerSelectedScale,
        sizes.weightRulerAdjacentScale * ADJACENT_FONT_SCALE,
        sizes.weightRulerFarScale * ADJACENT_FONT_SCALE,
      ],
      Extrapolation.CLAMP,
    );
    const labelCenterY = sidePadding + index * stepHeight - scrollY.value;
    const edgeDistance = Math.min(labelCenterY, viewportHeight - labelCenterY);
    const edgeOpacity = interpolate(
      edgeDistance,
      [0, labelHeight * 0.35, labelHeight * 0.7],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
    const focusOpacity = distance < stepHeight * 0.75 ? 1 : sizes.weightRulerAdjacentOpacity;

    return {
      transform: [{ scale }],
      color: distance < stepHeight * 0.75 ? colors.backArrow : colors.white,
      opacity: focusOpacity * edgeOpacity,
    };
  });

  return (
    <Animated.Text
      style={[
        globalStyles.heightRulerNumberLabel,
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
  config: HeightRulerConfig;
  scrollY: SharedValue<number>;
  stepHeight: number;
  rowWidth: number;
  sidePadding: number;
  viewportHeight: number;
};

function RulerStep({
  index,
  config,
  scrollY,
  stepHeight,
  rowWidth,
  sidePadding,
  viewportHeight,
}: RulerStepProps) {
  const isWhole = index % 10 === 0;
  const isHalf = index % 5 === 0 && !isWhole;
  const stepValue = indexToHeight(index, config);

  const tickStyle = isWhole
    ? globalStyles.heightRulerTickMajor
    : isHalf
      ? globalStyles.heightRulerTickHalf
      : globalStyles.heightRulerTickMinor;

  return (
    <View
      style={[
        globalStyles.heightRulerStepRow,
        { height: stepHeight, width: rowWidth },
      ]}
    >
      {isWhole ? (
        <View
          style={[
            globalStyles.heightRulerNumberLabelSlot,
            {
              width: sizes.heightRulerNumberColumnWidth,
              top: (stepHeight - sizes.weightRulerNumberRowHeight) / 2,
            },
          ]}
        >
          <RulerNumberLabel
            index={index}
            label={formatRulerLabel(stepValue)}
            scrollY={scrollY}
            stepHeight={stepHeight}
            sidePadding={sidePadding}
            viewportHeight={viewportHeight}
          />
        </View>
      ) : null}
      <View
        style={[
          globalStyles.heightRulerBarSegment,
          { width: sizes.heightRulerBarWidth },
        ]}
      >
        <View style={tickStyle} />
      </View>
    </View>
  );
}

export function HeightRulerPicker({ value, unit, onChange }: HeightRulerPickerProps) {
  const config = useMemo(() => getHeightRulerConfig(unit), [unit]);

  const stepHeight = sizes.heightRulerStepHeight;
  const stepCount = Math.round((config.max - config.min) / config.step);
  const viewportHeight = sizes.heightRulerViewportHeight;
  const sidePadding = Math.max(0, viewportHeight / 2 - stepHeight / 2);
  const maxScrollOffset = stepCount * stepHeight;

  const initialIndex = useMemo(
    () => Math.max(0, Math.min(stepCount, heightToIndex(value, config))),
    // Compute initial index per unit mount so user scrolling doesn't reset initialScrollOffset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, stepCount, unit],
  );
  const initialOffset = initialIndex * stepHeight;

  const scrollY = useSharedValue(initialOffset);
  const sharedValues = useMemo(() => ({ scrollOffset: scrollY }), [scrollY]);
  const [displayValue, setDisplayValue] = useState(value);
  const isMomentumScrolling = useRef(false);

  const steps = useMemo(
    () => Array.from({ length: stepCount + 1 }, (_, index) => index),
    [stepCount],
  );
  const rowWidth =
    sizes.heightRulerNumberColumnWidth +
    spacing.heightRulerNumberToBar +
    sizes.heightRulerBarWidth;

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(stepCount, index)),
    [stepCount],
  );

  const clampOffset = useCallback(
    (offset: number) => Math.max(0, Math.min(maxScrollOffset, offset)),
    [maxScrollOffset],
  );

  const updateDisplayByIndex = useCallback(
    (index: number) => {
      setDisplayValue(indexToHeight(clampIndex(index), config));
    },
    [clampIndex, config],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    scrollY.value = initialOffset;
  }, [initialOffset, scrollY]);

  useAnimatedReaction(
    () => Math.round(scrollY.value / stepHeight),
    (currentIndex, previousIndex) => {
      if (previousIndex !== null && currentIndex !== previousIndex) {
        runOnJS(updateDisplayByIndex)(currentIndex);
      }
    },
    [stepHeight, updateDisplayByIndex],
  );

  const commitOffset = useCallback(
    (rawOffset: number) => {
      const offset = clampOffset(rawOffset);
      const index = clampIndex(Math.round(offset / stepHeight));
      const nextValue = indexToHeight(index, config);
      setDisplayValue(nextValue);
      onChange(nextValue);
    },
    [clampIndex, clampOffset, config, onChange, stepHeight],
  );

  const handleMomentumScrollBegin = useCallback(() => {
    isMomentumScrolling.current = true;
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isMomentumScrolling.current = false;
      commitOffset(event.nativeEvent.contentOffset.y);
    },
    [commitOffset],
  );

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityY = event.nativeEvent.velocity?.y ?? 0;
      if (Math.abs(velocityY) < 0.05 && !isMomentumScrolling.current) {
        commitOffset(event.nativeEvent.contentOffset.y);
      }
    },
    [commitOffset],
  );

  const renderStep = useCallback(
    ({ item: index }: { item: number }) => (
      <RulerStep
        index={index}
        config={config}
        scrollY={scrollY}
        stepHeight={stepHeight}
        rowWidth={rowWidth}
        sidePadding={sidePadding}
        viewportHeight={viewportHeight}
      />
    ),
    [config, rowWidth, scrollY, sidePadding, stepHeight, viewportHeight],
  );

  const getFixedItemSize = useCallback(() => stepHeight, [stepHeight]);
  const getItemType = useCallback(
    (index: number) => (index % 10 === 0 ? "major" : "tick"),
    [],
  );
  const keyExtractor = useCallback((index: number) => String(index), []);

  return (
    <View style={globalStyles.heightRulerPicker}>
      <HeightRulerReadout value={displayValue} unit={unit} />
      <View style={globalStyles.heightRulerPickerBody}>
        <View
          style={[
            globalStyles.heightRulerPickerFrame,
            { height: viewportHeight, width: rowWidth },
          ]}
        >
          <View
            style={[
              globalStyles.heightRulerPickerViewport,
              { height: viewportHeight, width: rowWidth },
            ]}
          >
            <View
              pointerEvents="none"
              style={globalStyles.heightRulerBarTrack}
            />
            <AnimatedLegendList
              key={unit}
              data={steps}
              keyExtractor={keyExtractor}
              renderItem={renderStep}
              getFixedItemSize={getFixedItemSize}
              getItemType={getItemType}
              estimatedItemSize={stepHeight}
              estimatedListSize={{ width: rowWidth, height: viewportHeight }}
              initialScrollOffset={initialOffset}
              recycleItems
              drawDistance={viewportHeight}
              sharedValues={sharedValues}
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              decelerationRate="fast"
              snapToInterval={stepHeight}
              style={globalStyles.heightRulerList}
              onMomentumScrollBegin={handleMomentumScrollBegin}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScrollEndDrag={handleScrollEndDrag}
              contentContainerStyle={{ paddingVertical: sidePadding }}
            />
            <View pointerEvents="none" style={globalStyles.heightRulerNeedle} />
          </View>
          <View pointerEvents="none" style={globalStyles.heightRulerNeedlePointer}>
            <View style={globalStyles.heightRulerNeedlePointerArrow}>
              <AuthReadoutArrow />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
