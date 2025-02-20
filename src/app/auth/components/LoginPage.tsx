import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const { isSubmitting, isValid } = form.formState;
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { mutateAsync: loginMutation } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiPost<TokenResponse>("/user/login/", data);
      return res;
    },
    onSuccess: (data) => {
      if (data.access && data.refresh) {
        login(data);
        navigate("/");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-balance text-sm">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
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
              <FormItem className="grid gap-2">
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
          >
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
