"use client";

import type { PostStackDraft } from "@/lib/post-engine";
import { formatStack } from "@/lib/post-engine";

interface ActionBarProps {
  draft: PostStackDraft | null;
  onStatus: (status: string) => void;
}

export function ActionBar({ draft, onStatus }: ActionBarProps) {
  const disabled = !draft;

  const pushToX = () => {
    if (!draft) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(draft.x.content)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onStatus("X compose opened");
  };

  const copyAll = async () => {
    if (!draft) return;
    await navigator.clipboard.writeText(formatStack(draft));
    onStatus("Stack copied");
  };

  const pushAll = async () => {
    if (!draft) return;
    await navigator.clipboard.writeText(formatStack(draft));
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(draft.x.content)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onStatus("X opened, stack copied");
  };

  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-panel-strong px-3 py-3">
        <button
          type="button"
          onClick={copyAll}
          disabled={disabled}
          className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition hover:border-border-strong hover:text-foreground disabled:opacity-30"
        >
          Copy All
        </button>
        <button
          type="button"
          onClick={pushAll}
          disabled={disabled}
          className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition hover:border-border-strong hover:text-foreground disabled:opacity-30"
        >
          Push All
        </button>
        <button
          type="button"
          onClick={pushToX}
          disabled={disabled}
          className="border border-accent bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-accent-ink transition hover:bg-foreground disabled:border-border disabled:bg-border disabled:text-subtle disabled:opacity-40"
        >
          Push to X
        </button>
    </div>
  );
}
