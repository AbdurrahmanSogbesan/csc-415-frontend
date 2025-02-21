type TokenResponse = {
  access: string;
  refresh: string;
};

type User = {
  exp: number;
  full_name: string;
  iat: number;
  jti: string;
  role: "student" | "admin" | "lecturer";
  token_type: string;
  user_id: number;
};
