import type { TaskValues } from "../types/taskValues";

export default function Stats({ tasks }: { tasks: TaskValues[] }) {
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-wrap items-center gap-8 md:gap-12">
      {/* Total Metric */}
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Total
        </span>
        <span className="text-2xl font-semibold text-zinc-100 leading-none">
          {total}
        </span>
      </div>

      {/* Divisor vertical */}
      <div className="hidden md:block h-8 w-[1px] bg-zinc-800" />

      {/* Completadas */}
      <div className="flex flex-col min-h-[50px]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Finalizadas
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-zinc-100 leading-none">
            {completed}
          </span>
          <span className="text-xs text-zinc-600 font-medium tracking-tight">
            /{total}
          </span>
        </div>
      </div>

      {/* Progreso Verticalizado */}
      <div className="flex flex-col min-w-[100px] min-h-[50px]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500 mb-2">
          Progreso
        </span>
        <div className="flex flex-col gap-2">
          <span className="text-md font-semibold text-zinc-100 leading-none">
            {percentage}%
          </span>
          <div
            className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
          >
            <div
              className="h-full bg-zinc-400 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
