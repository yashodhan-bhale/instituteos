import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>JS</Text>
            </View>
            <Text style={styles.name}>John Smith</Text>
            <Text style={styles.role}>Teacher • Mathematics</Text>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                {[
                    { emoji: "👤", label: "Edit Profile" },
                    { emoji: "🔔", label: "Notifications" },
                    { emoji: "🌙", label: "Dark Mode" },
                    { emoji: "❓", label: "Help & Support" },
                ].map((item, i) => (
                    <TouchableOpacity key={i} style={styles.menuItem}>
                        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => router.replace("/login")}
            >
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 24,
        alignItems: "center",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1e40af",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#ffffff",
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginTop: 16,
    },
    role: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 4,
    },
    menuContainer: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 32,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        gap: 12,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: "#374151",
    },
    menuArrow: {
        fontSize: 20,
        color: "#9ca3af",
    },
    logoutButton: {
        marginTop: 32,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
        backgroundColor: "#fee2e2",
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#991b1b",
    },
});
