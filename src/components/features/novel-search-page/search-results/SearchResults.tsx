"use client";

import { useEffect, useRef } from "react";

import { Pagination } from "@/components/shared/pagination/Pagination";
import type { Novel } from "@/types/novel";
import type { SearchResult } from "@/types/search";
import { NovelCard } from "../novel-card/NovelCard";

interface SearchResultsProps {
	searchResult: SearchResult;
	onNovelSelect: (novel: Novel) => void;
	onAuthorSearch: (authorName: string) => void;
	onTagSearch: (tag: string) => void;
	onPageChange: (page: number) => void;
}

export function SearchResults({
	searchResult,
	onNovelSelect,
	onAuthorSearch,
	onTagSearch,
	onPageChange,
}: SearchResultsProps) {
	const { novels, totalCount, currentPage, totalPages } = searchResult;
	const hasMountedRef = useRef(false);

	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}

		if (!Number.isFinite(currentPage)) return;

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [currentPage]);

	if (novels.length === 0) {
		return (
			<div className="py-12 text-center">
				<div className="text-gray-500 text-lg dark:text-gray-400">
					検索結果がありません
				</div>
				<p className="mt-2 text-gray-400 dark:text-gray-500">
					検索条件を変更してお試しください
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-xl">
					検索結果 ({totalCount.toLocaleString()}件)
				</h2>
				<div className="text-gray-600 text-sm dark:text-gray-400">
					{currentPage}/{totalPages}ページ
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{novels.map((novel) => (
					<div key={novel.id}>
						<NovelCard
							novel={novel}
							onNovelSelect={onNovelSelect}
							onAuthorSearch={onAuthorSearch}
							onTagSearch={onTagSearch}
						/>
					</div>
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				className="mt-8"
			/>
		</div>
	);
}
