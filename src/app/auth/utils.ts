import { passwordValidation } from "@/lib/utils";
import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .refine(passwordValidation, {
        message: "Your password is too weak. Try a stronger one.",
      }),
    password2: z.string({
      required_error: "Confirm password is required",
    }),
    matric_number: z.string().min(6, "Please enter a valid matric number"),
    department: z.string().min(2, "Please enter your department"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],
  });

export type LoginForm = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;
