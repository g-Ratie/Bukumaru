import type { SearchFilters } from "./search";

export interface SavedFilterData {
	authorName: string;
	tags: string[];
	selectedTag: string;
	minTextCount: number | null;
	maxTextCount: number | null;
	sortBy: SearchFilters["sortBy"];
	sortOrder: SearchFilters["sortOrder"];
}

export interface SavedFilter {
	id: string;
	name: string;
	filterData: SavedFilterData;
	createdAt: number;
}
