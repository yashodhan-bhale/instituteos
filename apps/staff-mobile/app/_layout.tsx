import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import {
    queryClient,
    asyncStoragePersister,
} from "../src/lib/query-client";
import { OfflineIndicator } from "../src/components/offline-indicator";
import { useOfflineSync } from "../src/hooks/use-offline-sync";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

function RootLayoutInner() {
    // Configure offline sync with TanStack Query
    useOfflineSync();

    return (
        <View style={{ flex: 1 }}>
            <OfflineIndicator />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: "#1e40af" },
                    headerTintColor: "#ffffff",
                    headerTitleStyle: { fontWeight: "700" },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{ title: "InstituteOS", headerShown: false }}
                />
                <Stack.Screen name="login" options={{ title: "Sign In", headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </View>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PersistQueryClientProvider
                client={queryClient}
                persistOptions={{ persister: asyncStoragePersister }}
            >
                <RootLayoutInner />
            </PersistQueryClientProvider>
        </SafeAreaProvider>
    );
}
