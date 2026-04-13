export const ApiEndpoints = {
  SERVICES: "/services",
  SERVICE_ID: function (id: string) {
    return this.SERVICES + "/" + id;
  },
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
};
