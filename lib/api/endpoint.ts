export const ApiEndpoints = {
  SERVICES: "/services",
  SERVICE_ID: function (id: string) {
    return this.SERVICES + "/" + id;
  },
  SERVICE_CATEGORIES: "/categories",
  REQUIREMENTS: "/services/requirements",
  REQUIREMENT_ID: function (id: number) {
    return this.REQUIREMENTS + "/" + id;
  },
  INVENTORY: "/inventory",
  INVENTORY_ID: function (id: number) {
    return this.INVENTORY + "/" + id;
  },
  IMAGES: "/uploads/images",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  SIGN_UP_CUSTOMER: "/auth/sign-up/customer",
  ORDERS: "/orders",
  ORDERS_SLOTS: "/orders/available-slots",
  ORDERS_CUSTOMER: function (id: number) {
    return this.ORDERS + "/customer/" + id;
  },
  ORDERS_CLEANER: function (id: number) {
    return this.ORDERS + "/cleaner/" + id;
  },
  ORDERS_UNASSIGNED: function (id: number) {
    return this.ORDERS + "/unassigned/" + id;
  },
  ORDER_ID_CLAIM: function (id: number) {
    return this.ORDERS + "/" + id + "/claim";
  },
  ORDER_ID_STATUS: function (id: number) {
    return this.ORDERS + "/" + id + "/change-status";
  },
  USERS: "/users",
  USER_ID: function (id: number) {
    return this.USERS + "/" + id;
  },
};
