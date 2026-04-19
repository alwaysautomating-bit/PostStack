export type PlatformId = "x" | "linkedin" | "instagram" | "email";

export type TransformId = "tighten" | "shorten" | "expand" | "podcast";

export interface PlatformOutput {
  id: PlatformId;
  label: string;
  limit?: number;
  content: string;
}

export interface PostStackDraft {
  source: string;
  x: PlatformOutput;
  derived: PlatformOutput[];
}

const platformLabels: Record<PlatformId, string> = {
  x: "X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  email: "Email",
};

export function buildPostStack(source: string): PostStackDraft {
  const cleanSource = normalizeWhitespace(source);
  const xPost = buildXPost(cleanSource);

  return {
    source: cleanSource,
    x: {
      id: "x",
      label: platformLabels.x,
      limit: 280,
      content: xPost,
    },
    derived: [
      {
        id: "linkedin",
        label: platformLabels.linkedin,
        limit: 3000,
        content: adaptLinkedIn(xPost, cleanSource),
      },
      {
        id: "instagram",
        label: platformLabels.instagram,
        limit: 2200,
        content: adaptInstagram(xPost, cleanSource),
      },
      {
        id: "email",
        label: platformLabels.email,
        content: adaptEmail(xPost, cleanSource),
      },
    ],
  };
}

export function applyTransform(draft: PostStackDraft, transform: TransformId): PostStackDraft {
  const nextSource = transformSource(draft.source, transform);
  return buildPostStack(nextSource);
}

export function formatStack(draft: PostStackDraft) {
  return [draft.x, ...draft.derived]
    .map((output) => `${output.label}\n\n${output.content}`)
    .join("\n\n---\n\n");
}

function transformSource(source: string, transform: TransformId) {
  if (transform === "tighten") return tightenOpening(source);
  if (transform === "shorten") return shorten(source, 420);
  if (transform === "expand") return expandLongForm(source);
  return expandPodcastOutline(source);
}

function buildXPost(source: string) {
  const stripped = stripDisclaimers(source);
  const firstLine = firstSentence(stripped);
  const claim = makeDecisive(firstLine || stripped);
  const supporting = source
    .split(/[.!?]\s+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .slice(1, 3);

  const body = [claim, ...supporting].join("\n\n");
  return fitToLimit(body, 280);
}

function adaptLinkedIn(xPost: string, source: string) {
  const sentences = sentenceList(source).slice(0, 5);
  const proof = sentences[1] || "The gap is not strategy. It is execution.";
  const consequence = sentences[2] || "Operators win when the next move is obvious.";

  return [
    xPost,
    "",
    proof,
    "",
    consequence,
    "",
    "Move faster. Publish the decision.",
  ].join("\n");
}

function adaptInstagram(xPost: string, source: string) {
  const bullets = sentenceList(source)
    .slice(1, 4)
    .map((sentence) => `- ${fitToLimit(sentence, 96)}`);

  return [xPost, "", ...bullets, "", "Ship the post."].filter(Boolean).join("\n");
}

function adaptEmail(xPost: string, source: string) {
  const sentences = sentenceList(source);
  const subject = fitToLimit(xPost.split("\n")[0], 68);
  const body = sentences.slice(1, 4).join(" ");

  return [`Subject: ${subject}`, "", xPost, "", body || "The next move is the message."].join("\n");
}

function tightenOpening(source: string) {
  const lines = source.split(/\n+/);
  const first = lines[0] || source;
  const tightened = makeDecisive(first)
    .replace(/\bI think\s+/gi, "")
    .replace(/\bmaybe\s+/gi, "")
    .replace(/\bkind of\s+/gi, "")
    .replace(/\bsort of\s+/gi, "");

  return [tightened, ...lines.slice(1)].join("\n").trim();
}

function shorten(source: string, limit: number) {
  return fitToLimit(source, limit);
}

function expandLongForm(source: string) {
  const sentences = sentenceList(source);
  const lead = makeDecisive(sentences[0] || source);
  const middle = sentences.slice(1, 4);

  return [
    lead,
    "",
    middle[0] || "Most teams do not need more ideas. They need a sharper operating sentence.",
    "",
    middle[1] || "The point is to remove options until the useful next action is visible.",
    "",
    middle[2] || "That is where publishing becomes leverage: clear thought, shipped quickly.",
    "",
    "The move: state the point, make the implication obvious, and publish.",
  ].join("\n");
}

function expandPodcastOutline(source: string) {
  const premise = makeDecisive(firstSentence(source) || source);
  const points = sentenceList(source).slice(1, 4);

  return [
    `Working title: ${fitToLimit(premise, 72)}`,
    "",
    "Cold open:",
    premise,
    "",
    "Segment 1: The operating problem",
    points[0] || "Why the team keeps circling the same decision.",
    "",
    "Segment 2: The sharper frame",
    points[1] || "What changes when the message has one job.",
    "",
    "Segment 3: The execution move",
    points[2] || "How to turn the idea into a post people can act on.",
    "",
    "Close:",
    "State the decision. Publish the signal. Move.",
  ].join("\n");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sentenceList(value: string) {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => normalizeWhitespace(sentence))
    .filter(Boolean);
}

function firstSentence(value: string) {
  return sentenceList(value)[0] || normalizeWhitespace(value);
}

function stripDisclaimers(value: string) {
  return value
    .replace(/\bhere'?s the thing[:,]?\s*/gi, "")
    .replace(/\bquick thought[:,]?\s*/gi, "")
    .replace(/\bjust thinking out loud[:,]?\s*/gi, "")
    .trim();
}

function makeDecisive(value: string) {
  const cleaned = normalizeWhitespace(value)
    .replace(/\bwe should consider\b/gi, "we should")
    .replace(/\bit might be worth\b/gi, "it is worth")
    .replace(/\bprobably\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Say the hard part plainly.";
  return cleaned.endsWith(".") || cleaned.endsWith("!") || cleaned.endsWith("?") ? cleaned : `${cleaned}.`;
}

function fitToLimit(value: string, limit: number) {
  if (value.length <= limit) return value;

  const slice = value.slice(0, Math.max(0, limit - 1));
  const boundary = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
  const trimmed = slice.slice(0, boundary > limit * 0.65 ? boundary : slice.length).trim();

  return `${trimmed.replace(/[.,;:!?-]+$/, "")}.`;
}
