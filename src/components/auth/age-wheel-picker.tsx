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
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { colors, globalStyles, sizes, typography } from "@/styles/global";
import { AuthReadoutArrow } from "./auth-readout-arrow";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<number>);

type AgeWheelPickerProps = {
  value: number;
  onChange: (value: number) => void;
};

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
  const containerStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index * segmentWidth - scrollX.value);

    return {
      transform: [
        {
          scale: interpolate(
            distance,
            [0, segmentWidth, segmentWidth * 2, segmentWidth * 3],
            [
              sizes.ageWheelSelectedScale,
              sizes.ageWheelAdjacentScale,
              sizes.ageWheelFarScale,
              sizes.ageWheelFarScale * 0.9,
            ],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index * segmentWidth - scrollX.value);
    const styleDistance = [0, segmentWidth, segmentWidth * 2];

    const fontSize = interpolate(
      distance,
      styleDistance,
      [
        typography.ageWheelSelectedNumber.fontSize,
        typography.ageWheelAdjacentNumber.fontSize,
        typography.ageWheelFarNumber.fontSize,
      ],
      Extrapolation.CLAMP,
    );
    const lineHeight = interpolate(
      distance,
      styleDistance,
      [
        typography.ageWheelSelectedNumber.lineHeight,
        typography.ageWheelAdjacentNumber.lineHeight,
        typography.ageWheelFarNumber.lineHeight,
      ],
      Extrapolation.CLAMP,
    );

    return {
      fontSize,
      lineHeight,
      opacity: interpolate(
        distance,
        styleDistance,
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
      <Animated.View style={[globalStyles.ageWheelSegmentContent, containerStyle]}>
        <Animated.Text
          numberOfLines={1}
          style={[globalStyles.ageWheelSegmentLabel, labelStyle]}
        >
          {age}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

export function AgeWheelPicker({ value, onChange }: AgeWheelPickerProps) {
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<number>>(null);
  const scrollX = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(value);
  const hasScrolledToInitial = useRef(false);

  const segmentWidth = sizes.ageWheelSegmentWidth;
  const selectionFrameWidth = sizes.ageWheelSelectionFrameWidth;
  const segmentHeight = sizes.ageWheelBannerHeight;
  const ageCount = sizes.ageWheelMax - sizes.ageWheelMin + 1;
  const ages = useMemo(
    () => Array.from({ length: ageCount }, (_, index) => index),
    [ageCount],
  );
  const sidePadding = Math.max(0, windowWidth / 2 - segmentWidth / 2);

  const updateDisplayFromOffset = useCallback(
    (offset: number) => {
      const index = Math.round(offset / segmentWidth);
      setDisplayValue(indexToAge(index));
    },
    [segmentWidth],
  );

  const scrollToAge = useCallback(
    (nextAge: number, animated: boolean) => {
      const index = ageToIndex(nextAge);
      const offset = index * segmentWidth;
      listRef.current?.scrollToOffset({ offset, animated });
      scrollX.value = offset;
      setDisplayValue(nextAge);
    },
    [scrollX, segmentWidth],
  );

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    if (!hasScrolledToInitial.current && windowWidth > 0) {
      hasScrolledToInitial.current = true;
      requestAnimationFrame(() => {
        scrollToAge(value, false);
      });
    }
  }, [scrollToAge, value, windowWidth]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateDisplayFromOffset)(event.contentOffset.x);
    },
  });

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / segmentWidth);
    const nextAge = indexToAge(index);
    setDisplayValue(nextAge);
    onChange(nextAge);
  };

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

  const getItemLayout = useCallback(
    (_: ArrayLike<number> | null | undefined, index: number) => ({
      length: segmentWidth,
      offset: segmentWidth * index,
      index,
    }),
    [segmentWidth],
  );

  return (
    <View style={globalStyles.ageWheelPicker}>
      <AgeWheelReadout value={displayValue} />
      <View style={[globalStyles.ageWheelBanner, { width: windowWidth }]}>
        <AnimatedFlatList
          ref={listRef}
          horizontal
          data={ages}
          keyExtractor={(index) => String(index)}
          renderItem={renderSegment}
          getItemLayout={getItemLayout}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={segmentWidth}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
        />
        <View
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
