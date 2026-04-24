import { ApiEndpoints } from "@/lib/api/endpoint";
import { Cleaner, MonthlyOrders, Order, TotalStatistics } from "@/lib/types/types";
import { apiFetch } from "./apiFetch";

export async function getTotalsAPI() {
  try {
    const response = await apiFetch<TotalStatistics[]>(ApiEndpoints.ANALYTICS_TOTAL, {
      method: "GET",
    });
    if (response.ok) {
      console.log(response);
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}

export async function getTopCleanersAPI() {
  try {
    const response = await apiFetch<Cleaner[]>(ApiEndpoints.ANALYTICS_TOP_CLEANERS, {
      method: "GET",
    });
    if (response.ok) {
      console.log(response);
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}

export async function getOrdersByMonthAPI() {
  try {
    const response = await apiFetch<MonthlyOrders[]>(ApiEndpoints.ANALYTICS_ORDERS_BY_MONTH, {
      method: "GET",
    });
    if (response.ok) {
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}

export async function getRecentOrdersAPI() {
  try {
    const response = await apiFetch<Order[]>(ApiEndpoints.ANALYTICS_RECENT_ORDERS, {
      method: "GET",
    });
    if (response.ok) {
      return response.data;
    } else return [];
  } catch (e) {
    return [];
  }
}
