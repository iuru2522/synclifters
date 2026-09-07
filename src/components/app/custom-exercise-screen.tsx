import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { readSearchParam } from "@/components/app/program-day-params";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileMetrics } from "@/features/users/profile-display";
import {
  formatExerciseNameLabel,
  setSelectedExerciseName,
  useSelectedExerciseName,
} from "@/features/workout/custom-exercise-name";
import {
  setSelectedExerciseImageUri,
  useSelectedExerciseImageUri,
} from "@/features/workout/custom-exercise-image";
import {
  formatMuscleGroupLabel,
  setSelectedMuscleGroup,
  useSelectedMuscleGroup,
} from "@/features/workout/custom-exercise-muscle";
import {
  formatMeasureLabel,
  setSelectedMeasure,
  useSelectedMeasure,
} from "@/features/workout/custom-exercise-measure";
import {
  formatDropsetLvlsLabel,
  setSelectedDropsetLvls,
  useSelectedDropsetLvls,
} from "@/features/workout/custom-exercise-dropset-lvls";
import {
  formatSupersetExerciseLabel,
  setSelectedSupersetExercise,
  useSelectedSupersetExercise,
} from "@/features/workout/custom-exercise-superset-exercise";
import { addExerciseToDay } from "@/features/workout/day-exercises";
import { createCustomExercise } from "@/features/workout/exercise-repository";
import {
  formatRepTypeLabel,
  setSelectedRepType,
  useSelectedRepType,
} from "@/features/workout/rep-type-selection";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";
import { useState } from "react";

const METRICS_SHEET_HREF = "/workout/metrics-sheet" as Href;
const EXERCISE_NAME_SHEET_HREF = "/workout/exercise-name-sheet" as Href;
const MUSCLE_SHEET_HREF = "/workout/muscle-sheet" as Href;
const MEASURE_SHEET_HREF = "/workout/measure-sheet" as Href;
const REP_TYPE_SHEET_HREF = "/workout/rep-type-sheet" as Href;
const DROPSET_LVLS_SHEET_HREF = "/workout/dropset-lvls-sheet" as Href;
const SUPERSET_EXERCISE_SHEET_HREF = "/workout/superset-exercise-sheet" as Href;
const EXERCISE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export function CustomExerciseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuth();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayName?: string | string[];
    dayNames?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const dayName = readSearchParam(params.dayName);
  const dayNames = readSearchParam(params.dayNames);
  const metricsLabel = formatProfileMetrics(profile);
  const selectedExerciseName = useSelectedExerciseName();
  const selectedMuscleGroup = useSelectedMuscleGroup();
  const selectedMeasure = useSelectedMeasure();
  const selectedRepType = useSelectedRepType();
  const selectedDropsetLvls = useSelectedDropsetLvls();
  const selectedSupersetExercise = useSelectedSupersetExercise();
  const selectedImageUri = useSelectedExerciseImageUri();
  const [isSaving, setIsSaving] = useState(false);
  const buttons = [
    { id: "exercise-name", label: formatExerciseNameLabel(selectedExerciseName) },
    { id: "muscle", label: formatMuscleGroupLabel(selectedMuscleGroup) },
    { id: "image", label: "Image" },
    { id: "metrics", label: metricsLabel === "Not set" ? "Metrics" : metricsLabel },
    { id: "measure", label: formatMeasureLabel(selectedMeasure) },
    { id: "rep-type", label: formatRepTypeLabel(selectedRepType) },
    ...(selectedRepType === "dropset"
      ? [{ id: "dropset-lvls", label: formatDropsetLvlsLabel(selectedDropsetLvls) }]
      : []),
    ...(selectedRepType === "superset"
      ? [
          {
            id: "superset-exercise",
            label: formatSupersetExerciseLabel(selectedSupersetExercise),
          },
        ]
      : []),
  ];

  const handleAdd = async () => {
    const exerciseName = selectedExerciseName?.trim();
    if (!exerciseName) {
      Alert.alert("Exercise name required", "Please enter an exercise name before adding.");
      return;
    }

    if (!dayName) {
      Alert.alert("Day required", "Open custom exercise from a program day.");
      return;
    }

    if (!user) {
      Alert.alert("Sign in required", "Sign in to save a custom exercise.");
      return;
    }

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const created = await createCustomExercise(user.uid, {
        name: exerciseName,
        muscleGroup: selectedMuscleGroup ?? "Triceps",
        measure: selectedMeasure,
        repType: selectedRepType,
        dropsetLvls: selectedRepType === "dropset" ? selectedDropsetLvls : null,
        supersetExerciseName:
          selectedRepType === "superset" ? selectedSupersetExercise : null,
        imageUri: selectedImageUri,
      });

      addExerciseToDay(dayName, {
        id: `pe_${created.id}`,
        exerciseId: created.id,
        name: created.name,
        source: "custom",
        muscleGroup: created.muscleGroup,
        measure: created.measure,
        repType: created.repType,
        dropsetLvls: created.dropsetLvls,
        supersetExerciseName: created.supersetExerciseName,
        imageUrl: created.imageUrl,
      });

      setSelectedExerciseName(null);
      setSelectedMuscleGroup(null);
      setSelectedMeasure(null);
      setSelectedRepType("regular");
      setSelectedDropsetLvls(null);
      setSelectedSupersetExercise(null);
      setSelectedExerciseImageUri(null);

      const query = new URLSearchParams({
        ...(programName ? { programName } : {}),
        ...(dayNames ? { dayNames } : {}),
      }).toString();
      router.dismissTo(
        (query
          ? `/workout/add-exercise-to-day?${query}`
          : "/workout/add-exercise-to-day") as Href,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save custom exercise.";
      Alert.alert("Save failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  const applyPickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.fileSize != null && asset.fileSize > EXERCISE_IMAGE_MAX_BYTES) {
      Alert.alert("Photo too large", "Please choose a JPG or PNG up to 10MB.");
      return;
    }

    setSelectedExerciseImageUri(asset.uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Camera permission needed",
        "Allow camera access in Settings to take an exercise photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      applyPickedAsset(result.assets[0]);
    }
  };

  const chooseFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photos permission needed",
        "Allow photo library access in Settings to choose an exercise photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      applyPickedAsset(result.assets[0]);
    }
  };

  const openImageOptions = () => {
    if (process.env.EXPO_OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Take Photo", "Choose from Library", "Cancel"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            void takePhoto();
          } else if (buttonIndex === 1) {
            void chooseFromLibrary();
          }
        },
      );
      return;
    }

    Alert.alert("Upload photo", undefined, [
      {
        text: "Take Photo",
        onPress: () => {
          void takePhoto();
        },
      },
      {
        text: "Choose from Library",
        onPress: () => {
          void chooseFromLibrary();
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={[
          globalStyles.createProgramScreenBody,
          {
            paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
            paddingBottom: Math.max(insets.bottom, spacing.safeAreaBottomMin),
          },
        ]}
      >
        <View style={globalStyles.createDayHeader}>
          <View style={globalStyles.createDayHeaderBack}>
            <AuthBackButton
              title=""
              onPress={() => {
                router.back();
              }}
            />
          </View>
          <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
            NEW EXERCISE
          </Text>
          <Pressable
            style={globalStyles.createDayHeaderMenu}
            onPress={() => {}}
            hitSlop={sizes.backArrowHitSlop}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <CreateDayBurgerIcon />
          </Pressable>
        </View>

        <View style={globalStyles.addExerciseActionButtons}>
          {buttons.map((button) => {
            const isImage = button.id === "image";
            const showImageThumb = isImage && selectedImageUri;

            return (
              <Pressable
                key={button.id}
                style={
                  showImageThumb
                    ? globalStyles.customExerciseImageButton
                    : globalStyles.addExerciseActionButton
                }
                onPress={() => {
                  if (button.id === "metrics") {
                    router.push(METRICS_SHEET_HREF);
                  } else if (button.id === "exercise-name") {
                    router.push(EXERCISE_NAME_SHEET_HREF);
                  } else if (button.id === "muscle") {
                    router.push(MUSCLE_SHEET_HREF);
                  } else if (button.id === "measure") {
                    router.push(MEASURE_SHEET_HREF);
                  } else if (button.id === "rep-type") {
                    router.push(REP_TYPE_SHEET_HREF);
                  } else if (button.id === "dropset-lvls") {
                    router.push(DROPSET_LVLS_SHEET_HREF);
                  } else if (button.id === "superset-exercise") {
                    router.push(SUPERSET_EXERCISE_SHEET_HREF);
                  } else if (button.id === "image") {
                    openImageOptions();
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={button.label}
              >
                <Text style={globalStyles.profileActionButtonText} numberOfLines={1}>
                  {button.label}
                </Text>
                {showImageThumb ? (
                  <View style={globalStyles.customExerciseImageThumb}>
                    <Image
                      source={{ uri: selectedImageUri }}
                      style={globalStyles.customExerciseImageThumbImage}
                      contentFit="cover"
                      accessibilityLabel="Exercise image"
                    />
                  </View>
                ) : (
                  <ProfileActionArrow />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={globalStyles.customExerciseAddWrap}>
          <AppButton
            title={isSaving ? "Saving..." : "Add"}
            onPress={() => {
              void handleAdd();
            }}
            borderColor={colors.white}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutCreateProgramThinBorder}
          />
        </View>
      </View>
    </View>
  );
}
