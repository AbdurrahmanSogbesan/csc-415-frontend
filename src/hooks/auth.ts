import { apiPost } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/lib/stores/auth";
import { LoginForm, RegisterForm } from "@/app/auth/utils";

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginForm) => {
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
        description: "Invalid credentials",
        variant: "destructive",
      });
      console.error(error);
    },
  });
}

export function useRegister() {
  const { toast } = useToast();
  const { mutateAsync: loginMutation } = useLogin();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterForm) => {
      const res = await apiPost<RegisterForm>("/user/register/", {
        ...data,
        role: "student",
      });
      return res;
    },
    onSuccess: async (_, variables) => {
      const { email, password } = variables;
      await loginMutation({ email, password });
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
}
