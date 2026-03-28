"use server";

export async function uploadImageAction(prevState: any, formData: FormData) {
  if (formData.get("actionType") === "reset") {
    return null;
  }

  const responce = await fetch("http://localhost:8080/uploads/images", {
    method: "POST",
    body: formData,
  });
  if (responce.ok) {
    const result = await responce.json();
    return { success: true, message: "Uploaded" };
  } else {
    return { error: "Что-то пошло не так" };
  }
}

export async function deleteImagesAction(prevState: any, selectedImages: number[]) {
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
  return { success: false, error: "Ошибка" };
}

export async function createService(prevState: any, dataToSend: any) {
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
  return { success: false, error: "Ошибка" };
}

export async function editService(prevState: any, dataToSend: any) {
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
  return { success: false, error: "Ошибка" };
}
