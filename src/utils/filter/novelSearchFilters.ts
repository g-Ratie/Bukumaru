import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";

export function filterNovels(novels: Novel[], filters: SearchFilters): Novel[] {
	const filtered = novels.filter((novel) => {
		const matchesAuthor = filterByAuthor(novel, filters.authorName);
		const matchesTags = filterByTags(novel, filters.tags);
		const matchesSelectedTag = filterBySelectedTag(novel, filters.selectedTag);
		const matchesTextCount = filterByTextCount(
			novel,
			filters.minTextCount,
			filters.maxTextCount,
		);

		return (
			matchesAuthor && matchesTags && matchesSelectedTag && matchesTextCount
		);
	});

	return sortNovels(filtered, filters.sortBy, filters.sortOrder);
}

export function filterNovelsWithPagination(
	novels: Novel[],
	filters: SearchFilters,
): SearchResult {
	const filtered = filterNovels(novels, filters);
	const totalCount = filtered.length;
	const totalPages = Math.ceil(totalCount / filters.itemsPerPage);
	const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
	const endIndex = startIndex + filters.itemsPerPage;
	const paginatedNovels = filtered.slice(startIndex, endIndex);

	return {
		novels: paginatedNovels,
		totalCount,
		currentPage: filters.currentPage,
		totalPages,
	};
}

export function filterByAuthor(novel: Novel, authorName: string): boolean {
	if (!authorName) return true;
	return novel.userName.toLowerCase().includes(authorName.toLowerCase());
}

export function filterByTags(novel: Novel, tags: string[]): boolean {
	if (tags.length === 0) return true;

	return tags.every((tag) =>
		novel.tags.some((novelTag) =>
			novelTag.toLowerCase().includes(tag.toLowerCase()),
		),
	);
}

export function filterBySelectedTag(
	novel: Novel,
	selectedTag: string,
): boolean {
	if (!selectedTag) return true;

	return novel.tags.some((tag) =>
		tag.toLowerCase().includes(selectedTag.toLowerCase()),
	);
}

export function filterByTextCount(
	novel: Novel,
	minTextCount: number,
	maxTextCount: number,
): boolean {
	return novel.textCount >= minTextCount && novel.textCount <= maxTextCount;
}

export function sortNovels(
	novels: Novel[],
	sortBy: SearchFilters["sortBy"],
	sortOrder: SearchFilters["sortOrder"],
): Novel[] {
	const sorted = [...novels].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (sortOrder === "asc") {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});

	return sorted;
}

export function getTagSuggestions(
	novels: Novel[],
): Array<{ tag: string; count: number }> {
	const tagCounts = new Map<string, number>();

	novels.forEach((novel) => {
		novel.tags.forEach((tag) => {
			tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
		});
	});

	return Array.from(tagCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.map(([tag, count]) => ({ tag, count }));
}

export function getAuthorSuggestions(
	novels: Novel[],
): Array<{ userName: string; count: number }> {
	const authorCounts = new Map<string, number>();

	novels.forEach((novel) => {
		authorCounts.set(
			novel.userName,
			(authorCounts.get(novel.userName) || 0) + 1,
		);
	});

	return Array.from(authorCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.map(([userName, count]) => ({ userName, count }));
}
