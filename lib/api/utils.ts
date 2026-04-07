"use server";

import { cookies } from "next/headers";

export const getAuthTokenAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token");

  if (token) {
    return `${token.name}=${token.value}`;
  } else {
    return false;
  }
};
