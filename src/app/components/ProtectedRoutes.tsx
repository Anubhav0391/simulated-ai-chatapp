import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) router.push("/auth/phone");

  return children;
};

export default ProtectedRoutes;
