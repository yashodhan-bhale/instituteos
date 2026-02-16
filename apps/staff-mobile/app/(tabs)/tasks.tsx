import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TasksScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
                Your tasks will appear here. This screen syncs offline.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 8,
        textAlign: "center",
    },
});
