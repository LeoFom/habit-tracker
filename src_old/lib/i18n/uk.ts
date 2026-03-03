const uk = {
  // App
  appName: 'HabitTracker',
  appSubtitle: 'Dashboard продуктивності',

  // Header
  greeting: 'Привіт! Готовий до продуктивного дня?',
  searchPlaceholder: 'Почніть пошук тут...',
  settings: 'Налаштування',

  // Time Widget
  showMyTasks: 'Мої задачі',

  // Habit Tracker
  habits: 'Звички',
  addHabit: 'Додати звичку',
  habitName: 'Назва звички',
  habitPlaceholder: 'Поки немає звичок. Додайте першу!',
  daily: 'День',
  weekly: 'Тиждень',
  monthly: 'Місяць',
  yearly: 'Рік',
  streak: 'Серія',
  days: 'днів',

  // Tasks
  tasks: 'Задачі',
  addTask: 'Додати задачу',
  taskTitle: 'Назва задачі',
  taskDescription: 'Опис',
  taskPlaceholder: 'Поки немає задач. Додайте першу!',
  priority: 'Пріоритет',
  urgent: 'Терміново',
  high: 'Високий',
  medium: 'Середній',
  low: 'Низький',
  tags: 'Теги',
  addTag: 'Додати тег',
  dueDate: 'Дата виконання',
  reminder: 'Нагадування',
  reminderDate: 'Дата нагадування',
  reminderFrequency: 'Періодичність',
  once: 'Одноразово',
  everyDay: 'Щодня',
  everyWeek: 'Щотижня',
  completed: 'Виконано',
  delete: 'Видалити',
  save: 'Зберегти',
  cancel: 'Скасувати',
  close: 'Закрити',
  edit: 'Редагувати',

  // AI Recommendations
  aiRecommendations: 'AI рекомендації',
  aiGeneral: 'Загальні поради',
  aiPersonalized: 'Персоналізовані',
  poweredByGemini: 'Працює на Gemini AI',

  // Progress
  progress: 'Прогрес',
  weeklyProgress: 'Прогрес за тиждень',
  tasksByPriority: 'Задачі за пріоритетом',
  productivityTrend: 'Тренд продуктивності',
  completedTasks: 'Виконані задачі',
  totalTasks: 'Всього задач',

  // Contribution Calendar
  activityCalendar: 'Календар активності',
  lessActive: 'Менше',
  moreActive: 'Більше',

  // Settings
  settingsTitle: 'Налаштування',
  tabVisibility: 'Вкладки звичок',
  showCalendar: 'Показувати календар активності',
  aiMode: 'Режим AI рекомендацій',
  language: 'Мова',
  ukrainian: 'Українська',
  english: 'English',

  // Days of week
  mon: 'Пн',
  tue: 'Вт',
  wed: 'Ср',
  thu: 'Чт',
  fri: 'Пт',
  sat: 'Сб',
  sun: 'Нд',

  // Months
  jan: 'Січ', feb: 'Лют', mar: 'Бер', apr: 'Кві',
  may: 'Тра', jun: 'Чер', jul: 'Лип', aug: 'Сер',
  sep: 'Вер', oct: 'Жов', nov: 'Лис', dec: 'Гру',
} as const;

export type TranslationKeys = keyof typeof uk;
export default uk;
