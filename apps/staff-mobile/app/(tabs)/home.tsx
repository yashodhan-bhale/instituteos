import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNetworkStatus } from "../../src/hooks/use-network-status";

export default function HomeScreen() {
    const { isConnected } = useNetworkStatus();

    return (
        <ScrollView style={styles.container}>
            {/* Connection Status */}
            <View
                style={[
                    styles.statusBadge,
                    { backgroundColor: isConnected ? "#dcfce7" : "#fef3c7" },
                ]}
            >
                <Text
                    style={[
                        styles.statusText,
                        { color: isConnected ? "#166534" : "#92400e" },
                    ]}
                >
                    {isConnected ? "🟢 Online" : "🟡 Offline — data cached locally"}
                </Text>
            </View>

            {/* Quick Stats */}
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: "#eff6ff" }]}>
                    <Text style={styles.statEmoji}>📋</Text>
                    <Text style={[styles.statValue, { color: "#1e40af" }]}>5</Text>
                    <Text style={styles.statLabel}>Tasks Due</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#f0fdf4" }]}>
                    <Text style={styles.statEmoji}>✅</Text>
                    <Text style={[styles.statValue, { color: "#166534" }]}>3</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#fefce8" }]}>
                    <Text style={styles.statEmoji}>⏰</Text>
                    <Text style={[styles.statValue, { color: "#854d0e" }]}>2</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#fef2f2" }]}>
                    <Text style={styles.statEmoji}>🔔</Text>
                    <Text style={[styles.statValue, { color: "#991b1b" }]}>1</Text>
                    <Text style={styles.statLabel}>Alerts</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
                {[
                    { emoji: "✅", label: "Mark Attendance", color: "#1e40af" },
                    { emoji: "📝", label: "Add Task", color: "#7c3aed" },
                    { emoji: "📊", label: "View Reports", color: "#059669" },
                ].map((action, i) => (
                    <View key={i} style={[styles.actionButton, { borderColor: action.color }]}>
                        <Text style={{ fontSize: 24 }}>{action.emoji}</Text>
                        <Text style={[styles.actionLabel, { color: action.color }]}>
                            {action.label}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 16,
    },
    statusBadge: {
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        marginBottom: 24,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 28,
        fontWeight: "800",
    },
    statLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    actionsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
});
