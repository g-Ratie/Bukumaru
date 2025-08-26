"use client";

import { Database, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getStoredNovelData } from "@/lib/novelDataStorage";
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
	const [isLoading, setIsLoading] = useState(true);
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

	const loadNovels = useCallback(() => {
		setIsLoading(true);
		// LocalStorageから読み込みを試みる
		const storedData = getStoredNovelData();
		if (storedData) {
			setNovels(storedData.novels);
		} else {
			// データがない場合は空配列をセット
			setNovels([]);
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

				{isLoading ? (
					<div className="flex min-h-[400px] items-center justify-center">
						<div className="text-center">
							<Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
							<p className="text-muted-foreground">データを読み込み中...</p>
						</div>
					</div>
				) : novels.length === 0 ? (
					<div className="flex min-h-[400px] items-center justify-center">
						<div className="text-center">
							<Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h2 className="mb-2 font-semibold text-lg">
								小説データがありません
							</h2>
							<p className="mb-4 text-muted-foreground text-sm">
								設定ページから小説データをアップロードまたは
								<br />
								URLを指定してデータを読み込んでください
							</p>
							<Link href="/settings">
								<Button>
									<Settings className="mr-2 h-4 w-4" />
									設定ページへ移動
								</Button>
							</Link>
						</div>
					</div>
				) : isMobile ? (
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
							onTagSearch={handleTagSearch}
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
								onTagSearch={handleTagSearch}
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
						onTagSearch={handleTagSearch}
					/>
				)}
			</div>
		</div>
	);
}
