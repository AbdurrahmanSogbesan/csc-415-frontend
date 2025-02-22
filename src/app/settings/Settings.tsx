import { useAuthStore } from "@/lib/stores/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { PasswordForm, passwordSchema } from "./utils";
import { ProfileForm, profileSchema } from "./utils";
import { useMutation } from "@tanstack/react-query";
import { apiPatch, apiPost } from "@/lib/api";
import { getDirtyValues } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, setUser, logout } = useAuthStore();
  const { toast } = useToast();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email,
      full_name: user?.full_name,
    },
    mode: "onBlur",
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password2: "",
    },
    mode: "onBlur",
  });

  const {
    formState: {
      isValid: isValidProfile,
      isSubmitting: isSubmittingProfile,
      isDirty: isDirtyProfile,
      dirtyFields,
    },
    reset: resetProfile,
  } = profileForm;

  const {
    formState: { isValid: isValidPassword, isSubmitting: isSubmittingPassword },
  } = passwordForm;

  const { mutateAsync: updateProfile } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: Partial<ProfileForm>) =>
      await apiPatch<User>("/user/detail/", data),
    onSuccess: (data) => {
      setUser(data);
      resetProfile({}, { keepValues: true });
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error, "update profile error");
      toast({
        title: "Profile update failed",
        description: "Your profile update failed",
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: updatePassword } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: async (data: PasswordForm) =>
      await apiPost("/user/password_change/", data),
    onSuccess: () => {
      toast({
        title: "Password updated successfully",
        description: "Your password has been updated successfully",
      });
      logout();
    },
    onError: (error) => {
      console.log(error, "update password error");
      toast({
        title: "Invalid credentials",
        description: "Please check your current password",
        variant: "destructive",
      });
    },
  });

  async function onProfileSubmit(data: ProfileForm) {
    const requestBody = getDirtyValues(
      dirtyFields,
      data,
    ) as Partial<ProfileForm>;

    await updateProfile(requestBody);
  }

  async function onPasswordSubmit(data: PasswordForm) {
    await updatePassword(data);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={profileForm.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Role</FormLabel>
                <Input disabled className="capitalize" value={user?.role} />
              </FormItem>

              {user?.role === "student" && (
                <FormItem>
                  <FormLabel>GPA</FormLabel>
                  <Input
                    disabled
                    value={Number(user?.student?.gpa)?.toFixed(2)}
                  />
                  <FormMessage />
                </FormItem>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !isValidProfile || isSubmittingProfile || !isDirtyProfile
                }
                loading={isSubmittingProfile}
              >
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={passwordForm.control}
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
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
                control={passwordForm.control}
                name="new_password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
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
                type="submit"
                className="mt-auto w-full"
                disabled={!isValidPassword || isSubmittingPassword}
                loading={isSubmittingPassword}
              >
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
