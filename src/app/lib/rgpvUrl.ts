const MONTH_MAP: Record<string, string> = {
  january: "jan",
  jan: "jan",
  february: "feb",
  feb: "feb",
  march: "mar",
  mar: "mar",
  april: "apr",
  apr: "apr",
  may: "may",
  june: "jun",
  jun: "jun",
  july: "jul",
  jul: "jul",
  august: "aug",
  aug: "aug",
  september: "sep",
  sept: "sep",
  sep: "sep",
  october: "oct",
  oct: "oct",
  november: "nov",
  nov: "nov",
  december: "dec",
  dec: "dec",
};

/** Lowercase slug with hyphens only (RGPV URL style). */
export function slugifyForRgpv(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractBasename(pathOrName: string): string {
  try {
    const withoutQuery = pathOrName.split("?")[0];
    const segments = withoutQuery.split("/");
    return segments[segments.length - 1] || withoutQuery;
  } catch {
    return pathOrName;
  }
}

/**
 * Build RGPV Online paper URL:
 * https://www.rgpvonline.com/{course}/{subject_code}-{subject_name}-{month_year}.html
 */
export function buildRgpvPaperUrl(
  paper: { display_name?: string; pdf_file?: string },
  options?: { course?: string; subjectName?: string }
): string {
  const course = slugifyForRgpv(options?.course || "be") || "be";

  let raw =
    paper.display_name ||
    extractBasename(paper.pdf_file || "") ||
    "";

  raw = extractBasename(raw);
  let slug = slugifyForRgpv(raw);

  // If filename is too short, try composing from subject metadata + display name
  if ((!slug || slug.length < 8) && options?.subjectName) {
    const subjectSlug = slugifyForRgpv(options.subjectName);
    if (subjectSlug) slug = subjectSlug;
  }

  if (!slug) {
    slug = "question-paper";
  }

  return `https://www.rgpvonline.com/${course}/${slug}.html`;
}

export { MONTH_MAP };
