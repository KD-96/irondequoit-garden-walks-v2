import { create } from 'zustand';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

const useGardenStore = create((set, get) => ({
    gardens: [],
    loading: false,
    error: null,

    // Loads only once unless cleared
    fetchGardens: async () => {
        const { gardens } = get();

        if (gardens.length > 0) {
            console.log('[GardenStore] Using cached gardens:', gardens.length);
            return;
        }

        console.log('[GardenStore] Fetching gardens from Firestore...');
        set({ loading: true, error: null });

        try {
            const querySnapshot = await getDocs(collection(db, 'gardens'));
            const gardens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('[GardenStore] Fetched and stored gardens:', gardens.length);
            set({ gardens, loading: false });
        } catch (err) {
            console.error('[GardenStore] Failed to fetch gardens:', err);
            set({ error: err.message, loading: false });
        }
    },

    // Always reloads fresh data
    refreshGardens: async () => {
        console.log('[GardenStore] Refreshing gardens from Firestore...');
        set({ loading: true, error: null });

        try {
            const querySnapshot = await getDocs(collection(db, 'gardens'));
            const gardens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('[GardenStore] Refreshed and stored gardens:', gardens.length);
            set({ gardens, loading: false });
        } catch (err) {
            console.error('[GardenStore] Failed to refresh gardens:', err);
            set({ error: err.message, loading: false });
        }
    },

    // Optional manual clear
    clearGardens: () => {
        console.log('[GardenStore] Cleared gardens from state.');
        set({ gardens: [] });
    },
}));

export default useGardenStore;
