"use server";
import { ApiEndpoints } from "@/lib/api/endpoint";
import { CleanerAvailabilitySlot, Order } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getSlotsAPI(dataToSend: any) {
  try {
    const response = await apiFetch<CleanerAvailabilitySlot[]>(ApiEndpoints.ORDERS_SLOTS, {
      method: "POST",
      body: dataToSend,
    });
    console.log("API response for slots:");
    if (response.ok) {
      return response.data;
    } else {
      console.error("Failed to fetch slots:", response.error);
      return [];
    }
  } catch (e) {
    return [];
  }
}

export async function createOrderAPI(dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.ORDERS, {
      method: "POST",
      body: dataToSend,
    });
    console.log("API response for order creation:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to create order:", response.error);
      return {
        ok: false,
        data: null,
        error: response.error || response.message || "Failed to create order.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: "Something went wrong while creating the order.",
    };
  }
}

export async function getOrdersAPI(id?: number) {
  try {
    const endpoint = typeof id === "number" ? ApiEndpoints.ORDERS_CUSTOMER(id) : ApiEndpoints.ORDERS;
    const response = await apiFetch<Order[]>(endpoint, {
      method: "GET",
    });
    console.log("API response for fetching orders:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to fetch orders:", response.error);
      return {
        ok: false,
        data: [],
        error: response.error || response.message || "Failed to fetch orders.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: [],
      error: "Something went wrong while fetching orders.",
    };
  }
}

export async function getCleanerOrdersAPI(id: number) {
  try {
    const response = await apiFetch<Order[]>(ApiEndpoints.ORDERS_CLEANER(id), {
      method: "GET",
    });
    console.log("API response for fetching cleaner orders:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to fetch cleaner orders:", response.error);
      return {
        ok: false,
        data: [],
        error: response.error || response.message || "Failed to fetch cleaner orders.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: [],
      error: "Something went wrong while fetching cleaner orders.",
    };
  }
}

export async function getUnassignedOrdersAPI(id: number) {
  try {
    const response = await apiFetch<Order[]>(ApiEndpoints.ORDERS_UNASSIGNED(id), {
      method: "GET",
    });
    console.log("API response for fetching unassigned orders:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to fetch unassigned orders:", response.error);
      return {
        ok: false,
        data: [],
        error: response.error || response.message || "Failed to fetch unassigned orders.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: [],
      error: "Something went wrong while fetching unassigned orders.",
    };
  }
}

export async function claimOrderAPI(orderId: number, dataToSend: any) {
  try {
    const response = await apiFetch(ApiEndpoints.ORDER_ID_CLAIM(orderId), {
      method: "POST",
      body: dataToSend,
    });
    console.log("API response for claiming order:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to claim order:", response.error);
      return {
        ok: false,
        data: null,
        error: response.error || response.message || "Failed to claim order.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: "Something went wrong while claiming the order.",
    };
  }
}

export async function changeOrderStatusAPI(orderId: number, newStatus: any) {
  try {
    const response = await apiFetch(ApiEndpoints.ORDER_ID_STATUS(orderId), {
      method: "POST",
      body: newStatus,
    });
    console.log("API response for changing order status:");
    if (response.ok) {
      return {
        ok: true,
        data: response.data,
        error: "",
      };
    } else {
      console.error("Failed to change order status:", response.error);
      return {
        ok: false,
        data: null,
        error: response.error || response.message || "Failed to change order status.",
      };
    }
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: "Something went wrong while changing the order status.",
    };
  }
}
