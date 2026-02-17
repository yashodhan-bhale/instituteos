import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState, useCallback } from "react";

/**
 * Hook to track network connectivity status
 * Used for offline indicator and mutation queueing
 */
export function useNetworkStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [connectionType, setConnectionType] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsConnected(state.isConnected);
            setConnectionType(state.type);
        });

        return () => unsubscribe();
    }, []);

    return { isConnected, connectionType };
}
