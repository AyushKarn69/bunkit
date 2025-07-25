import { create } from 'zustand';

interface AuthState {
  name: string;
  rollNo: string;
  setName: (name: string) => void;
  setRollNo: (rollNo: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  name: '',
  rollNo: '',
  setName: (name) => set({ name }),
  setRollNo: (rollNo) => set({ rollNo }),
  reset: () => set({ name: '', rollNo: '' }),
}));
