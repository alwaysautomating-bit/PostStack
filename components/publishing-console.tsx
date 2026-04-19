"use client";

import { useMemo, useState } from "react";
import { ActionBar } from "@/components/action-bar";
import { OutputPanel } from "@/components/output-panel";
import {
  applyTransform,
  buildPostStack,
  type PostStackDraft,
  type TransformId,
} from "@/lib/post-engine";

const transforms: Array<{ id: TransformId; label: string }> = [
  { id: "tighten", label: "Tighten Opening" },
  { id: "shorten", label: "Shorten" },
  { id: "expand", label: "Expand" },
  { id: "podcast", label: "Podcast Outline" },
];

const starter =
  "Founders do not need a bigger content strategy. They need a clear point, one decisive draft, and the discipline to publish before the window closes.";

export function PublishingConsole() {
  const [source, setSource] = useState(starter);
  const [draft, setDraft] = useState<PostStackDraft>(() => buildPostStack(starter));
  const [status, setStatus] = useState("Ready");

  const canGenerate = source.trim().length > 0;

  const derivedOutputs = useMemo(() => draft?.derived ?? [], [draft]);

  const generate = () => {
    if (!canGenerate) return;
    setDraft(buildPostStack(source));
    setStatus("Generated");
  };

  const transform = (id: TransformId) => {
    if (!draft) return;
    const nextDraft = applyTransform(draft, id);
    setSource(nextDraft.source);
    setDraft(nextDraft);
    setStatus(id === "tighten" ? "Opening tightened" : "Transformed");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-3 md:px-4 md:py-4">
        <header className="mb-3 flex items-center justify-between border-b border-border pb-3">
          <h1 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            PostStack
          </h1>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle" aria-live="polite">
            {status}
          </div>
        </header>

        <section className="mb-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="min-h-24 resize-none border border-border bg-panel px-3 py-3 text-sm leading-6 text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
            placeholder="Paste the point."
            aria-label="Source input"
          />
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate}
            className="border border-border bg-panel px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent focus:border-accent disabled:opacity-30 md:min-w-36"
          >
            Generate
          </button>
        </section>

        <section className="mb-3 flex flex-wrap gap-2">
          {transforms.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => transform(item.id)}
              disabled={!draft}
              className="border border-border bg-background px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition hover:border-border-strong hover:text-foreground focus:border-accent disabled:opacity-30"
            >
              {item.label}
            </button>
          ))}
        </section>

        <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <OutputPanel output={draft.x} primary />
          <div className="grid gap-3">
            {derivedOutputs.map((output) => (
              <OutputPanel key={output.id} output={output} />
            ))}
          </div>
        </div>

        <div className="mt-3">
          <ActionBar draft={draft} onStatus={setStatus} />
        </div>
      </div>
    </main>
  );
}
