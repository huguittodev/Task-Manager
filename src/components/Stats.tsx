import type { TaskValues } from "../types/taskValues";

// 5. COMPONENTE ESTADÍSTICAS
export default function Stats({ tasks }: { tasks: TaskValues[] }) {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-2xl font-bold text-cyan-400">{total}</p>
        <p className="text-xs text-zinc-500">Total</p>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-2xl font-bold text-emerald-400">{completed}</p>
        <p className="text-xs text-zinc-500">Done</p>
      </div>
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-2xl font-bold text-amber-400">{percentage}%</p>
        <p className="text-xs text-zinc-500">Progress</p>
      </div>
    </div>
  );
}
