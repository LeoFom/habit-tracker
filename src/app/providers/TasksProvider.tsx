"use client";

import React, {createContext} from "react";
import {CreateTaskDTO, Task, TaskPriority} from "@/lib/types";
import {useTasksInternal} from "@/hooks/useTasksInternal";

export interface TasksContextType {
  tasks: Task[];
  loading: boolean;

  addTask: (task: CreateTaskDTO) => Promise<Response | void>;
  // addTask: (task: Partial<Task>) => Promise<Response | void>;
  removeTask: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  toggleTask: (id: string) => Promise<void>;

  fetchTasks: () => Promise<void>;

  sortedTasks: Task[];
  completedCount: number;

  getTasksByPriority: (priority: TaskPriority) => Task[];

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}


export const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: any) {
  const tasksState = useTasksInternal();

  return (
    <TasksContext.Provider value={tasksState}>
      {children}
    </TasksContext.Provider>
  );
}