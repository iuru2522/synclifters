import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreateDayBurgerIcon } from "@/components/app/create-day-burger-icon";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import {
  createDaySheetHref,
  parseDayNames,
  readSearchParam,
  serializeDayNames,
} from "@/features/workout/nav-params";
import { globalStyles, sizes, spacing } from "@/styles/global";

export function CreateDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayNames?: string | string[];
  }>();
  const programName = readSearchParam(params.programName);
  const dayNames = parseDayNames(params.dayNames);

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={{
          paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
        }}
      >
        <View style={globalStyles.createDayHeaderBlock}>
          <View style={globalStyles.createDayHeader}>
            <View style={globalStyles.createDayHeaderBack}>
              <AuthBackButton
                title=""
                onPress={() => {
                  router.back();
                }}
              />
            </View>
            {programName ? (
              <Text style={globalStyles.createDayHeaderTitle} numberOfLines={1}>
                {programName}
              </Text>
            ) : null}
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
          <Pressable
            style={globalStyles.createDayAccentBar}
            onPress={() => {
              router.push(
                createDaySheetHref({
                  programName,
                  dayNames: serializeDayNames(dayNames),
                }),
              );
            }}
            accessibilityRole="button"
            accessibilityLabel="Create Day"
          >
            <Text style={globalStyles.createDayAccentBarLabel}>CREATE DAY</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
