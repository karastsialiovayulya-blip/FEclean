import * as z from "zod";

export const registrUser = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z0-9]/, "Password must contain only alphanumeric characters"),

  email: z.email("Invalid email address").toLowerCase().trim(),

  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),

  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
});
