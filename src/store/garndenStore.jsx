import { create } from 'zustand';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase.config'; // your Firebase config

const useGardenStore = create((set) => ({
    gardens: [],
    loading: false,
    error: null,

    fetchGardens: async () => {
        set({ loading: true, error: null });
        try {
            const querySnapshot = await getDocs(collection(db, 'gardens'));
            const gardens = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            set({ gardens, loading: false });
        } catch (err) {
            console.error('Failed to fetch gardens:', err);
            set({ error: err.message, loading: false });
        }
    }
}));

export default useGardenStore;
