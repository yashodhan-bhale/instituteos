import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 60 * 24, // 24 hours — keep cache for offline
            retry: 3,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 3,
        },
    },
});

/**
 * AsyncStorage Persister for offline-first architecture
 *
 * Persists the entire query cache to AsyncStorage so that
 * when the app loads offline, previously fetched data is available.
 */
export const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: "INSTITUTEOS_QUERY_CACHE",
    throttleTime: 1000,
});
