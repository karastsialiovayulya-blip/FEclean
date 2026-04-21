import { ApiEndpoints } from "@/lib/api/endpoint";
import { User } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getUsersAPI() {
  try {
    const response = await apiFetch<User[]>(ApiEndpoints.USERS, {
      method: "GET",
    });
    console.log("API response for fetching users:");
    if (response.ok) {
      return response.data;
    } else {
      console.error("Failed to fetch users:", response.error);
      return [];
    }
  } catch (e) {
    return [];
  }
}
