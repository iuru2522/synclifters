import { useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { WorkoutBellIcon } from "@/components/app/workout-bell-icon";
import { WorkoutExternalLinkIcon } from "@/components/app/workout-external-link-icon";
import { WorkoutGlassCard } from "@/components/app/workout-glass-card";
import { WorkoutStartIcon } from "@/components/app/workout-start-icon";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileFullName } from "@/features/users/profile-display";
import { colors, globalStyles, sizes } from "@/styles/global";

const PROFILE_HREF = "/workout/profile" as Href;

export function WorkoutTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const fullName = formatProfileFullName(profile);

  return (
    <View style={[globalStyles.workoutScreen, { paddingTop: insets.top }]}>
      <ScrollView
        style={globalStyles.workoutScreenScroll}
        contentContainerStyle={globalStyles.workoutScreenScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.workoutScreenHeader}>
          <View style={globalStyles.workoutGreetingBlock}>
            <Text style={globalStyles.workoutGreeting}>Good morning,</Text>
            <Text style={globalStyles.workoutUserName}>{fullName}</Text>
          </View>
          <View style={globalStyles.workoutHeaderActions}>
            <WorkoutBellIcon />
            <Pressable
              style={globalStyles.workoutProfileButton}
              onPress={() => {
                router.push(PROFILE_HREF);
              }}
              hitSlop={sizes.backArrowHitSlop}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            />
          </View>
        </View>
        <View style={globalStyles.workoutGlassCardsRow}>
          <WorkoutGlassCard style={globalStyles.workoutGlassCard}>
            <View style={globalStyles.workoutGlassCardContent}>
              <Text style={globalStyles.workoutGlassCardValue}>19</Text>
              <Text style={globalStyles.workoutGlassCardLabel}>TRAINING DAYS</Text>
            </View>
          </WorkoutGlassCard>
          <WorkoutGlassCard style={globalStyles.workoutGlassCard}>
            <View style={globalStyles.workoutGlassCardContent}>
              <Text style={globalStyles.workoutGlassCardValue}>
                37<Text style={globalStyles.workoutGlassCardLabel}>KG</Text>
              </Text>
              <Text style={globalStyles.workoutGlassCardLabel}>CURRENT WEIGHT</Text>
            </View>
          </WorkoutGlassCard>
        </View>
        <View style={globalStyles.workoutGlassCardWideWrap}>
          <WorkoutGlassCard style={globalStyles.workoutGlassCardWide} />
          <WorkoutGlassCard style={globalStyles.workoutGlassCardBanner} />
        </View>
        <View style={globalStyles.workoutTrainingProgramsLabel}>
          <Text style={globalStyles.workoutGlassCardLabel}>TRAINING PROGRAMS</Text>
        </View>
        <Text style={globalStyles.workoutMyPrograms}>My Programs</Text>
        <View style={globalStyles.workoutCreateProgramButton}>
          <AppButton
            title="Full Body Strength"
            onPress={() => {}}
            borderColor={colors.backArrow}
            textColor={colors.inputText}
            textStyle={globalStyles.workoutProgramFilledButtonText}
            style={globalStyles.workoutProgramFilledButton}
            leftIcon={<WorkoutExternalLinkIcon />}
            rightIcon={<WorkoutStartIcon variant="filled" />}
          />
          <AppButton
            title="Split - Burn"
            onPress={() => {}}
            borderColor={colors.backArrow}
            textColor={colors.inputText}
            textStyle={globalStyles.workoutProgramFilledButtonText}
            style={globalStyles.workoutProgramFilledButton}
            leftIcon={<WorkoutExternalLinkIcon />}
            rightIcon={<WorkoutStartIcon variant="outline" />}
          />
          <AppButton
            title="Create New Program"
            onPress={() => {}}
            borderColor={colors.white}
            borderWidth={sizes.workoutProgramThinBorderWidth}
            pressAccentColor={colors.backArrow}
            style={globalStyles.workoutCreateProgramThinBorder}
          />
        </View>
        <Text style={globalStyles.workoutMyPrograms}>Preset Workouts</Text>
        <View style={globalStyles.workoutCreateProgramButton}>
        <AppButton
          title="Full Body Burn"
          subtitle="3 Days/Week"
          subtitleMeta="Advanced"
          onPress={() => {}}
          borderColor={colors.backArrow}
          borderWidth={sizes.workoutProgramThinBorderWidth}
          textColor={colors.inputFill}
          textStyle={globalStyles.workoutProgramOutlinedButtonText}
          subtitleStyle={globalStyles.workoutProgramOutlinedButtonSubtitle}
          subtitleMetaStyle={globalStyles.workoutProgramOutlinedButtonSubtitleMeta}
          pressAccentColor={colors.backArrow}
          style={globalStyles.workoutProgramOutlinedButton}
          leftIcon={<WorkoutExternalLinkIcon color={colors.backArrow} />}
          rightIcon={<WorkoutStartIcon variant="filled" color={colors.backArrow} />}
        />
        <AppButton
          title="Full Strength"
          subtitle="3 Days/Week"
          subtitleMeta="Advanced"
          onPress={() => {}}
          borderColor={colors.backArrow}
          borderWidth={sizes.workoutProgramThinBorderWidth}
          textColor={colors.inputFill}
          textStyle={globalStyles.workoutProgramOutlinedButtonText}
          subtitleStyle={globalStyles.workoutProgramOutlinedButtonSubtitle}
          subtitleMetaStyle={globalStyles.workoutProgramOutlinedButtonSubtitleMeta}
          pressAccentColor={colors.backArrow}
          style={globalStyles.workoutProgramOutlinedButton}
          leftIcon={<WorkoutExternalLinkIcon color={colors.backArrow} />}
          rightIcon={<WorkoutStartIcon variant="outline" color={colors.backArrow} />}
        />
        </View>
      </ScrollView>
    </View>
  );
}
