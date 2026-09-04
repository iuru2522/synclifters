import { LinearGradient } from "expo-linear-gradient";
import { useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MenuCalculatorIcon,
  MenuNotificationsIcon,
  MenuProgramsIcon,
  MenuProgressIcon,
  MenuSettingsIcon,
} from "@/components/app/menu-icons";
import { useMenuOverlay } from "@/features/menu/menu-overlay-context";
import { colors, globalStyles, sizes } from "@/styles/global";
import type { ReactNode } from "react";

const PROGRAMS_HREF = "/workout/start-workout?showEdit=1" as Href;
const PROFILE_HREF = "/workout/profile" as Href;
const PROGRESS_HREF = "/workout/progress" as Href;

type MenuItemConfig = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: Href;
};

const MENU_ITEMS_ROW_ONE: MenuItemConfig[] = [
  {
    id: "calculator",
    label: "CALCULATOR",
    icon: <MenuCalculatorIcon />,
  },
  {
    id: "progress",
    label: "PROGRESS",
    icon: <MenuProgressIcon />,
    href: PROGRESS_HREF,
  },
  {
    id: "programs",
    label: "PROGRAMS",
    icon: <MenuProgramsIcon />,
    href: PROGRAMS_HREF,
  },
];

const MENU_ITEMS_ROW_TWO: MenuItemConfig[] = [
  {
    id: "notifications",
    label: "NOTIFICATIONS",
    icon: <MenuNotificationsIcon />,
  },
  {
    id: "settings",
    label: "SETINGS",
    icon: <MenuSettingsIcon />,
    href: PROFILE_HREF,
  },
];

function MenuGridItem({
  item,
  onPress,
}: {
  item: MenuItemConfig;
  onPress: (item: MenuItemConfig) => void;
}) {
  return (
    <Pressable
      style={globalStyles.menuGridItem}
      onPress={() => {
        onPress(item);
      }}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View style={globalStyles.menuGridIconWrap}>{item.icon}</View>
      <Text style={globalStyles.menuGridLabel}>{item.label}</Text>
    </Pressable>
  );
}

export function MenuOverlay() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOpen, closeMenu } = useMenuOverlay();
  const tabBarReserve = sizes.menuOverlayTabBarReserve + insets.bottom;

  function handleItemPress(item: MenuItemConfig) {
    closeMenu();

    if (item.href) {
      router.push(item.href);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <View
      style={[globalStyles.menuOverlayRoot, { bottom: tabBarReserve }]}
      pointerEvents="box-none"
    >
      <Pressable
        style={globalStyles.menuOverlayDismissArea}
        onPress={closeMenu}
        accessibilityRole="button"
        accessibilityLabel="Close menu"
      />
      <LinearGradient
        colors={[colors.menuOverlayGradientStart, colors.menuOverlayGradientEnd]}
        locations={[0, 0.45]}
        style={globalStyles.menuOverlayPanel}
      >
        <View style={globalStyles.menuOverlayHeader}>
          <Text style={globalStyles.menuOverlayTitle}>MENU</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pro version wait list"
            hitSlop={sizes.backArrowHitSlop}
          >
            <Text style={globalStyles.menuOverlayProLink}>PRO VERSION WAIT LIST</Text>
          </Pressable>
        </View>
        <View style={globalStyles.menuGridRow}>
          {MENU_ITEMS_ROW_ONE.map((item) => (
            <MenuGridItem key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </View>
        <View style={globalStyles.menuGridRowSecond}>
          <View style={globalStyles.menuGridItemSpacer} />
          {MENU_ITEMS_ROW_TWO.map((item) => (
            <MenuGridItem key={item.id} item={item} onPress={handleItemPress} />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}
