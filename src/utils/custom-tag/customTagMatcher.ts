import type { CustomTag } from "@/types/customTag";
import type { Novel } from "@/types/novel";

function hasAllTags(novelTags: Set<string>, customTag: CustomTag): boolean {
	return customTag.tags.every((tag) => novelTags.has(tag.toLowerCase()));
}

function mergeTags(baseTags: string[], customTagNames: string[]): string[] {
	const merged = [...baseTags];
	const seen = new Set(baseTags.map((tag) => tag.toLowerCase()));

	for (const name of customTagNames) {
		const normalized = name.toLowerCase();
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		merged.push(name);
	}

	return merged;
}

export function applyCustomTagsToNovels(
	novels: Novel[],
	customTags: CustomTag[],
): Novel[] {
	if (customTags.length === 0) return novels;

	let hasApplied = false;

	const updatedNovels = novels.map((novel) => {
		const novelTagSet = new Set(novel.tags.map((tag) => tag.toLowerCase()));
		const matchedCustomTagNames = customTags
			.filter((customTag) => hasAllTags(novelTagSet, customTag))
			.map((customTag) => customTag.name);

		if (matchedCustomTagNames.length === 0) return novel;

		const mergedTags = mergeTags(novel.tags, matchedCustomTagNames);

		if (mergedTags.length === novel.tags.length) return novel;

		hasApplied = true;

		return {
			...novel,
			tags: mergedTags,
		};
	});

	return hasApplied ? updatedNovels : novels;
}
