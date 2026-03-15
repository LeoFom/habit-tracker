import OpenAI from "openai";

const ai = new OpenAI({
  apiKey: process.env.HABIT_TRACKER_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const now = new Date().toISOString();

//     const prompt = `
// You are an AI parser for a Habit Tracker / Task Manager.
//
// Your job is to extract structured task data from a user's message.
//
// The user can write in ANY language (English, Ukrainian, Russian, Spanish, etc).
// You must understand the meaning and convert it into structured JSON.
//
// Current time: ${now}
//
// INTENTS:
// - "create_task" → user wants to add a new task
// - "search_task" → user wants to find tasks
// - "update_task" → user wants to modify a task
// - "delete_task" → user wants to remove a task
//
// TASK PARSING RULES:
//
// title:
// - short task name
// - maximum 6 words
// - describes the action
// - remove date/time words
// - examples:
//   "Buy milk"
//   "Зробити документи"
//   "Go to the gym"
//   "Finish report"
//
// description:
// - optional details from the user message
// - can be null if none
//
// due_date:
// - detect natural language dates
// - convert to YYYY-MM-DD
// - examples:
//   "2026-03-12"
//   "2026-12-30"
//
// reminder_at:
// - detect reminder time
// - return full ISO timestamp
//
// reminder_frequency:
// - detect repeating tasks
// - allowed values:
//   daily
//   weekly
//   monthly
//
// tags:
// - detect words starting with #
// - example: #work #health #сім'я
//
// priority:
// - detect priority words
// - urgent / high / medium / low
// - examples:
//   "urgent"
//   "high"
//   "medium"
//   "low"
//
// Return ONLY valid JSON:
//
// {
//   "type": "create_task" | "search_task" | "update_task" | "delete_task",
//   "data": {
//     "title": "string or null",
//     "description": "string or null",
//     "due_date": "YYYY-MM-DD or null",
//     "reminder_at": "ISO timestamp or null",
//     "reminder_frequency": "daily | weekly | monthly | null",
//     "tags": ["string"],
//     "priority": "low | medium | high | urgent | null",
//     "searchQuery": "string or null",
//     "originalTitle": "string or null"
//   }
// }
//
// Examples:
//
// User: "купить молоко завтра терміново в 18:00 #продукти"
// {
//   "type": "create_task",
//   "data": {
//     "title": "Купити молоко",
//     "description": "Треба купити молока завтра в 18:00",
//     "dueDate": "...",
//     "reminder_at": "18:00",
//     "tags": ["продукти"],
//     "priority": "urgent",
//     "searchQuery": null,
//     "originalTitle": null
//   }
// }
//
// User: "удали задачу про спорт"
// {
//   "type": "delete_task",
//   "data": {
//     "title": null,
//     "description": null,
//     "dueDate": null,
//     "reminder_at": null,
//     "tags": [],
//     "priority": null,
//     "searchQuery": null,
//     "originalTitle": "sport"
//   }
// }
//
// User input:
// "${text}"
// `;

    const promptTaskOnly = `
You extract structured task data for a task manager.

Detect the user's intent and extract task fields.

Return ONLY valid JSON.

INTENTS
create_task
search_task
update_task
delete_task

TASK FIELDS

title
Short action name (max 6 words). Remove date/time words.

description
Extra context from the message if present.

due_date
Date in YYYY-MM-DD if mentioned.

reminder_at
Reminder datetime in ISO format if time mentioned.

reminder_frequency
daily | weekly | monthly

priority
urgent | high | medium | low

tags
Words starting with #

searchQuery
Used only for search_task.

originalTitle
Used only for update/delete.

Return JSON:

{
"type": "create_task | search_task | update_task | delete_task",
"data": {
"title": string | null,
"description": string | null,
"due_date": string | null,
"reminder_at": string | null,
"reminder_frequency": "daily | weekly | monthly | null",
"tags": string[],
"priority": "urgent | high | medium | low | null",
"searchQuery": string | null,
"originalTitle": string | null
}
}

Current time: ${now}

User message:
"${text}"
`;

    const aiPromptTaskAndHabit = (text: string) => `
You are an AI assistant for managing tasks and habits.

Analyze the user's message and determine intent. Return ONLY valid JSON.

INTENTS:
- create_task
- search_task
- update_task
- delete_task
- create_habit
- update_habit
- delete_habit
- toggle_habit

FIELDS FOR TASKS:
- title: Short action name (max 6 words). Remove date/time words.
- description: Extra context from the message if present.
- due_date: Date in YYYY-MM-DD if mentioned.
- reminder_at: Reminder datetime in ISO format if time mentioned.
- reminder_frequency: daily | weekly | monthly
- priority: urgent | high | medium | low
- tags: Words starting with #
- searchQuery: Used only for search_task.
- originalTitle: Used only for update/delete_task

FIELDS FOR HABITS:
- name: Habit name (max 4 words)
- frequency: daily | weekly | monthly | yearly
- icon: optional emoji
- color: optional color string
- date: ISO date string for toggle_habit
- originalName: Used for update/delete_habit

Return JSON structure:

{
  "type": "create_task | search_task | update_task | delete_task | create_habit | update_habit | delete_habit | toggle_habit",
  "data": {
    "title": string | null,
    "description": string | null,
    "due_date": string | null,
    "reminder_at": string | null,
    "reminder_frequency": "daily | weekly | monthly | null",
    "priority": "urgent | high | medium | low | null",
    "tags": string[],
    "searchQuery": string | null,
    "originalTitle": string | null,
    
    "name": string | null,
    "frequency": "daily | weekly | monthly | yearly | null",
    "icon": string | null,
    "color": string | null,
    "date": string | null,
    "originalName": string | null
  }
}

Current time: ${now}

User message:
"${text}"
`;

    // const response = await ai.chat.completions.create({
    //   model: "llama-3.1-8b-instant",
    //   temperature: 0,
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You extract structured task data for a task manager and always return valid JSON."
    //     },
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ]
    // });

    const response = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      // ВКЛЮЧАЕМ JSON MODE
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an AI parser for a Habit Tracker / Task Manager application.`
        },
        {
          role: "user",
          content: `My prompt with user text: "${aiPromptTaskAndHabit}"`
        }
      ]
    });

    let responseText = response.choices[0]?.message?.content || "";

    console.log(" !!!  responseText",responseText)
    responseText = responseText.replace(/```json|```/g, "").trim();

    // При JSON Mode очистка через regex обычно не нужна,
    // но trim() оставим для надежности.
    const aiResult = JSON.parse(responseText.trim());
    return Response.json(aiResult);

  } catch (error: any) {
    console.error("Route Error:", error);
    return Response.json(
      { error: error.message || "Internal Error" },
      { status: 500 }
    );
  }
}