import { create } from 'zustand';

type CaptureStore = {
  status: boolean | undefined;
  message: string | undefined;
  setResult: (status?: boolean, message?: string) => void;
  clearResult: () => void;
};

export const useCaptureStore = create<CaptureStore>((set) => ({
  status: undefined,
  message: undefined,
  setResult: (status, message) => set({ status, message }),
  clearResult: () => set({ status: undefined, message: undefined }),
}));
