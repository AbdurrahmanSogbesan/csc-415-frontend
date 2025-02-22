type TokenResponse = {
  access: string;
  refresh: string;
};

type User = {
  id: number;
  email: string;
  full_name: string;
  role: "student" | "admin" | "lecturer";
  student: Student | null;
  lecturer: Lecturer | null;
  is_active: boolean;
  is_staff: boolean;
};

type UserDetail = Pick<User, "id" | "email" | "full_name">;

type Student = {
  id: number;
  user: UserDetail;
  matric_number: string;
  department: string;
  gpa: number;
  rank: number;
  has_rated: boolean;
};

type Lecturer = {
  id: number;
  user: UserDetail;
  average_rating: number;
  rating_count: number;
};
