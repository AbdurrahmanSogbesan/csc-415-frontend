import { useAuthStore } from "@/lib/stores/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  GraduationCap,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  UserCog,
  StarHalf,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/lib/utils";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  const { data: supervisor, isLoading } = useQuery({
    queryKey: ["get-student-supervisor", user?.role, user?.student?.id],
    queryFn: async () =>
      await apiGet<{ student_id: number; supervisor: Lecturer }>(
        `/student/${user?.student?.id}/supervisor`,
      ),
    enabled: user?.role === "student",
  });

  const { data: assignedStudents, isLoading: loadingAssignedStudents } =
    useQuery({
      queryKey: ["get-assigned-students", user?.role, user?.lecturer?.id],
      queryFn: async () =>
        await apiGet<{ lecturer_id: number; students: Student[] }>(
          `/lecturer/${user?.lecturer?.id}/students`,
        ),
      enabled: user?.role === "lecturer",
    });

  if (user?.role === "student") {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold md:text-lg">
              Student Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground md:text-base">
                Full Name
              </p>
              <p className="mt-1 text-lg font-medium md:text-xl">
                {user.full_name}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  Department
                </p>
                <p className="mt-1 text-base md:text-lg">
                  {user.student?.department}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  Matric Number
                </p>
                <p className="mt-1 text-base md:text-lg">
                  {user.student?.matric_number}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  Email
                </p>
                <p className="mt-1 break-all text-base md:text-lg">
                  {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Middle Row - Rank */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                Class Rank
              </CardTitle>
              <Trophy className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold md:text-4xl">
                #{user.student?.rank}
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Out of your department
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                GPA
              </CardTitle>
              <GraduationCap className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold md:text-4xl">
                {Number(user.student?.gpa || 0).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Current Grade Point Average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Supervisor and Rating Status */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                Supervisor
              </CardTitle>
              <UserCog className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4" />
                  <div className="mt-2 flex items-center gap-1.5">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </>
              ) : supervisor ? (
                <>
                  <div className="truncate text-xl font-medium md:text-2xl">
                    {supervisor.supervisor.user.full_name}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current text-yellow-500 md:h-5 md:w-5" />
                    <span className="text-base text-muted-foreground md:text-lg">
                      {Number(
                        supervisor.supervisor.average_rating || 0,
                      ).toFixed(1)}{" "}
                      ({supervisor.supervisor.rating_count} ratings)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-medium md:text-2xl">
                    No Supervisor
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground md:text-base">
                    Not yet assigned
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                Rating Status
              </CardTitle>
              {user.student?.has_rated ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 md:h-6 md:w-6" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive md:h-6 md:w-6" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium md:text-2xl">
                {user.student?.has_rated ? "Completed" : "Pending"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                Lecturer ratings status
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (user?.role === "lecturer") {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold md:text-lg">
              Lecturer Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground md:text-base">
                Full Name
              </p>
              <p className="mt-1 text-lg font-medium md:text-xl">
                {user.full_name}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  Email
                </p>
                <p className="mt-1 break-all text-base md:text-lg">
                  {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                Average Rating
              </CardTitle>
              <StarHalf className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold md:text-4xl">
                  {Number(user.lecturer?.average_rating || 0).toFixed(1)}
                </div>
                <Star className="h-6 w-6 fill-current text-yellow-500 md:h-7 md:w-7" />
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Out of 5.0 stars
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold md:text-lg">
                Total Ratings
              </CardTitle>
              <Users className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold md:text-4xl">
                {user.lecturer?.rating_count}
              </div>
              <p className="text-sm text-muted-foreground md:text-base">
                Student ratings received
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold md:text-lg">
                Assigned Students
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {assignedStudents?.students?.length || 0} students under
                supervision
              </p>
            </div>
            <Users className="h-5 w-5 text-muted-foreground md:h-6 md:w-6" />
          </CardHeader>
          <CardContent>
            {loadingAssignedStudents ? (
              <div className="grid gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border p-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32" />
                      <div className="mt-1 flex gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : assignedStudents?.students?.length ? (
              <div className="max-h-[400px] overflow-y-auto">
                <div className="grid gap-2">
                  {assignedStudents.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getInitialsFromName(
                            student.user.full_name.split(" ")[0],
                            student.user.full_name.split(" ")[1],
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-medium md:text-base">
                          {student.user.full_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
                          <span>{student.matric_number}</span>
                          <span>•</span>
                          <span className="truncate">{student.department}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <p>No students assigned yet</p>
                <p className="mt-1 text-xs">
                  Students will appear here once they are assigned to you
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
