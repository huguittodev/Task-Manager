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
  const priorityStyles = {
    Alta: "border-red-500/50 bg-red-500/5 text-red-400",
    Media: "border-yellow-500/50 bg-yellow-500/5 text-yellow-400",
    Baja: "border-emerald-500/50 bg-emerald-500/5 text-emerald-400",
  };

  return (
    <li
      className={`group border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        task.completed
          ? "opacity-40 grayscale"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all min-w-[24px] ${
            task.completed
              ? "bg-cyan-500 border-cyan-500"
              : "border-slate-600 hover:border-cyan-400"
          }`}
        >
          {task.completed && <span className="text-white text-xs">✓</span>}
        </button>

        {task.editing ? (
          <form
            className="flex-1 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get("title") as string;
              const priority = formData.get(
                "priority",
              ) as TaskValues["priority"];

              if (title.trim() === "") return; // Evita guardar vacíos

              onApplyEdit({ id: task.id, title, priority });
            }}
          >
            <input
              type="text"
              name="title"
              defaultValue={task.title}
              autoFocus // Se enfoca automáticamente al editar
              className="flex-1 bg-transparent border-b border-slate-600 focus:border-cyan-500 outline-none text-slate-100"
            />
            <select
              name="priority"
              defaultValue={task.priority}
              className="bg-slate-800 text-slate-300 rounded-xl px-2 py-1 outline-none border border-slate-700 focus:border-cyan-500"
            >
              <option value="Alta">🔴 Alta</option>
              <option value="Media">🟡 Media</option>
              <option value="Baja">🟢 Baja</option>
            </select>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-1 rounded-xl transition-all shadow-lg"
            >
              Guardar
            </button>
          </form>
        ) : (
          <div className="flex flex-col">
            <span
              className={`text-lg font-medium transition-all ${
                task.completed
                  ? "line-through text-slate-500"
                  : "text-slate-100"
              }`}
            >
              {task.title}
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold mt-1 px-2 py-0.5 rounded-full w-fit border ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          onClick={() => onEditTask(task.id)}
          title={task.editing ? "Cancelar" : "Editar"}
        >
          {task.editing ? "❌" : "✏️"}
        </button>
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
