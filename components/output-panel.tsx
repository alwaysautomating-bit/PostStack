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
        "border bg-panel",
        primary ? "border-border-strong p-4 md:p-5" : "border-border p-3 md:p-4",
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between gap-4 border-b border-border pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
          {output.label}
        </h2>
        <span
          className={[
            "font-mono text-[11px]",
            overLimit ? "text-accent" : "text-subtle",
          ].join(" ")}
        >
          {output.limit ? `${count}/${output.limit}` : count}
        </span>
      </div>
      <p
        className={[
          "whitespace-pre-wrap text-sm text-foreground",
          primary ? "min-h-52 leading-7 md:text-base" : "min-h-32 leading-6",
        ].join(" ")}
      >
        {output.content}
      </p>
    </section>
  );
}
