import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  phone: string;
  countryCode: string;
  otp: string;
  isLoggedIn?: boolean;
  setPhone: (phone: string) => void;
  setCountryCode: (code: string) => void;
  sendOtp: () => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: "",
      countryCode: "+91",
      otp: "",
      setPhone: (phone) => set({ phone }),
      setCountryCode: (code) => set({ countryCode: code }),
      sendOtp: () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Use this OTP to verify", otp);
        toast.success("OTP sent successfuly");
        set({ otp });
      },
      login: () => {
        set({ isLoggedIn: true, otp: "" });
      },
      logout: () => {
        set({ isLoggedIn: false });
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        otp: state.otp,
      }),
    }
  )
);
