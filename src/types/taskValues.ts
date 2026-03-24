export type Priority = "Baja" | "Media" | "Alta";

export interface TaskValues {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
  priority: Priority;
  createdAt: number;
}
