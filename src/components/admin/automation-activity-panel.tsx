import { Bot, CheckCircle2, Clock3 } from "lucide-react";

type ActivityItem = {
  id: string;
  type: string;
  createdAt: Date;
  payload: Record<string, unknown> | null;
};

type TaskItem = {
  id: string;
  type: string;
  priority: string;
  status: string;
  createdAt: Date;
};

type AutomationActivityPanelProps = {
  lastActions: ActivityItem[];
  pendingTasks: TaskItem[];
  completedTasks: TaskItem[];
};

function prettyLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AutomationActivityPanel({
  lastActions,
  pendingTasks,
  completedTasks,
}: AutomationActivityPanelProps) {
  return (
    <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/55 p-5">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-cyan-200 uppercase">
          <Bot className="size-3.5" />
          Automation Activity
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">Automation Activity</h3>
        <p className="mt-1 text-sm text-slate-300">Recent automation actions and task queue for this lead.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
          <p className="text-xs text-slate-400">Last actions</p>
          <p className="mt-1 text-xl font-semibold text-white">{lastActions.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
          <p className="text-xs text-slate-400">Pending tasks</p>
          <p className="mt-1 text-xl font-semibold text-amber-200">{pendingTasks.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-3">
          <p className="text-xs text-slate-400">Completed tasks</p>
          <p className="mt-1 text-xl font-semibold text-emerald-200">{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/55 p-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">
            <Clock3 className="size-3.5" /> Pending tasks
          </p>
          {pendingTasks.length ? (
            pendingTasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
                <p className="text-sm font-medium text-slate-100">{prettyLabel(task.type)}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Priority: {prettyLabel(task.priority)} • Status: {prettyLabel(task.status)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{task.createdAt.toLocaleString("en-GB")}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No pending tasks.</p>
          )}
        </div>

        <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/55 p-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">
            <CheckCircle2 className="size-3.5" /> Completed tasks
          </p>
          {completedTasks.length ? (
            completedTasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
                <p className="text-sm font-medium text-slate-100">{prettyLabel(task.type)}</p>
                <p className="mt-0.5 text-xs text-slate-400">{prettyLabel(task.status)}</p>
                <p className="mt-0.5 text-xs text-slate-500">{task.createdAt.toLocaleString("en-GB")}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No completed tasks yet.</p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/55 p-3">
        <p className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Last actions</p>
        {lastActions.length ? (
          lastActions.map((action) => (
            <div key={action.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-100">{prettyLabel(action.type)}</p>
                <p className="text-xs text-slate-400">{action.createdAt.toLocaleString("en-GB")}</p>
              </div>
              {action.payload ? (
                <p className="mt-1 text-xs text-slate-300">
                  {Object.entries(action.payload)
                    .slice(0, 3)
                    .map(([key, value]) => `${prettyLabel(key)}: ${String(value)}`)
                    .join(" • ")}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No automation actions recorded yet.</p>
        )}
      </div>
    </article>
  );
}
