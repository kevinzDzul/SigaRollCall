import { create } from 'zustand';

type CaptureStore = {
  status: boolean | undefined;
  error: string | undefined;
  setResult: (status?: boolean, error?: string) => void;
  clearResult: () => void;
};

export const useCaptureStore = create<CaptureStore>((set) => ({
  status: undefined,
  error: undefined,
  setResult: (status, error) => set({ status, error }),
  clearResult: () => set({ status: undefined, error: undefined }),
}));
