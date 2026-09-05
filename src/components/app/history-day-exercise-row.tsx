import { useRef } from "react";
import { ActionSheetIOS, Alert, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { globalStyles, sizes } from "@/styles/global";
import type { HistoryDayRecord } from "@/features/workout/history-day-records";

type HistoryDayExerciseRowProps = {
  record: HistoryDayRecord;
  onOpenHistory: () => void;
  onOpenWorkout: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HistoryDayExerciseRow({
  record,
  onOpenHistory,
  onOpenWorkout,
  onEdit,
  onDelete,
}: HistoryDayExerciseRowProps) {
  const swipeableRef = useRef<Swipeable>(null);

  function confirmDelete() {
    swipeableRef.current?.close();
    Alert.alert("Delete exercise?", record.name.toUpperCase(), [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }

  function openRowActions() {
    if (process.env.EXPO_OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Edit", "Delete", "Cancel"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            swipeableRef.current?.close();
            onEdit();
            return;
          }

          if (buttonIndex === 1) {
            confirmDelete();
          }
        },
      );
      return;
    }

    Alert.alert(record.name.toUpperCase(), undefined, [
      {
        text: "Edit",
        onPress: () => {
          swipeableRef.current?.close();
          onEdit();
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: confirmDelete,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  return (
    <Swipeable
      ref={swipeableRef}
      overshootRight={false}
      containerStyle={globalStyles.historyDayExerciseSwipe}
      childrenContainerStyle={globalStyles.historyDayExerciseSwipeChildren}
      renderRightActions={() => (
        <Pressable
          style={globalStyles.historySwipeDelete}
          onPress={confirmDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${record.name}`}
        >
          <Text style={globalStyles.historySwipeDeleteText}>DELETE</Text>
        </Pressable>
      )}
    >
      <View style={globalStyles.doExerciseItem}>
        <View style={globalStyles.doExerciseSelectTarget}>
          <Pressable
            onPress={onOpenHistory}
            onLongPress={openRowActions}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel={`${record.name} history`}
          >
            <View style={globalStyles.doExerciseCircle} />
          </Pressable>
          <Pressable
            style={globalStyles.programDayExerciseNamePressable}
            onPress={onOpenWorkout}
            onLongPress={openRowActions}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel={record.name}
          >
            <Text style={globalStyles.programDayExerciseName} numberOfLines={1}>
              {record.name}
            </Text>
          </Pressable>
        </View>
      </View>
    </Swipeable>
  );
}
