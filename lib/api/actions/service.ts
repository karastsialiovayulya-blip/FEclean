"use server";
import { ApiEndpoints } from "@/lib/api/endpoint";
import { Service } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getServices() {
  try {
    const response = await apiFetch<Service[]>(ApiEndpoints.SERVICES, { method: "GET" });
    if (response.ok) {
      console.log(response);
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    const response = await apiFetch<Service>(ApiEndpoints.SERVICE_ID(id), { method: "GET" });
    if (response.ok) {
      return response.data;
    } else return null;
  } catch (e) {
    return null;
  }
}

export async function createService(prevState: any, dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.SERVICES, {
      method: "POST",
      body: dataToSend,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}

export async function editService(prevState: any, dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.SERVICE_ID(dataToSend.id), {
      method: "PUT",
      body: dataToSend,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}

export async function createServiceReq(dataToSend: any) {
  try {
    console.log(dataToSend);
    const response = await apiFetch(ApiEndpoints.REQUIREMENTS, {
      method: "POST",
      body: dataToSend,
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}

export async function deleteServiceReq(serviceReqId: number) {
  try {
    const response = await apiFetch(ApiEndpoints.REQUIREMENT_ID(serviceReqId), {
      method: "DELETE",
    });
    return {
      success: response.ok,
      message: response.message,
      ...(!response.ok && { error: response.error }),
    };
  } catch (e) {
    return { success: false, message: "Something went wrong", error: (e as Error).message };
  }
}
