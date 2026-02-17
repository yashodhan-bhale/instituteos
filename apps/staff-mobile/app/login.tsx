import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

import { useNetworkStatus } from "../src/hooks/use-network-status";

export default function LoginScreen() {
    const [instituteCode, setInstituteCode] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { isConnected } = useNetworkStatus();

    const handleLogin = async () => {
        if (!instituteCode || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // TODO: Call auth API
            // const response = await fetch(`${API_URL}/api/v1/auth/login`, { ... });
            // For now, simulate login
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Navigate to main app
            router.replace("/(tabs)");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <View style={styles.gradientTop}>
                <View style={styles.gradientOverlay} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>IO</Text>
                    </View>
                    <Text style={styles.appName}>InstituteOS</Text>
                    <Text style={styles.tagline}>The Oxygen for Institutes</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    {!isConnected && (
                        <View style={styles.offlineWarning}>
                            <Text style={styles.offlineText}>
                                📡 You&apos;re offline. Login requires an internet connection.
                            </Text>
                        </View>
                    )}

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Institute Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your institute code"
                            placeholderTextColor="#9ca3af"
                            value={instituteCode}
                            onChangeText={setInstituteCode}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#9ca3af"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor="#9ca3af"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading || !isConnected}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Staff Portal v0.1.0</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    gradientTop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        backgroundColor: "#1e40af",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    gradientOverlay: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1e40af",
    },
    appName: {
        fontSize: 28,
        fontWeight: "800",
        color: "#ffffff",
        marginTop: 16,
    },
    tagline: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 4,
        letterSpacing: 1,
    },
    formContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    offlineWarning: {
        backgroundColor: "#fef3c7",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    offlineText: {
        fontSize: 13,
        color: "#92400e",
        textAlign: "center",
    },
    errorContainer: {
        backgroundColor: "#fee2e2",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 13,
        color: "#991b1b",
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: "#111827",
        backgroundColor: "#f9fafb",
    },
    loginButton: {
        height: 52,
        backgroundColor: "#1e40af",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#1e40af",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    forgotPassword: {
        alignItems: "center",
        marginTop: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: "#1e40af",
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
        marginTop: 32,
    },
    footerText: {
        fontSize: 12,
        color: "#9ca3af",
    },
});
