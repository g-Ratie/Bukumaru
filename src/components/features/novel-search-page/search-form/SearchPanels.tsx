"use client";

import { CollapsibleSearchForm } from "@/components/features/novel-search-page/search-form/CollapsibleSearchForm";
import { SearchForm } from "@/components/features/novel-search-page/search-form/SearchForm";
import { SearchResults } from "@/components/features/novel-search-page/search-form/SearchResults";
import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";

type SearchPanelsProps = {
	isMobile: boolean;
	filters: SearchFilters;
	novels: Novel[];
	searchResult: SearchResult;
	onFilterChange: (filters: SearchFilters) => void;
	onAuthorSearch: (authorName: string) => void;
	onTagSearch: (tag: string) => void;
	onPageChange: (page: number) => void;
};

export function SearchPanels({
	isMobile,
	filters,
	novels,
	searchResult,
	onFilterChange,
	onAuthorSearch,
	onTagSearch,
	onPageChange,
}: SearchPanelsProps) {
	if (isMobile) {
		return (
			<div className="space-y-4">
				<CollapsibleSearchForm
					filters={filters}
					onFilterChange={onFilterChange}
					novels={novels}
				/>
				<SearchResults
					searchResult={searchResult}
					onAuthorSearch={onAuthorSearch}
					onTagSearch={onTagSearch}
					highlightTags={filters.tags}
					onPageChange={onPageChange}
				/>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
			<div className="lg:col-span-1">
				<SearchForm
					filters={filters}
					onFilterChange={onFilterChange}
					novels={novels}
				/>
			</div>
			<div className="lg:col-span-3">
				<SearchResults
					searchResult={searchResult}
					onAuthorSearch={onAuthorSearch}
					onTagSearch={onTagSearch}
					highlightTags={filters.tags}
					onPageChange={onPageChange}
				/>
			</div>
		</div>
	);
}
