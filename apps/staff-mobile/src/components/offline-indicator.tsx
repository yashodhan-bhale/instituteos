import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNetworkStatus } from "../hooks/use-network-status";

/**
 * Offline Indicator Banner
 *
 * Shows a persistent banner at the top when the device is offline.
 * Automatically hides when connectivity is restored.
 */
export function OfflineIndicator() {
    const { isConnected } = useNetworkStatus();

    if (isConnected !== false) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>📡</Text>
            <View style={styles.textContainer}>
                <Text style={styles.title}>You are offline</Text>
                <Text style={styles.subtitle}>
                    Changes will sync when connection is restored
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f59e0b",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    icon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "700",
    },
    subtitle: {
        color: "#fef3c7",
        fontSize: 12,
        marginTop: 2,
    },
});
