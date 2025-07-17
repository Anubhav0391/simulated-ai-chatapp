import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React from "react";

const PublicRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) router.push("/");

  return children;
};

export default PublicRoutes;
