import { CATEGORY_COLORS, type TagCategory } from "@/types/category";

export interface CategorizedTag {
	tag: string;
	category: TagCategory;
}

export interface SortedTags {
	categorizedTags: CategorizedTag[];
	uncategorizedTags: string[];
}

export function getCategoryColorClasses(color: string): {
	bgClass: string;
	textClass: string;
} {
	const colorConfig = CATEGORY_COLORS.find((c) => c.value === color);
	return {
		bgClass: colorConfig?.bgClass || "bg-gray-100 dark:bg-gray-800",
		textClass: colorConfig?.textClass || "text-gray-800 dark:text-gray-200",
	};
}

export function sortTagsByCategory(
	tags: string[],
	getCategoryForTag: (tag: string) => TagCategory | undefined | null,
): SortedTags {
	const categorizedTags: CategorizedTag[] = [];
	const uncategorizedTags: string[] = [];

	tags.forEach((tag) => {
		const category = getCategoryForTag(tag);
		if (category) {
			categorizedTags.push({ tag, category });
		} else {
			uncategorizedTags.push(tag);
		}
	});

	return { categorizedTags, uncategorizedTags };
}
