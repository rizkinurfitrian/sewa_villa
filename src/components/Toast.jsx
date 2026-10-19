import { CircleCheck, CircleAlert, Info } from "lucide-react";

const CFG = {
  success: { cls: "border-primary-600 bg-primary-700 text-cream", Icon: CircleCheck, bar: "bg-primary-300" },
  error: { cls: "border-full bg-full text-white", Icon: CircleAlert, bar: "bg-white/50" },
  info: { cls: "border-warm-dark bg-warm text-primary-900", Icon: Info, bar: "bg-primary-900/30" },
};

export default function ToastContainer({ toasts }) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2.5">
      {toasts.map((t) => {
        const { cls, Icon, bar } = CFG[t.type] || CFG.success;
        return (
          <div key={t.id} className={`toast-in pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 shadow-lift ${cls}`}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium leading-snug">{t.message}</p>
            <span className={`toast-bar absolute bottom-0 left-0 h-1 ${bar}`} />
          </div>
        );
      })}
    </div>
  );
}
