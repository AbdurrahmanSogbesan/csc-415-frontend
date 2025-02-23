import { apiGet, apiPost } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Loader2, Users } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ratingFormSchema = z.object({
  ratings: z.array(
    z.object({
      lecturer: z.number(),
      rating: z.string().min(1, "Please select a rating"),
    }),
  ),
});

type RateLecturerForm = z.infer<typeof ratingFormSchema>;

export function RateLecturers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const { data: lecturers, isLoading } = useQuery({
    queryKey: ["get-lecturers"],
    queryFn: () => apiGet<Lecturer[]>("/lecturers/"),
  });

  const { mutateAsync: rateLecturers } = useMutation({
    mutationKey: ["rate-lecturers"],
    mutationFn: (data: { lecturer: number; rating: number }[]) =>
      apiPost("/rate_lecturers/", { ratings: data }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["get-lecturers"] });

      toast({
        title: "Lecturers rated successfully",
        description: "Your feedback has been submitted",
        variant: "success",
      });
      form.reset();
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Failed to rate lecturers",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RateLecturerForm) => {
    const formattedData = data.ratings.map(({ lecturer, rating }) => ({
      lecturer,
      rating: parseInt(rating),
    }));

    await rateLecturers(formattedData);
  };

  const form = useForm<RateLecturerForm>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      ratings: [],
    },
    disabled: !!user?.student?.has_rated,
  });

  // Update form when lecturers data is loaded
  useEffect(() => {
    if (lecturers) {
      form.reset({
        ratings: lecturers.map((lecturer) => ({
          lecturer: lecturer.id,
          rating: "",
        })),
      });
    }
  }, [lecturers, form]);

  const { isSubmitting, disabled: formDisabled, isValid } = form.formState;

  const ratings = form.watch("ratings");
  const isComplete =
    ratings.length > 0 &&
    ratings.every(({ rating }) => rating && rating !== "");

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </div>
          <p className="text-sm text-foreground">Loading lecturers...</p>
        </div>
      </div>
    );
  }

  if (!lecturers || lecturers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-foreground">
            <Users className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No Lecturers Found</h3>
          <p className="text-sm text-foreground">
            There are no lecturers available for rating at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Rate Your Lecturers</h2>
          <p className="text-sm text-muted-foreground">
            Please rate all lecturers to submit your evaluation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {lecturers.map((lecturer, index) => (
            <Card key={lecturer.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {lecturer.user.full_name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {Number(lecturer.average_rating || 0).toFixed(1)} (
                  {lecturer.rating_count} ratings)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={`ratings.${index}.rating`}
                  disabled={form.formState.disabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Rating</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} {rating === 1 ? "Star" : "Stars"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full min-w-[200px] md:w-auto"
            disabled={!isComplete || isSubmitting || formDisabled || !isValid}
            loading={isSubmitting}
          >
            {formDisabled ? "Already Submitted" : "Submit Ratings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
