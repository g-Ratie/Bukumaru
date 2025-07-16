export interface SearchFilters {
	authorName: string;
	tags: string[];
	selectedTag: string;
	minTextCount: number;
	maxTextCount: number;
	sortBy: "title" | "userName" | "textCount" | "bookmarkCount" | "createDate";
	sortOrder: "asc" | "desc";
}

export interface SearchResult {
	novels: Novel[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
}

export interface TagSuggestion {
	tag: string;
	count: number;
}

export interface AuthorSuggestion {
	userName: string;
	novelCount: number;
}

import type { Novel } from "./novel";
