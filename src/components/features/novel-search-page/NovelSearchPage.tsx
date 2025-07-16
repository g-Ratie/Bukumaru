"use client";

import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { loadNovelData } from "@/lib/novelDataParser";
import { filterNovels } from "@/lib/novelSearchFilters";
import type { Novel } from "@/types/novel";
import type { SearchFilters } from "@/types/search";
import { NovelDetail } from "./novel-detail/NovelDetail";
import { CollapsibleSearchForm } from "./search-form/CollapsibleSearchForm";
import { SearchForm } from "./search-form/SearchForm";
import { SearchResults } from "./search-results/SearchResults";

export function NovelSearchPage() {
	const [novels, setNovels] = useState<Novel[]>([]);
	const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
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
		const filtered = filterNovels(novels, filters);
		setFilteredNovels(filtered);
	}, [novels, filters]);

	useEffect(() => {
		loadNovels();
	}, [loadNovels]);

	useEffect(() => {
		filterNovelsCallback();
	}, [filterNovelsCallback]);

	const handleFilterChange = (newFilters: SearchFilters) => {
		setFilters(newFilters);
	};

	const handleNovelSelect = (novel: Novel) => {
		setSelectedNovel(novel);
	};

	const handleNovelClose = () => {
		setSelectedNovel(null);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<h1 className="mb-2 font-bold text-3xl text-gray-900">
						小説検索サイト
					</h1>
					<p className="text-gray-600">pixiv小説データから作品を検索できます</p>
				</header>

				{isMobile ? (
					<div className="space-y-4">
						<CollapsibleSearchForm
							filters={filters}
							onFilterChange={handleFilterChange}
							novels={novels}
						/>
						<SearchResults
							novels={filteredNovels}
							onNovelSelect={handleNovelSelect}
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
								novels={filteredNovels}
								onNovelSelect={handleNovelSelect}
							/>
						</div>
					</div>
				)}

				{selectedNovel && (
					<NovelDetail novel={selectedNovel} onClose={handleNovelClose} />
				)}
			</div>
		</div>
	);
}
