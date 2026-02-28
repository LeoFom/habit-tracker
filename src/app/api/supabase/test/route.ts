import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface UserData {
  age: number;
  name: string;
  email: string;
}

export async function GET() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("example")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createServerSupabase();

  const body: UserData = await request.json();

  // Тепер можна деструктурувати
  const { age, name, email } = body;

  try {
    // Валідація (опціонально, але бажано)
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // Вставка в таблицю 'test'
    const { data, error } = await supabase
      .from("example") // переконайтеся, що назва таблиці вірна
      .insert([
        {
          age: age,
          name: name,
          email: email
        },
      ])
      .select(); // .select() повертає вставлений рядок

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}