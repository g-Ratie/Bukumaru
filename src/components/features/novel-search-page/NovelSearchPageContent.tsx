"use client";

import { Database, Loader2, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useURLSearchParams } from "@/hooks/useURLSearchParams";
import { createDemoNovelData } from "@/lib/demoNovelData";
import { getStoredNovelData, saveNovelData } from "@/lib/novelDataStorage";
import { filterNovelsWithPagination } from "@/lib/novelSearchFilters";
import type { Novel } from "@/types/novel";
import type { SearchFilters, SearchResult } from "@/types/search";
import { NovelDetail } from "./novel-detail/NovelDetail";
import { CollapsibleSearchForm } from "./search-form/CollapsibleSearchForm";
import { SearchForm } from "./search-form/SearchForm";
import { SearchResults } from "./search-results/SearchResults";

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
		// LocalStorageから読み込みを試みる
		const storedData = getStoredNovelData();
		if (storedData) {
			setNovels(storedData.novels);
			setIsSetupDialogOpen(false);
		} else {
			// データがない場合は空配列をセット
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
				<Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
					<DialogContent className="sm:max-w-lg">
						<DialogHeader>
							<DialogTitle>小説データの準備</DialogTitle>
							<DialogDescription>
								初回利用のためのデータが見つかりませんでした。設定ページでデータを
								読み込むか、手軽に試せるデモデータを利用できます。
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-2">
							<div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4">
								<Database className="mt-1 h-5 w-5 text-muted-foreground" />
								<div className="space-y-1 text-sm">
									<p className="font-medium">設定ページでデータを読み込む</p>
									<p className="text-muted-foreground">
										pixivからエクスポートしたJSONファイルやURLを登録して、実際の
										データで検索を開始できます。
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4">
								<Sparkles className="mt-1 h-5 w-5 text-primary" />
								<div className="space-y-1 text-sm">
									<p className="font-medium">すぐに試せるデモデータを使用</p>
									<p className="text-muted-foreground">
										アプリの使い方を確認できるサンプルデータです。後から設定ページで
										本番データに切り替えられます。
									</p>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button asChild variant="outline">
								<Link href="/settings">
									<Settings className="mr-2 h-4 w-4" />
									設定ページへ
								</Link>
							</Button>
							<Button onClick={handleUseDemoData} disabled={isApplyingDemoData}>
								{isApplyingDemoData && (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								デモデータを読み込む
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<header className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-foreground">
								pixiv小説ブックマークビューア
							</h1>
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
							<div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
								<Link href="/settings">
									<Button>
										<Settings className="mr-2 h-4 w-4" />
										設定ページへ移動
									</Button>
								</Link>
								<Button
									variant="outline"
									onClick={() => setIsSetupDialogOpen(true)}
								>
									<Sparkles className="mr-2 h-4 w-4" />
									デモデータを試す
								</Button>
							</div>
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
