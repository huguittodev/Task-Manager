import { useEffect, useState } from "react";
import type { TaskValues } from "./types/taskValues";
import Task from "./components/Task";
import Stats from "./components/Stats";

export default function App() {
  // 1. ESTADO
  const [tasks, setTasks] = useState<TaskValues[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<TaskValues["priority"]>("Media");
  const [filterCompletedValue, setFilterCompletedValue] = useState("todas");
  const [filterPriorityValue, setFilterPriorityValue] = useState("todas");
  const [sortOldestFirst, setSortOldestFirst] = useState(false);

  // 2. EFECTO
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 3. CRUD LOGIC
  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: newTask,
        completed: false,
        editing: false,
        priority,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setNewTask("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const editTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => ({ ...t, editing: t.id === id ? !t.editing : false })),
    );
  };

  const applyEdit = ({
    id,
    title,
    priority,
  }: {
    id: string;
    title: string;
    priority: TaskValues["priority"];
  }) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title, priority, editing: false } : t,
      ),
    );
  };

  // 4. ESTADO DERIVADO
  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filterCompletedValue === "completadas") return task.completed;
      if (filterCompletedValue === "incompletas") return !task.completed;
      return true;
    })
    .filter((task) => {
      if (filterPriorityValue === "todas") return true;
      return task.priority === filterPriorityValue;
    })
    .sort((a, b) => {
      return sortOldestFirst
        ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    });

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-zinc-700">
      <div className="max-w-4xl mx-auto pt-20 px-6">
        {/* Header*/}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">
              Task Manager Pro
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Organiza tus tareas de forma eficiente y elegante.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Stats tasks={tasks} />
          </div>
        </header>

        {/* Input de Tarea */}
        <section className="mb-10">
          <form
            onSubmit={addTask}
            className="bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg flex flex-wrap md:flex-nowrap gap-2 shadow-sm"
          >
            <input
              type="text"
              placeholder="Nueva tarea..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:ring-0"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="bg-zinc-800 text-zinc-300 text-xs rounded-md px-3 py-2 outline-none border border-zinc-700 focus:border-zinc-500 cursor-pointer transition-colors"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskValues["priority"])
                }
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <button
                type="submit"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-medium px-5 py-2 rounded-md transition-all active:scale-[0.98]"
              >
                Añadir
              </button>
            </div>
          </form>
        </section>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex gap-2">
            <select
              value={filterCompletedValue}
              onChange={(e) => setFilterCompletedValue(e.target.value)}
              className="bg-zinc-900 text-zinc-400 text-xs rounded-md px-3 py-2 border border-zinc-800 hover:border-zinc-700 outline-none transition-all cursor-pointer"
            >
              <option value="todas">Estado: Todos</option>
              <option value="completadas">Completadas</option>
              <option value="incompletas">Pendientes</option>
            </select>

            <select
              value={filterPriorityValue}
              onChange={(e) => setFilterPriorityValue(e.target.value)}
              className="bg-zinc-900 text-zinc-400 text-xs rounded-md px-3 py-2 border border-zinc-800 hover:border-zinc-700 outline-none transition-all cursor-pointer"
            >
              <option value="todas">Prioridad: Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <button
            onClick={() => setSortOldestFirst(!sortOldestFirst)}
            className="text-xs text-zinc-500 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            <span className="opacity-50">{sortOldestFirst ? "↓" : "↑"}</span>
            {sortOldestFirst ? "Más antiguas primero" : "Más recientes primero"}
          </button>
        </div>

        {/* Lista de Tareas */}
        <div className="min-h-[300px]">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-sm">
              No se encontraron registros en esta vista.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3">
              {filteredAndSortedTasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onDeleteTask={deleteTask}
                  onToggleComplete={toggleComplete}
                  onEditTask={editTask}
                  onApplyEdit={applyEdit}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
