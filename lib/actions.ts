"use server";

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
