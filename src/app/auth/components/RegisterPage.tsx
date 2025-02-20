import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_2: z.string(),
    matric_number: z.string().min(6, "Please enter a valid matric number"),
    department: z.string().min(2, "Please enter your department"),
  })
  .refine((data) => data.password === data.password_2, {
    message: "Passwords must match",
    path: ["password_2"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [step, setStep] = useState(1);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      matric_number: "",
      department: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  function onSubmit(data: RegisterForm) {
    console.log(data);
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-balance text-sm">
            {step === 1
              ? "Enter your basic information below"
              : "Complete your student details"}
          </p>
        </div>

        <div className="grid gap-3">
          {step === 1 ? (
            // Step 1: Basic Information
            <>
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="mt-3 w-full"
                onClick={() => {
                  const fields = ["full_name", "email", "password"] as const;
                  form.trigger(fields).then((isValid) => {
                    if (isValid) setStep(2);
                  });
                }}
              >
                Continue
              </Button>
            </>
          ) : (
            // Step 2: Student Details
            <>
              <FormField
                control={form.control}
                name="matric_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matric Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-3 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
