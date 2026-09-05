import { useRouter, type Href } from "expo-router";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import {
  MenuCalculatorIcon,
  MenuNotificationsIcon,
  MenuProgramsIcon,
  MenuProgressIcon,
  MenuSettingsIcon,
} from "@/components/app/menu-icons";
import { globalStyles, sizes } from "@/styles/global";
import type { ReactNode } from "react";

const WORKOUT_HREF = "/workout" as Href;
const PROGRAMS_HREF = "/workout/start-workout?showEdit=1" as Href;
const PROFILE_HREF = "/workout/profile" as Href;
const PROGRESS_HREF = "/workout/progress" as Href;

type MenuItemConfig = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: Href;
  left: number;
  top: number;
};

const MENU_ITEMS: MenuItemConfig[] = [
  {
    id: "calculator",
    label: "CALCULATOR",
    icon: <MenuCalculatorIcon />,
    left: sizes.menuGridCalculatorLeft,
    top: sizes.menuGridIconTop,
  },
  {
    id: "progress",
    label: "PROGRESS",
    icon: <MenuProgressIcon />,
    href: PROGRESS_HREF,
    left: sizes.menuGridProgressLeft,
    top: sizes.menuGridIconTop,
  },
  {
    id: "programs",
    label: "PROGRAMS",
    icon: <MenuProgramsIcon />,
    href: PROGRAMS_HREF,
    left: sizes.menuGridProgramsLeft,
    top: sizes.menuGridIconTop,
  },
  {
    id: "notifications",
    label: "NOTIFICATIONS",
    icon: <MenuNotificationsIcon />,
    left: sizes.menuGridNotificationsLeft,
    top: sizes.menuGridSecondIconTop,
  },
  {
    id: "settings",
    label: "SETINGS",
    icon: <MenuSettingsIcon />,
    href: PROFILE_HREF,
    left: sizes.menuGridSettingsLeft,
    top: sizes.menuGridSecondIconTop,
  },
];

function MenuGridItem({
  item,
  scaleX,
  onPress,
}: {
  item: MenuItemConfig;
  scaleX: number;
  onPress: (item: MenuItemConfig) => void;
}) {
  return (
    <Pressable
      style={[
        globalStyles.menuGridItem,
        {
          top: item.top,
          left:
            item.left * scaleX - (sizes.menuGridItemWidth - sizes.menuIconSize) / 2,
        },
      ]}
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
  const { width } = useWindowDimensions();
  const scaleX = width / sizes.menuFigmaWidth;

  function closeMenu() {
    router.navigate(WORKOUT_HREF);
  }

  function handleItemPress(item: MenuItemConfig) {
    if (item.href) {
      router.push(item.href);
      return;
    }

    closeMenu();
  }

  return (
    <View style={globalStyles.menuOverlayRoot} pointerEvents="box-none">
      <Pressable
        style={globalStyles.menuOverlayDismissArea}
        onPress={closeMenu}
        accessibilityRole="button"
        accessibilityLabel="Close menu"
      />
      <View style={globalStyles.menuOverlayPanel}>
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
        {MENU_ITEMS.map((item) => (
          <MenuGridItem key={item.id} item={item} scaleX={scaleX} onPress={handleItemPress} />
        ))}
      </View>
    </View>
  );
}
