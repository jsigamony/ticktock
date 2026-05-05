import { mockUsers } from "@/lib/mockData";
import type { User } from "@/types";

type PublicUser = Omit<User, "password">;

export async function GET(): Promise<Response> {
  const publicUsers: PublicUser[] = mockUsers.map(
    ({ password: _pw, ...rest }) => rest,
  );
  return Response.json(publicUsers);
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return Response.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  const user = mockUsers.find(
    (u) => u.email === body.email && u.password === body.password,
  );

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _pw, ...publicUser } = user;
  return Response.json({ user: publicUser }, { status: 200 });
}
