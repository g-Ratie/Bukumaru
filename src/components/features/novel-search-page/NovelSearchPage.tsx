"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { loadNovelData } from "@/lib/novelDataParser";
import { filterNovelsWithPagination } from "@/lib/novelSearchFilters";
import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";
import { NovelDetail } from "./novel-detail/NovelDetail";
import { CollapsibleSearchForm } from "./search-form/CollapsibleSearchForm";
import { SearchForm } from "./search-form/SearchForm";
import { SearchResults } from "./search-results/SearchResults";

export function NovelSearchPage() {
	const [novels, setNovels] = useState<Novel[]>([]);
	const [searchResult, setSearchResult] = useState<SearchResult>({
		novels: [],
		totalCount: 0,
		currentPage: 1,
		totalPages: 1,
	});
	const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [filters, setFilters] = useState<SearchFilters>({
		authorName: "",
		tags: [],
		selectedTag: "",
		minTextCount: 0,
		maxTextCount: 50000,
		sortBy: "createDate",
		sortOrder: "desc",
		currentPage: 1,
		itemsPerPage: 24,
	});

	const loadNovels = useCallback(async () => {
		const result = await loadNovelData("/demo.json");

		if (result.success && result.data) {
			setNovels(result.data);
		} else {
			console.error("小説データの読み込みに失敗しました:", result.error);
		}
	}, []);

	const filterNovelsCallback = useCallback(() => {
		const result = filterNovelsWithPagination(novels, filters);
		setSearchResult(result);
	}, [novels, filters]);

	useEffect(() => {
		loadNovels();
	}, [loadNovels]);

	useEffect(() => {
		filterNovelsCallback();
	}, [filterNovelsCallback]);

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

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({
			...prev,
			currentPage: page,
		}));
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-background">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-foreground">
								小説検索サイト
							</h1>
							<p className="text-gray-600 dark:text-muted-foreground">
								pixiv小説データから作品を検索できます
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Link href="/settings">
								<Button variant="outline" size="sm">
									<Settings className="mr-2 h-4 w-4" />
									設定
								</Button>
							</Link>
							<ThemeToggle />
						</div>
					</div>
				</header>

				{isMobile ? (
					<div className="space-y-4">
						<CollapsibleSearchForm
							filters={filters}
							onFilterChange={handleFilterChange}
							novels={novels}
						/>
						<SearchResults
							searchResult={searchResult}
							onNovelSelect={handleNovelSelect}
							onAuthorSearch={handleAuthorSearch}
							onPageChange={handlePageChange}
						/>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
						<div className="lg:col-span-1">
							<SearchForm
								filters={filters}
								onFilterChange={handleFilterChange}
								novels={novels}
							/>
						</div>

						<div className="lg:col-span-3">
							<SearchResults
								searchResult={searchResult}
								onNovelSelect={handleNovelSelect}
								onAuthorSearch={handleAuthorSearch}
								onPageChange={handlePageChange}
							/>
						</div>
					</div>
				)}

				{selectedNovel && (
					<NovelDetail
						novel={selectedNovel}
						onClose={handleNovelClose}
						onAuthorSearch={handleAuthorSearch}
					/>
				)}
			</div>
		</div>
	);
}
