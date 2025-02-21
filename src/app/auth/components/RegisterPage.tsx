import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RegisterForm } from "../utils";
import { registerSchema } from "../utils";
import { useRegister } from "@/hooks/auth";

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
      password2: "",
      matric_number: "",
      department: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutateAsync: register } = useRegister();

  async function onSubmit(data: RegisterForm) {
    await register(data);
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
          <p className="text-balance text-sm text-muted-foreground">
            {step === 1
              ? "Enter your basic information below"
              : "Complete your student details"}
          </p>
        </div>

        {step === 1 ? (
          // Step 1: Basic Information
          <div className="grid gap-3">
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
                      autoComplete="email"
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
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              className="mt-3 w-full"
              onClick={() => {
                const fields = [
                  "full_name",
                  "email",
                  "password",
                  "password2",
                ] as const;
                form.trigger(fields).then((isValid) => {
                  if (isValid) setStep(2);
                });
              }}
            >
              Continue
            </Button>
          </div>
        ) : (
          // Step 2: Student Details
          <div className="grid gap-3" key={`step-${step}`}>
            <FormField
              control={form.control}
              name="matric_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matric Number</FormLabel>
                  <FormControl>
                    <Input placeholder="190805xxx" {...field} />
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
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}

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
