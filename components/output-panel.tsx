import type { PlatformOutput } from "@/lib/post-engine";

interface OutputPanelProps {
  output: PlatformOutput;
  primary?: boolean;
}

export function OutputPanel({ output, primary = false }: OutputPanelProps) {
  const count = output.content.length;
  const overLimit = output.limit ? count > output.limit : false;

  return (
    <section
      className={[
        "flex min-h-full flex-col border bg-panel",
        primary ? "border-border-strong" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-3 py-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle">
            {primary ? "Primary output" : "Adapted output"}
          </p>
          <h2
            className={[
              "font-semibold uppercase tracking-[0.14em] text-foreground",
              primary ? "text-base" : "text-xs",
            ].join(" ")}
          >
            {output.label}
          </h2>
        </div>
        <span
          className={[
            "font-mono text-[11px]",
            overLimit ? "text-foreground" : "text-subtle",
          ].join(" ")}
        >
          {output.limit ? `${count}/${output.limit}` : count}
        </span>
      </div>
      <div className={primary ? "p-4 md:p-5" : "p-3 md:p-4"}>
        <p
          className={[
            "whitespace-pre-wrap text-foreground",
            primary ? "min-h-64 text-base leading-7 md:text-lg md:leading-8" : "min-h-32 text-sm leading-6",
          ].join(" ")}
        >
          {output.content}
        </p>
      </div>
    </section>
  );
}
