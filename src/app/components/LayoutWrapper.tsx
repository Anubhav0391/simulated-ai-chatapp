"use client";

import { useAuthStore } from "@/store/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type Theme = "light" | "dark";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const { logout, isLoggedIn } = useAuthStore();

  const toggleTheme = (theme: Theme) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  };

  useEffect(() => {
    toggleTheme((localStorage.getItem("theme") as Theme) ?? "light");
  }, []);

  return (
    <>
      <nav className="px-4 sticky top-0 z-10 bg-background/80 backdrop-blur-lg sm:px-6 py-4 flex shadow-xs border-b justify-between items-center">
        <Link href={"/"} className="font-semibold text-2xl ">
          Gemini
        </Link>
        <div className="flex gap-1 items-center">
          {isLoggedIn && (
            <Button size={"sm"} onClick={logout}>
              Logout
            </Button>
          )}
          <Button
            onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
            variant={"ghost"}
            size={"sm"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </nav>
      <div className="h-[calc(100vh-65px)]">{children}</div>
    </>
  );
};
