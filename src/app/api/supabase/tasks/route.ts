import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();

  // Supabase сам зрозуміє, якого юзера дані віддати, завдяки RLS
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order('created_at', { ascending: false });

  // console.log("GET data",data)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const body = await request.json();

  // Отримуємо ID користувача з сесії (це безпечніше, ніж передавати його з фронта)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tasks")
    .insert([{
      user_id: user.id,
      title: body.title,
      description: body.description,
      priority: body.priority,
      tags: body.tags,
      due_date: body.due_date,
      reminder_at: body.reminderDate,
      reminder_frequency: body.reminderFrequency
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}