import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Tabs, usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Shadows, Radius } from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";
import { useIsModalActive } from "@/utils/modalState";

type TabItem = {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
};

const TABS: TabItem[] = [
  { route: "/(tabs)",         icon: "home-outline",    iconActive: "home",      label: "Home"     },
  { route: "/(tabs)/parcels", icon: "cube-outline",    iconActive: "cube",      label: "Parcels"  },
  { route: "/(tabs)/map",     icon: "location-outline",iconActive: "location",  label: "Map"      },
  { route: "/(tabs)/account", icon: "settings-outline",iconActive: "settings",  label: "Settings" },
];

function FloatingNavBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isModalActive = useIsModalActive();

  if (isModalActive) {
    return null;
  }

  const isActive = (route: string) => {
    if (route === "/(tabs)") return pathname === "/" || pathname === "/(tabs)" || pathname === "/(tabs)/index";
    return pathname.startsWith(route.replace("/(tabs)", ""));
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: insets.bottom + 12,
        left: 24,
        right: 24,
        height: 64,
        backgroundColor: Colors.surfaceDark,
        borderRadius: Radius.pill,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
        ...Shadows.dock,
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.route}
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic.selection();
              router.replace(tab.route as never);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: 48,
            }}
          >
            {active && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  width: 36,
                  height: 36,
                  backgroundColor: Colors.accentPink,
                  borderRadius: Radius.pill,
                  ...Shadows.pinkGlow,
                }}
              />
            )}
            <Ionicons
              name={active ? tab.iconActive : tab.icon}
              size={22}
              color={active ? "#FFFFFF" : Colors.neutral400}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="parcels" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="account" />
      </Tabs>
      <FloatingNavBar />
    </>
  );
}
