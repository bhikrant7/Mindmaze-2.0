import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, team_name } = body;

    if (!email || !password || !team_name) {
      return NextResponse.json(
        { error: "All credentials are required" },
        { status: 400 }
      );
    }

    console.log("User Data", body);
    // 2. Check credentials against your database
    // const user = await db.user.findUnique({ where: { email } });
    // const isValid = await comparePasswords(password, user.password);

    // 3. Generate JWT or session
    // const token = generateToken(user);

    // For demo purposes, returning a mock success response
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Error in Login" },
      { status: 500 }
    );
  }
}
