import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase server env vars (SUPABASE_SERVICE_ROLE_KEY)",
  );
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, team_name } = body;
    if (!email || !password || !team_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create user via admin API (service role key)
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { team_name },
      });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Insert team record in the DB using the service role key
    // Use the created auth user's id as the teams.id (schema links to auth.users.id)
    const createdUserId = userData.user?.id;
    if (!createdUserId) {
      // cleanup and fail if we don't have a user id
      if (userData?.user?.id)
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      return NextResponse.json(
        { error: "Created user has no id" },
        { status: 500 },
      );
    }

    // Hash password before storing in teams table (never store plaintext)
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertPayload: any = {
      id: createdUserId,
      team_name,
      email,
      password: hashedPassword,
      current_question_id: 0,
      questions_solved: 0,
      has_submitted: false,
      refresh_token: null,
    };

    const { error: insertError } = await supabaseAdmin
      .from("teams")
      .insert([insertPayload]);

    if (insertError) {
      // attempt cleanup: remove the created user
      if (userData?.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: userData.user });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
