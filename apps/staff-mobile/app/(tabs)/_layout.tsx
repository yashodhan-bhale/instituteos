import React from "react";
import { Text } from "react-native";
import { Tabs } from "expo-router";

function TabIcon({ emoji }: { emoji: string }) {
    return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#1e40af",
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 1,
                    borderTopColor: "#f3f4f6",
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
                headerStyle: {
                    backgroundColor: "#1e40af",
                },
                headerTintColor: "#ffffff",
                headerTitleStyle: {
                    fontWeight: "700",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: () => <TabIcon emoji="🏠" />,
                    headerTitle: "InstituteOS",
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tasks",
                    tabBarIcon: () => <TabIcon emoji="📋" />,
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    title: "Attendance",
                    tabBarIcon: () => <TabIcon emoji="✅" />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: () => <TabIcon emoji="👤" />,
                }}
            />
        </Tabs>
    );
}
