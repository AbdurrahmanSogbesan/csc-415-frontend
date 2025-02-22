import { apiGet, apiPost } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/lib/stores/auth";
import { LoginForm, RegisterForm } from "@/app/auth/utils";
import { AxiosError } from "axios";

export function useLogin() {
  const navigate = useNavigate();

  const { setUser, login, logout } = useAuthStore();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginForm) => {
      const res = await apiPost<TokenResponse>("/user/login/", data);

      if (res.access && res.refresh) {
        login(res);
      }
    },
    onSuccess: async () => {
      const user = await apiGet<User>("/user/detail/");

      // prevent admin from accessing the app (make e no crash abeg)
      if (user.role === "admin") throw new Error("Admin not allowed");

      queryClient.setQueryData(["get-user-details"], user);
      setUser(user);

      navigate("/");
    },
    onError: (error) => {
      logout();
      toast({
        title: "Error",
        description:
          error instanceof AxiosError && error.response?.status === 401
            ? "Invalid credentials"
            : error.message || "Something went wrong",
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

export function useGetUser() {
  return useQuery({
    queryKey: ["get-user-details"],
    queryFn: async () => {
      const res = await apiGet<User>("/user/detail/");
      return res;
    },
  });
}
