"use client";

import { useEffect } from "react";
import { checkAuthtoken } from "@/lib/api/utils";
import { userStore } from "@/lib/store/userStore";

export default function AuthInitializer() {
  const { logout } = userStore();

  useEffect(() => {
    const checkSession = async () => {
      const session = await checkAuthtoken();
      console.log(session);
      logout();
    };
    checkSession();
  }, []);

  return null;
}
