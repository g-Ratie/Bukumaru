import { CATEGORY_COLORS } from "@/types/category";

export function getCategoryColorClasses(color: string) {
	const colorConfig = CATEGORY_COLORS.find((c) => c.value === color);

	return {
		bgClass: colorConfig?.bgClass ?? "bg-gray-100 dark:bg-gray-800",
		textClass: colorConfig?.textClass ?? "text-gray-800 dark:text-gray-200",
	};
}
