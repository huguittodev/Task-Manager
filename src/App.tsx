import { useEffect, useState } from "react";
import type { TaskValues } from "./types/taskValues";
import Task from "./components/Task";
import Stats from "./components/Stats";

export default function App() {
  // 1. ESTADO: Inicializamos leyendo de LocalStorage
  const [tasks, setTasks] = useState<TaskValues[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<TaskValues["priority"]>("Media");

  // Estados para los filtros
  const [filterCompletedValue, setFilterCompletedValue] = useState("todas");
  const [filterPriorityValue, setFilterPriorityValue] = useState("todas");
  const [sortOldestFirst, setSortOldestFirst] = useState(false);

  // 2. EFECTO: Guardar en LocalStorage cada vez que 'tasks' cambie
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
    // Apagamos la edición de otras tareas y encendemos la seleccionada
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
      return true; // "todas"
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
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <div className="max-w-3xl mx-auto pt-16 px-4 pb-20">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Task Master Pro
          </h1>
          <p className="text-slate-400 text-lg">
            Organiza tus metas con precisión
          </p>
        </header>

        {/* 5. ESTADÍSTICAS */}
        <Stats tasks={tasks} />

        {/* Añadir Tarea */}
        <form
          onSubmit={addTask}
          className="bg-slate-900/50 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-2 mb-8 shadow-2xl backdrop-blur-sm"
        >
          <input
            type="text"
            placeholder="¿Qué tienes pendiente?..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-slate-600 focus:ring-0"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select
            className="bg-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none border border-slate-700 focus:border-cyan-500 cursor-pointer"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TaskValues["priority"])
            }
          >
            <option value="Alta">🔴 Alta</option>
            <option value="Media">🟡 Media</option>
            <option value="Baja">🟢 Baja</option>
          </select>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg"
          >
            Añadir
          </button>
        </form>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
          <div className="flex gap-4">
            <select
              value={filterCompletedValue}
              onChange={(e) => setFilterCompletedValue(e.target.value)}
              className="bg-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none border border-slate-700 focus:border-cyan-500 cursor-pointer"
            >
              <option value="todas">Todas las tareas</option>
              <option value="completadas">✓ Completadas</option>
              <option value="incompletas">○ Pendientes</option>
            </select>
            <select
              value={filterPriorityValue}
              onChange={(e) => setFilterPriorityValue(e.target.value)}
              className="bg-slate-800 text-slate-300 rounded-xl px-4 py-2 outline-none border border-slate-700 focus:border-cyan-500 cursor-pointer"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="Alta">🔴 Alta</option>
              <option value="Media">🟡 Media</option>
              <option value="Baja">🟢 Baja</option>
            </select>
          </div>
          <button
            onClick={() => setSortOldestFirst(!sortOldestFirst)}
            className="bg-slate-800 text-slate-300 rounded-xl px-4 py-2 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Ordenar por fecha"
          >
            {sortOldestFirst ? "⬇️ Más antiguas" : "⬆️ Más recientes"}
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
              No hay tareas que coincidan con los filtros.
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
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
