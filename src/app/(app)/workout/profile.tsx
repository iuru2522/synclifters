import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { ProfileCameraIcon } from "@/components/app/profile-camera-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import {
  formatProfileFields,
  formatProfileFullName,
  formatProfileBirthday,
  formatProfileFirstWeekDay,
  formatProfileMetrics,
} from "@/features/users/profile-display";
import { colors, globalStyles, spacing } from "@/styles/global";

const PROFILE_ACTION_BUTTON_COUNT = 10;
const PROFILE_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
const NAME_SHEET_HREF = "/workout/name-sheet" as Href;
const EMAIL_SHEET_HREF = "/workout/email-sheet" as Href;
const NEW_PASSWORD_HREF = "/new-password" as Href;
const BIRTHDAY_SHEET_HREF = "/workout/birthday-sheet" as Href;
const WEIGHT_SHEET_HREF = "/workout/weight-sheet" as Href;
const HEIGHT_SHEET_HREF = "/workout/height-sheet" as Href;
const GENDER_SHEET_HREF = "/workout/gender-sheet" as Href;
const SPORTS_EXPERIENCE_SHEET_HREF = "/workout/sports-experience-sheet" as Href;
const METRICS_SHEET_HREF = "/workout/metrics-sheet" as Href;
const WEEK_DAY_SHEET_HREF = "/workout/week-day-sheet" as Href;

const CONNECTORS = [
  { id: "appleHealth", label: "Apple Health" },
  { id: "appleWatch", label: "Apple Watch" },
  { id: "garminConnect", label: "Garmin Connect" },
] as const;

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

type ConnectorId = (typeof CONNECTORS)[number]["id"];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [connectors, setConnectors] = useState<Record<ConnectorId, boolean>>({
    appleHealth: false,
    appleWatch: false,
    garminConnect: false,
  });
  const avatarTop = insets.top + spacing.profileAvatarTop;
  const innerTop = insets.top + spacing.profileAvatarInnerTop;
  const profileFields = Object.fromEntries(
    formatProfileFields(profile).map((field) => [field.label, field.value]),
  );
  const birthdayLabel = formatProfileBirthday(profile);
  const metricsLabel = formatProfileMetrics(profile);
  const firstWeekDayLabel = formatProfileFirstWeekDay(profile);
  const buttonLabels = [
    formatProfileFullName(profile),
    profile?.email?.trim() || "Not set",
    "Password",
    profileFields.Weight ?? "Not set",
    profileFields.Height ?? "Not set",
    profileFields.Gender ?? "Not set",
    birthdayLabel === "Not set" ? "Birthday" : birthdayLabel,
    profileFields["Sports experience"] ?? "Not set",
    metricsLabel === "Not set" ? "Metrics" : metricsLabel,
    firstWeekDayLabel === "Not set" ? "1st Week Day" : firstWeekDayLabel,
  ];

  const applyPickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    if (asset.fileSize != null && asset.fileSize > PROFILE_PHOTO_MAX_BYTES) {
      Alert.alert("Photo too large", "Please choose a JPG or PNG up to 10MB.");
      return;
    }

    setPhotoUri(asset.uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Camera permission needed",
        "Allow camera access in Settings to take a profile photo.",
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
        "Allow photo library access in Settings to choose a profile photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    if (!result.canceled && result.assets[0]) {
      applyPickedAsset(result.assets[0]);
    }
  };

  const openPhotoOptions = () => {
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
    <View style={globalStyles.screen}>
      <AuthBackButton
        title=""
        style={[globalStyles.profileScreenBackButton, { top: avatarTop }]}
        onPress={() => {
          router.back();
        }}
      />
      <ScrollView
        style={globalStyles.profileScreenScroll}
        contentContainerStyle={[
          globalStyles.profileScreenContent,
          globalStyles.profileScreenScrollContent,
          {
            paddingTop: avatarTop,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={[
            globalStyles.profileAvatarInner,
            {
              left: spacing.profileAvatarInnerLeft,
              top: innerTop,
            },
          ]}
          onPress={openPhotoOptions}
          accessibilityRole="button"
          accessibilityLabel="Upload profile photo"
        >
          <View style={globalStyles.profileAvatarPlus}>
            <View style={globalStyles.profileAvatarPlusBarHorizontal} />
            <View style={globalStyles.profileAvatarPlusBarVertical} />
          </View>
        </Pressable>
        <View style={globalStyles.profileScreenBody}>
          <View style={globalStyles.profileAvatarBlock}>
            <View style={globalStyles.profileAvatar}>
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={globalStyles.profileAvatarImage}
                  contentFit="cover"
                  accessibilityLabel="Profile photo"
                />
              ) : (
                <ProfileCameraIcon />
              )}
            </View>
            <View style={globalStyles.profileUploadLabels}>
              <Text style={globalStyles.profileUploadPhotoText}>UPLOAD PHOTO</Text>
              <Text style={globalStyles.profileUploadHintText}>JPG/PNG, UP TO 10MB</Text>
            </View>
          </View>
          <View style={globalStyles.profileActionSection}>
            <View style={globalStyles.profileActionButtons}>
              {Array.from({ length: PROFILE_ACTION_BUTTON_COUNT }, (_, index) => {
                const label = buttonLabels[index] ?? null;

                return (
                  <Pressable
                    key={index}
                    style={globalStyles.profileActionButton}
                    accessibilityRole="button"
                    accessibilityLabel={label ?? undefined}
                    onPress={
                      index === 0
                        ? () => {
                            router.push(NAME_SHEET_HREF);
                          }
                        : index === 1
                          ? () => {
                              router.push(EMAIL_SHEET_HREF);
                            }
                          : index === 2
                            ? () => {
                                router.push(NEW_PASSWORD_HREF);
                              }
                            : index === 3
                              ? () => {
                                  router.push(WEIGHT_SHEET_HREF);
                                }
                              : index === 4
                                ? () => {
                                    router.push(HEIGHT_SHEET_HREF);
                                  }
                                : index === 5
                                  ? () => {
                                      router.push(GENDER_SHEET_HREF);
                                    }
                                  : index === 6
                                    ? () => {
                                        router.push(BIRTHDAY_SHEET_HREF);
                                      }
                                    : index === 7
                                      ? () => {
                                          router.push(SPORTS_EXPERIENCE_SHEET_HREF);
                                        }
                                      : index === 8
                                        ? () => {
                                            router.push(METRICS_SHEET_HREF);
                                          }
                                        : index === 9
                                          ? () => {
                                              router.push(WEEK_DAY_SHEET_HREF);
                                            }
                                          : undefined
                    }
                  >
                    <Text style={globalStyles.profileActionButtonText} numberOfLines={1}>
                      {label}
                    </Text>
                    <ProfileActionArrow />
                  </Pressable>
                );
              })}
            </View>
            <Text style={globalStyles.profileConnectorsText}>CONNECTORS</Text>
            <View style={globalStyles.profileConnectorItems}>
              {CONNECTORS.map((connector) => {
                const connected = connectors[connector.id];

                return (
                  <View key={connector.id} style={globalStyles.profileConnectorRow}>
                    <Text style={globalStyles.profileConnectorItemText}>{connector.label}</Text>
                    <Text
                      style={[
                        globalStyles.profileConnectorStatusText,
                        connected
                          ? globalStyles.profileConnectorStatusConnected
                          : globalStyles.profileConnectorStatusDisconnected,
                        connector.id === "garminConnect"
                          ? globalStyles.profileConnectorGarminStatusText
                          : null,
                      ]}
                    >
                      {connected ? "Connected" : "Disconnected"}
                    </Text>
                    <Switch
                      value={connected}
                      onValueChange={(value) => {
                        setConnectors((current) => ({
                          ...current,
                          [connector.id]: value,
                        }));
                      }}
                      trackColor={{
                        false: colors.resetButtonBorder,
                        true: colors.backArrow,
                      }}
                      thumbColor={colors.white}
                      ios_backgroundColor={colors.resetButtonBorder}
                      accessibilityLabel={connector.label}
                    />
                  </View>
                );
              })}
            </View>
            <Pressable
              onPress={() => {
                void signOut();
              }}
              accessibilityRole="button"
              accessibilityLabel="Log Out"
            >
              <Text style={globalStyles.profileLogOutText}>Log Out</Text>
            </Pressable>
          </View>
        </View>
        <Text
          style={[
            globalStyles.profileDeleteAccountText,
            {
              paddingBottom:
                spacing.profileDeleteAccountBottom +
                Math.max(insets.bottom, spacing.safeAreaBottomMin),
            },
          ]}
        >
          Delete Account
        </Text>
      </ScrollView>
    </View>
  );
}
