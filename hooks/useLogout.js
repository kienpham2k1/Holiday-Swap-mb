import { create } from "zustand";

const useLogout = create((set) => ({
  isLogout: false,
  onLogout: () => set({ isLogout: true }),
  onLogoutReset: () => set({ isLogout: false }),
}));

export default useLogout;
