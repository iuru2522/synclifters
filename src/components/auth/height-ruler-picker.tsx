import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Text,
  View,
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
  formatHeightUnitLabel,
  getHeightRulerConfig,
  heightToIndex,
  indexToHeight,
  type HeightRulerConfig,
} from "./height-ruler-units";
import type { WeightUnit } from "./weight-unit-toggle";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<number>);

type HeightRulerPickerProps = {
  value: number;
  unit: WeightUnit;
  onChange: (value: number) => void;
};

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
        sizes.weightRulerAdjacentScale,
        sizes.weightRulerFarScale,
      ],
      Extrapolation.CLAMP,
    );
    const fontSize = interpolate(
      distance,
      [0, stepHeight * 10],
      [
        typography.weightRulerSelectedNumber.fontSize,
        typography.weightRulerAdjacentNumber.fontSize,
      ],
      Extrapolation.CLAMP,
    );
    const lineHeight = interpolate(
      distance,
      [0, stepHeight * 10],
      [
        typography.weightRulerSelectedNumber.lineHeight,
        typography.weightRulerAdjacentNumber.lineHeight,
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
      fontSize,
      lineHeight,
      color: distance < stepHeight * 0.75 ? colors.backArrow : colors.white,
      opacity: focusOpacity * edgeOpacity,
    };
  });

  return (
    <Animated.Text style={[globalStyles.heightRulerNumberLabel, animatedStyle]}>
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
  const listRef = useRef<FlatList<number>>(null);
  const scrollY = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(value);
  const hasScrolledToInitial = useRef(false);
  const prevUnitRef = useRef(unit);
  const config = useMemo(() => getHeightRulerConfig(unit), [unit]);

  const stepHeight = sizes.heightRulerStepHeight;
  const stepCount = Math.round((config.max - config.min) / config.step);
  const steps = useMemo(
    () => Array.from({ length: stepCount + 1 }, (_, index) => index),
    [stepCount],
  );
  const rowWidth =
    sizes.heightRulerNumberColumnWidth +
    spacing.heightRulerNumberToBar +
    sizes.heightRulerBarWidth;
  const viewportHeight = sizes.heightRulerViewportHeight;
  const sidePadding = Math.max(0, viewportHeight / 2 - stepHeight / 2);
  const maxScrollOffset = stepCount * stepHeight;

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(stepCount, index)),
    [stepCount],
  );

  const clampOffset = useCallback(
    (offset: number) => Math.max(0, Math.min(maxScrollOffset, offset)),
    [maxScrollOffset],
  );

  const updateDisplayFromOffset = useCallback(
    (offset: number) => {
      const index = clampIndex(Math.round(clampOffset(offset) / stepHeight));
      setDisplayValue(indexToHeight(index, config));
    },
    [clampIndex, clampOffset, config, stepHeight],
  );

  const scrollToValue = useCallback(
    (nextValue: number, animated: boolean) => {
      const index = clampIndex(heightToIndex(nextValue, config));
      const offset = index * stepHeight;
      listRef.current?.scrollToOffset({ offset, animated });
      scrollY.value = offset;
      setDisplayValue(indexToHeight(index, config));
    },
    [clampIndex, config, scrollY, stepHeight],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (!hasScrolledToInitial.current) {
      hasScrolledToInitial.current = true;
      requestAnimationFrame(() => {
        scrollToValue(value, false);
      });
    }
  }, [scrollToValue, value]);

  useEffect(() => {
    if (!hasScrolledToInitial.current || prevUnitRef.current === unit) {
      return;
    }

    prevUnitRef.current = unit;
    requestAnimationFrame(() => {
      scrollToValue(value, false);
    });
  }, [scrollToValue, unit, value]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(updateDisplayFromOffset)(event.contentOffset.y);
    },
  });

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = clampOffset(event.nativeEvent.contentOffset.y);
    const index = clampIndex(Math.round(offset / stepHeight));

    if (offset !== event.nativeEvent.contentOffset.y) {
      listRef.current?.scrollToOffset({ offset, animated: true });
      scrollY.value = offset;
    }

    const nextValue = indexToHeight(index, config);
    setDisplayValue(nextValue);
    onChange(nextValue);
  };

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

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, index: number) => ({
      length: stepHeight,
      offset: stepHeight * index,
      index,
    }),
    [stepHeight],
  );

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
            <AnimatedFlatList
              key={unit}
              ref={listRef}
              data={steps}
              keyExtractor={(index) => String(index)}
              renderItem={renderStep}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              decelerationRate="fast"
              snapToInterval={stepHeight}
              scrollEventThrottle={16}
              style={globalStyles.heightRulerList}
              onScroll={scrollHandler}
              onMomentumScrollEnd={handleScrollEnd}
              onScrollEndDrag={handleScrollEnd}
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
