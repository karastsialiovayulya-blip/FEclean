'use server'

export async function uploadImageAction(prevState: any, formData: FormData) {
    if(formData.get("actionType") === "reset") {
        return null
    }

    const responce = await fetch("http://localhost:8080/uploads/images", { method: 'POST', body: formData, });
    if(responce.ok) {
        const result = await responce.json();
        return { success: true, message: "Uploaded"};
    }
    else {
         return { error: "Что-то пошло не так" };
    }
}