"use client";

import { useCallback, useEffect, useState } from "react";

import { EmptyState } from "@/components/features/novel-search-page/empty-state/EmptyState";
import { LoadingState } from "@/components/features/novel-search-page/loading-state/LoadingState";
import { NovelDetail } from "@/components/features/novel-search-page/novel-detail/NovelDetail";
import { PageHeader } from "@/components/features/novel-search-page/page-header/PageHeader";
import { SearchPanels } from "@/components/features/novel-search-page/search-panels/SearchPanels";
import { SetupDialog } from "@/components/features/novel-search-page/setup-dialog/SetupDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useURLSearchParams } from "@/hooks/useURLSearchParams";
import { createDemoNovelData } from "@/lib/demoNovelData";
import { getStoredNovelData, saveNovelData } from "@/lib/novelDataStorage";
import { filterNovelsWithPagination } from "@/lib/novelSearchFilters";
import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";

export function NovelSearchPageContent() {
	const [novels, setNovels] = useState<Novel[]>([]);
	const [searchResult, setSearchResult] = useState<SearchResult>({
		novels: [],
		totalCount: 0,
		currentPage: 1,
		totalPages: 1,
	});
	const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
	const [isApplyingDemoData, setIsApplyingDemoData] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { getFiltersFromURL, updateURLParams, isInitialized } =
		useURLSearchParams();
	const [filters, setFilters] = useState<SearchFilters>(() =>
		getFiltersFromURL(),
	);

	const loadNovels = useCallback(() => {
		setIsLoading(true);
		const storedData = getStoredNovelData();
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
		loadNovels();
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

	const handleNovelSelect = (novel: Novel) => {
		setSelectedNovel(novel);
	};

	const handleNovelClose = () => {
		setSelectedNovel(null);
	};

	const handleAuthorSearch = (authorName: string) => {
		setFilters((prev) => ({
			...prev,
			authorName,
			currentPage: 1,
		}));
		setSelectedNovel(null);
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
		setSelectedNovel(null);
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({
			...prev,
			currentPage: page,
		}));
	};

	const handleUseDemoData = () => {
		setIsApplyingDemoData(true);
		try {
			const demoData = createDemoNovelData();
			saveNovelData(demoData);
			setNovels(demoData.novels);
			setSelectedNovel(null);
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
						onNovelSelect={handleNovelSelect}
						onAuthorSearch={handleAuthorSearch}
						onTagSearch={handleTagSearch}
						onPageChange={handlePageChange}
					/>
				)}

				{selectedNovel && (
					<NovelDetail
						novel={selectedNovel}
						onClose={handleNovelClose}
						onAuthorSearch={handleAuthorSearch}
						onTagSearch={handleTagSearch}
					/>
				)}
			</div>
		</div>
	);
}
