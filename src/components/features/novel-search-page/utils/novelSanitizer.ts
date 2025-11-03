import DOMPurify from "dompurify";

export function sanitizeNovelDescription(description: string): string {
	const normalizedDescription = description.replace(/\r?\n/g, "<br />");

	return DOMPurify.sanitize(normalizedDescription, {
		USE_PROFILES: { html: true },
		ALLOWED_TAGS: ["a", "b", "br", "em", "i", "strong", "u"],
		ALLOWED_ATTR: ["href", "title", "target", "rel"],
	});
}
