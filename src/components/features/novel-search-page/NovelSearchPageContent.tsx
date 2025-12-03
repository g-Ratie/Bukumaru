"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/features/novel-search-page/empty-state/EmptyState";
import { PageHeader } from "@/components/features/novel-search-page/page-header/PageHeader";
import { SearchPanels } from "@/components/features/novel-search-page/search-form/SearchPanels";
import { SetupDialog } from "@/components/features/novel-search-page/setup-dialog/SetupDialog";
import { LoadingState } from "@/components/shared/loading-state/LoadingState";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useURLSearchParams } from "@/hooks/useURLSearchParams";
import { createDemoNovelData } from "@/lib/demoNovelData";
import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";
import { filterNovelsWithPagination } from "@/utils/filter/novelSearchFilters";
import {
	getStoredNovelData,
	saveNovelData,
} from "@/utils/novelData/novelDataStorage";

export function NovelSearchPageContent() {
	const [novels, setNovels] = useState<Novel[]>([]);
	const [searchResult, setSearchResult] = useState<SearchResult>({
		novels: [],
		totalCount: 0,
		currentPage: 1,
		totalPages: 1,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
	const [isApplyingDemoData, setIsApplyingDemoData] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { getFiltersFromURL, updateURLParams, isInitialized } =
		useURLSearchParams();
	const [filters, setFilters] = useState<SearchFilters>(() =>
		getFiltersFromURL(),
	);

	const loadNovels = useCallback(async () => {
		setIsLoading(true);
		const storedData = await getStoredNovelData();
		if (storedData) {
			setNovels(storedData.novels);
			setIsSetupDialogOpen(false);
		} else {
			setNovels([]);
			setIsSetupDialogOpen(true);
		}
		setIsLoading(false);
	}, []);

	const filterNovelsCallback = useCallback(() => {
		const result = filterNovelsWithPagination(novels, filters);
		setSearchResult(result);
	}, [novels, filters]);

	useEffect(() => {
		void loadNovels();
	}, [loadNovels]);

	useEffect(() => {
		if (isInitialized) {
			const urlFilters = getFiltersFromURL();
			setFilters(urlFilters);
		}
	}, [isInitialized, getFiltersFromURL]);

	useEffect(() => {
		filterNovelsCallback();
	}, [filterNovelsCallback]);

	useEffect(() => {
		if (isInitialized) {
			updateURLParams(filters);
		}
	}, [filters, isInitialized, updateURLParams]);

	const handleFilterChange = (newFilters: SearchFilters) => {
		setFilters({
			...newFilters,
			currentPage: 1,
		});
	};

	const handleAuthorSearch = (authorName: string) => {
		setFilters((prev) => ({
			...prev,
			authorName,
			currentPage: 1,
		}));
	};

	const handleTagSearch = (tag: string) => {
		setFilters((prev) => {
			const newTags = prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag];
			return {
				...prev,
				tags: newTags,
				currentPage: 1,
			};
		});
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({
			...prev,
			currentPage: page,
		}));
	};

	const handleUseDemoData = async () => {
		setIsApplyingDemoData(true);
		try {
			const demoData = createDemoNovelData();
			await saveNovelData(demoData);
			setNovels(demoData.novels);
			setIsSetupDialogOpen(false);
		} finally {
			setIsApplyingDemoData(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-background">
			<div className="container mx-auto px-4 py-8">
				<SetupDialog
					open={isSetupDialogOpen}
					onOpenChange={setIsSetupDialogOpen}
					onUseDemoData={handleUseDemoData}
					isApplyingDemoData={isApplyingDemoData}
				/>

				<PageHeader />

				{isLoading ? (
					<LoadingState />
				) : novels.length === 0 ? (
					<EmptyState onTryDemoData={() => setIsSetupDialogOpen(true)} />
				) : (
					<SearchPanels
						isMobile={isMobile}
						filters={filters}
						novels={novels}
						searchResult={searchResult}
						onFilterChange={handleFilterChange}
						onAuthorSearch={handleAuthorSearch}
						onTagSearch={handleTagSearch}
						onPageChange={handlePageChange}
					/>
				)}
			</div>
		</div>
	);
}
