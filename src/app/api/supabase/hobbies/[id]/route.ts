import {NextRequest, NextResponse} from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Ожидаем разрешения параметров
  const { id } = await params;

  const supabase = await createServerSupabase();
  const body = await request.json();

  // Удаляем поля, которых точно нет в БД (превентивная мера)
  // Например, если в объекте есть лишние поля из формы
  const { reminderFrequency, ...validData } = body;

  const { data, error } = await supabase
    .from('hobbies') // Убедись, что имя таблицы верное (tasks или hobbies)
    .update(validData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Аналогично для DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from('hobbies')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}