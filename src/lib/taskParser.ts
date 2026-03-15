export function parseTaskInput(input: string) {
  const tagMatch = input.match(/#(\w+)/);
  const priorityMatch = input.match(/!(low|medium|high)/);
  const timeMatch = input.match(/(\d{1,2}:\d{2})/);

  return {
    tag: tagMatch?.[1] ?? null,
    priority: priorityMatch?.[1] ?? null,
    time: timeMatch?.[1] ?? null,
  };
}