import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AttendanceScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance</Text>
            <Text style={styles.subtitle}>
                Mark and view attendance. Works offline — syncs when connected.
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
