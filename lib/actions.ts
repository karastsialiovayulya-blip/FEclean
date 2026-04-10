"use server";
import { cookies } from "next/headers";
import { error } from "console";

export async function uploadImageAction(prevState: any, formData: FormData) {
  if (formData.get("actionType") === "reset") {
    return null;
  }

  try {
    const responce = await fetch("http://localhost:8080/uploads/images", {
      method: "POST",
      body: formData,
    });
    if (responce.ok) {
      const result = await responce.json();
      return { success: true, message: "Uploaded" };
    } else {
      return { error: "Something went wrong" };
    }
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function deleteImagesAction(prevState: any, selectedImages: number[]) {
  try {
    const responce = await fetch("http://localhost:8080/uploads/images", {
      method: "DELETE",
      body: JSON.stringify(selectedImages),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function createService(prevState: any, dataToSend: any) {
  try {
    const responce = await fetch("http://localhost:8080/services", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true, timestamp: Date.now() };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function createServiceReq(prevState: any, dataToSend: any) {
  try {
    const responce = await fetch("http://localhost:8080/services/requirements", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true, timestamp: Date.now() };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function editService(prevState: any, dataToSend: any) {
  try {
    const responce = await fetch("http://localhost:8080/services/" + dataToSend.id, {
      method: "PUT",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true, timestamp: Date.now() };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function createInventory(prevState: any, dataToSend: any) {
  try {
    const responce = await fetch("http://localhost:8080/inventory", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true, timestamp: Date.now() };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function editInventory(prevState: any, dataToSend: any) {
  try {
    const responce = await fetch("http://localhost:8080/inventory/" + dataToSend.id, {
      method: "PUT",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (responce.ok) {
      return { success: true, timestamp: Date.now() };
    }
    return { success: false, error: "Something went wrong" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function SignInAction(prevState: any, formData: FormData) {
  try {
    console.log(formData);
    const data = Object.fromEntries(formData.entries());
    const responce = await fetch("http://localhost:8080/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await responce.json();
    if (responce.ok) {
      const cookieStore = await cookies();
      cookieStore.set("jwt_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return { success: true, user: result.user };
    }

    return { success: false, error: result.error, message: result.message };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function SignUpAction(prevState: any, formData: FormData) {
  try {
    console.log(formData);
    const data = Object.fromEntries(formData.entries());
    const responce = await fetch("http://localhost:8080/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await responce.json();
    if (responce.ok) {
      const cookieStore = await cookies();
      cookieStore.set("jwt_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return { success: true, user: result.user };
    }

    return { success: false, error: result.error, message: result.message };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("jwt_token");

  return { success: true };
}
