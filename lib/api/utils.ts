"use server";

import { cookies } from "next/headers";

export const getAuthTokenAction = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token");

  if (token) {
    return token.value;
  } else {
    return false;
  }
};

export const checkAuthtoken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token");

  if (token) {
    return true;
  } else {
    return false;
  }
};
