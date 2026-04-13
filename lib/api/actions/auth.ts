"use server";
import { cookies } from "next/headers";
import { ApiEndpoints } from "@/lib/api/endpoint";
import { UserAuthData } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function SignInAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const response = await apiFetch(ApiEndpoints.SIGN_IN, {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      const userData = response.data as UserAuthData;
      const cookieStore = await cookies();
      cookieStore.set("jwt_token", userData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return { success: true, user: userData.user };
    }

    return { success: false, error: response.error, message: response.message, user: null };
  } catch (error) {
    return { success: false, error: "Something went wrong", user: null };
  }
}

export async function SignUpAction(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const response = await apiFetch(ApiEndpoints.SIGN_UP, {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      const userData = response.data as UserAuthData;
      const cookieStore = await cookies();
      cookieStore.set("jwt_token", userData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return { success: true, user: userData.user };
    }

    return { success: false, error: response.error, message: response.message, user: null };
  } catch (error) {
    return { success: false, error: "Something went wrong", user: null };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("jwt_token");

  return { success: true };
}
