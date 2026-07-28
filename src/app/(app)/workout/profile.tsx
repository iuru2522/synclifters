import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileActionArrow } from "@/components/app/profile-action-arrow";
import { ProfileCameraIcon } from "@/components/app/profile-camera-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileFields, formatProfileFullName, formatProfileBirthday } from "@/features/users/profile-display";
import { colors, globalStyles, spacing } from "@/styles/global";

const PROFILE_ACTION_BUTTON_COUNT = 10;
const NAME_SHEET_HREF = "/workout/name-sheet" as Href;
const EMAIL_SHEET_HREF = "/workout/email-sheet" as Href;
const NEW_PASSWORD_HREF = "/new-password" as Href;
const BIRTHDAY_SHEET_HREF = "/workout/birthday-sheet" as Href;

const CONNECTORS = [
  { id: "appleHealth", label: "Apple Health" },
  { id: "appleWatch", label: "Apple Watch" },
  { id: "garminConnect", label: "Garmin Connect" },
] as const;

type ConnectorId = (typeof CONNECTORS)[number]["id"];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const insets = useSafeAreaInsets();
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
  const buttonLabels = [
    formatProfileFullName(profile),
    profile?.email?.trim() || "Not set",
    "Password",
    profileFields.Weight ?? "Not set",
    profileFields.Height ?? "Not set",
    profileFields.Gender ?? "Not set",
    birthdayLabel === "Not set" ? "Birthday" : birthdayLabel,
    profileFields["Sports experience"] ?? "Not set",
    "Metrics",
    "1st Week Day",
  ];

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
        <View
          style={[
            globalStyles.profileAvatarInner,
            {
              left: spacing.profileAvatarInnerLeft,
              top: innerTop,
            },
          ]}
        >
          <View style={globalStyles.profileAvatarPlus}>
            <View style={globalStyles.profileAvatarPlusBarHorizontal} />
            <View style={globalStyles.profileAvatarPlusBarVertical} />
          </View>
        </View>
        <View style={globalStyles.profileScreenBody}>
          <View style={globalStyles.profileAvatarBlock}>
            <View style={globalStyles.profileAvatar}>
              <ProfileCameraIcon />
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
                            : index === 6
                              ? () => {
                                  router.push(BIRTHDAY_SHEET_HREF);
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
