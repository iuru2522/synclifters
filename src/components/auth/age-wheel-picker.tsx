import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { colors, globalStyles, sizes, typography } from "@/styles/global";
import { AuthReadoutArrow } from "./auth-readout-arrow";

type AgeWheelPickerProps = {
  value: number;
  onChange: (value: number) => void;
};

const ADJACENT_FONT_SCALE =
  typography.ageWheelAdjacentNumber.fontSize / typography.ageWheelSelectedNumber.fontSize;
const FAR_FONT_SCALE =
  typography.ageWheelFarNumber.fontSize / typography.ageWheelSelectedNumber.fontSize;

function indexToAge(index: number) {
  return sizes.ageWheelMin + index;
}

function ageToIndex(age: number) {
  return age - sizes.ageWheelMin;
}

type AgeWheelReadoutProps = {
  value: number;
};

function AgeWheelReadout({ value }: AgeWheelReadoutProps) {
  return (
    <View style={globalStyles.ageWheelReadout}>
      <Text style={globalStyles.ageWheelReadoutValue}>{value}</Text>
      <View style={globalStyles.ageWheelReadoutBridge}>
        <AuthReadoutArrow />
      </View>
    </View>
  );
}

type AgeWheelSegmentProps = {
  index: number;
  age: number;
  scrollX: SharedValue<number>;
  segmentWidth: number;
  segmentHeight: number;
};

function AgeWheelSegment({
  index,
  age,
  scrollX,
  segmentWidth,
  segmentHeight,
}: AgeWheelSegmentProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index * segmentWidth - scrollX.value);

    return {
      transform: [
        {
          scale: interpolate(
            distance,
            [0, segmentWidth, segmentWidth * 2, segmentWidth * 3],
            [
              sizes.ageWheelSelectedScale,
              sizes.ageWheelAdjacentScale * ADJACENT_FONT_SCALE,
              sizes.ageWheelFarScale * FAR_FONT_SCALE,
              sizes.ageWheelFarScale * 0.9 * FAR_FONT_SCALE,
            ],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        distance,
        [0, segmentWidth, segmentWidth * 2],
        [1, sizes.ageWheelAdjacentOpacity, sizes.ageWheelFarOpacity],
        Extrapolation.CLAMP,
      ),
      color: interpolateColor(
        distance,
        [0, segmentWidth * 0.5],
        [colors.inputText, colors.inputPlaceholder],
      ),
    };
  });

  return (
    <View style={[globalStyles.ageWheelSegmentSlot, { width: segmentWidth, height: segmentHeight }]}>
      <View style={globalStyles.ageWheelSegmentContent}>
        <Animated.Text
          numberOfLines={1}
          style={[
            globalStyles.ageWheelSegmentLabel,
            typography.ageWheelSelectedNumber,
            animatedStyle,
          ]}
        >
          {age}
        </Animated.Text>
      </View>
    </View>
  );
}

export function AgeWheelPicker({ value, onChange }: AgeWheelPickerProps) {
  const { width: windowWidth } = useWindowDimensions();

  const segmentWidth = sizes.ageWheelSegmentWidth;
  const selectionFrameWidth = sizes.ageWheelSelectionFrameWidth;
  const segmentHeight = sizes.ageWheelBannerHeight;
  const ageCount = sizes.ageWheelMax - sizes.ageWheelMin + 1;
  const maxIndex = ageCount - 1;

  const initialIndex = useMemo(
    () => Math.max(0, Math.min(maxIndex, ageToIndex(value))),
    // Compute initial index on mount so user scrolling doesn't reset initialScrollOffset
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxIndex],
  );
  const initialOffset = initialIndex * segmentWidth;

  const scrollX = useSharedValue(initialOffset);
  const sharedValues = useMemo(() => ({ scrollOffset: scrollX }), [scrollX]);
  const [displayValue, setDisplayValue] = useState(value);
  const isMomentumScrolling = useRef(false);

  const ages = useMemo(
    () => Array.from({ length: ageCount }, (_, index) => index),
    [ageCount],
  );
  const sidePadding = Math.max(0, windowWidth / 2 - segmentWidth / 2);

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(maxIndex, index)),
    [maxIndex],
  );

  const updateDisplayByIndex = useCallback(
    (index: number) => {
      setDisplayValue(indexToAge(clampIndex(index)));
    },
    [clampIndex],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    scrollX.value = initialOffset;
  }, [initialOffset, scrollX]);

  useAnimatedReaction(
    () => Math.round(scrollX.value / segmentWidth),
    (currentIndex, previousIndex) => {
      if (previousIndex !== null && currentIndex !== previousIndex) {
        runOnJS(updateDisplayByIndex)(currentIndex);
      }
    },
    [segmentWidth, updateDisplayByIndex],
  );

  const commitOffset = useCallback(
    (offset: number) => {
      const index = clampIndex(Math.round(offset / segmentWidth));
      const nextAge = indexToAge(index);
      setDisplayValue(nextAge);
      onChange(nextAge);
    },
    [clampIndex, onChange, segmentWidth],
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

  const renderSegment = useCallback(
    ({ item: index }: { item: number }) => (
      <AgeWheelSegment
        index={index}
        age={indexToAge(index)}
        scrollX={scrollX}
        segmentWidth={segmentWidth}
        segmentHeight={segmentHeight}
      />
    ),
    [scrollX, segmentHeight, segmentWidth],
  );

  const getFixedItemSize = useCallback(() => segmentWidth, [segmentWidth]);
  const keyExtractor = useCallback((index: number) => String(index), []);

  return (
    <View style={globalStyles.ageWheelPicker}>
      <AgeWheelReadout value={displayValue} />
      <View style={[globalStyles.ageWheelBanner, { width: windowWidth }]}>
        {windowWidth > 0 ? (
          <AnimatedLegendList
            horizontal
            data={ages}
            keyExtractor={keyExtractor}
            renderItem={renderSegment}
            getFixedItemSize={getFixedItemSize}
            estimatedItemSize={segmentWidth}
            estimatedListSize={{ width: windowWidth, height: segmentHeight }}
            initialScrollOffset={initialOffset}
            recycleItems
            drawDistance={windowWidth}
            sharedValues={sharedValues}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            decelerationRate="fast"
            snapToInterval={segmentWidth}
            onMomentumScrollBegin={handleMomentumScrollBegin}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onScrollEndDrag={handleScrollEndDrag}
            contentContainerStyle={{ paddingHorizontal: sidePadding }}
          />
        ) : null}
        <View
          pointerEvents="none"
          style={[
            globalStyles.ageWheelSelectionFrame,
            {
              width: selectionFrameWidth,
              height: segmentHeight,
              left: windowWidth / 2 - selectionFrameWidth / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}
