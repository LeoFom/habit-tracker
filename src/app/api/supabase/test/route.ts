import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("example")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();

  // Получаем данные текущего юзера (Leo)
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("example")
    .insert([
      {
        age: body.age,
        name: user.user_metadata.full_name, // Берем из метаданных (Leo)
        email: user.email,                  // Берем из email (l.fomenko003@...)
        user_id: user.id                    // Привязываем к ID
      },
    ])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}