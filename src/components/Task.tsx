import type { TaskValues } from "../types/taskValues";

interface TaskProps {
  task: TaskValues;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string) => void;
  onApplyEdit: ({
    id,
    title,
    priority,
  }: {
    id: string;
    title: string;
    priority: TaskValues["priority"];
  }) => void;
}

export default function Task({
  task,
  onDeleteTask,
  onToggleComplete,
  onEditTask,
  onApplyEdit,
}: TaskProps) {
  // Estilos de prioridad más discretos (estilo Enterprise)
  const priorityStyles = {
    Alta: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    Media: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Baja: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  };

  return (
    <li
      className={`group border rounded-lg p-4 flex items-center justify-between transition-all duration-200 ${
        task.completed
          ? "bg-zinc-950/50 border-zinc-900 opacity-60"
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Checkbox Personalizado */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors min-w-[20px] ${
            task.completed
              ? "bg-zinc-100 border-zinc-100 text-zinc-900"
              : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
          }`}
        >
          {task.completed && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="w-3 h-3"
            >
              <path d="M20 6L9 17L4 12" />
            </svg>
          )}
        </button>

        {task.editing ? (
          <form
            className="flex-1 flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get("title") as string;
              const priority = formData.get(
                "priority",
              ) as TaskValues["priority"];
              if (title.trim() === "") return;
              onApplyEdit({ id: task.id, title, priority });
            }}
          >
            <input
              type="text"
              name="title"
              defaultValue={task.title}
              autoFocus
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            />
            <select
              name="priority"
              defaultValue={task.priority}
              className="bg-zinc-950 text-zinc-300 text-xs rounded border border-zinc-800 px-2 py-1.5 outline-none"
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <button
              type="submit"
              className="text-xs bg-zinc-100 text-zinc-950 px-3 py-1.5 rounded font-medium hover:bg-zinc-200 transition-colors"
            >
              Confirmar
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-1">
            <span
              className={`text-sm font-medium transition-all ${
                task.completed ? "line-through text-zinc-500" : "text-zinc-200"
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${priorityStyles[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors"
          onClick={() => onEditTask(task.id)}
          title="Editar registro"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
          title="Eliminar registro"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
