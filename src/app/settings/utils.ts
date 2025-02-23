import { passwordValidation } from "@/lib/utils";
import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  full_name: z.string().min(1, "Full name is required"),
});

export const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(passwordValidation, {
        message: "You password is too weak. Try a stronger one.",
      }),
    new_password2: z.string(),
  })
  .refine((data) => data.new_password === data.new_password2, {
    message: "Passwords do not match",
    path: ["new_password2"],
  });

export type ProfileForm = z.infer<typeof profileSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
