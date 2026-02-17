import NetInfo from "@react-native-community/netinfo";
import { useOnlineManager , onlineManager } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";


/**
 * Sync Logic for Offline-First Architecture
 *
 * When online: Push mutations immediately
 * When offline: Queue mutations and retry on connection restore
 *
 * TanStack Query's onlineManager handles this automatically when
 * properly configured with NetInfo.
 */
export function useOfflineSync() {
    useEffect(() => {
        // Only configure NetInfo for native platforms
        if (Platform.OS !== "web") {
            return NetInfo.addEventListener((state) => {
                const isOnline = Boolean(
                    state.isConnected && state.isInternetReachable !== false
                );
                onlineManager.setOnline(isOnline);
            });
        }
    }, []);
}
