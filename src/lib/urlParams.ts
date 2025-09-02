import type { SearchFilters } from "@/types/search";

export function serializeFiltersToURLParams(filters: SearchFilters): string {
	const params = new URLSearchParams();

	if (filters.authorName) {
		params.set("author", filters.authorName);
	}
	if (filters.tags.length > 0) {
		params.set("tags", filters.tags.join(","));
	}
	if (filters.selectedTag) {
		params.set("selectedTag", filters.selectedTag);
	}
	if (filters.minTextCount > 0) {
		params.set("minText", filters.minTextCount.toString());
	}
	if (filters.maxTextCount !== 50000) {
		params.set("maxText", filters.maxTextCount.toString());
	}
	if (filters.sortBy !== "createDate") {
		params.set("sortBy", filters.sortBy);
	}
	if (filters.sortOrder !== "desc") {
		params.set("sortOrder", filters.sortOrder);
	}
	if (filters.currentPage > 1) {
		params.set("page", filters.currentPage.toString());
	}
	if (filters.itemsPerPage !== 24) {
		params.set("perPage", filters.itemsPerPage.toString());
	}

	return params.toString();
}

export function parseURLParamsToFilters(
	searchParams: URLSearchParams,
): Partial<SearchFilters> {
	const filters: Partial<SearchFilters> = {};

	const author = searchParams.get("author");
	if (author) {
		filters.authorName = author;
	}

	const tags = searchParams.get("tags");
	if (tags) {
		filters.tags = tags.split(",").filter(Boolean);
	}

	const selectedTag = searchParams.get("selectedTag");
	if (selectedTag) {
		filters.selectedTag = selectedTag;
	}

	const minText = searchParams.get("minText");
	if (minText) {
		const value = Number.parseInt(minText, 10);
		if (!Number.isNaN(value)) {
			filters.minTextCount = value;
		}
	}

	const maxText = searchParams.get("maxText");
	if (maxText) {
		const value = Number.parseInt(maxText, 10);
		if (!Number.isNaN(value)) {
			filters.maxTextCount = value;
		}
	}

	const sortBy = searchParams.get("sortBy");
	if (
		sortBy &&
		["title", "userName", "textCount", "bookmarkCount", "createDate"].includes(
			sortBy,
		)
	) {
		filters.sortBy = sortBy as SearchFilters["sortBy"];
	}

	const sortOrder = searchParams.get("sortOrder");
	if (sortOrder && ["asc", "desc"].includes(sortOrder)) {
		filters.sortOrder = sortOrder as "asc" | "desc";
	}

	const page = searchParams.get("page");
	if (page) {
		const value = Number.parseInt(page, 10);
		if (!Number.isNaN(value) && value > 0) {
			filters.currentPage = value;
		}
	}

	const perPage = searchParams.get("perPage");
	if (perPage) {
		const value = Number.parseInt(perPage, 10);
		if (!Number.isNaN(value) && value > 0) {
			filters.itemsPerPage = value;
		}
	}

	return filters;
}

export function getDefaultFilters(): SearchFilters {
	return {
		authorName: "",
		tags: [],
		selectedTag: "",
		minTextCount: 0,
		maxTextCount: 50000,
		sortBy: "createDate",
		sortOrder: "desc",
		currentPage: 1,
		itemsPerPage: 24,
	};
}
