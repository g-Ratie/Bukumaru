"use client";

import { BookmarkIcon, ClockIcon, EyeIcon } from "lucide-react";
import { Pagination } from "@/components/shared/pagination/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Novel } from "@/types/novel";
import type { SearchResult } from "@/types/search";

interface SearchResultsProps {
	searchResult: SearchResult;
	onNovelSelect: (novel: Novel) => void;
	onAuthorSearch: (authorName: string) => void;
	onPageChange: (page: number) => void;
}

export function SearchResults({
	searchResult,
	onNovelSelect,
	onAuthorSearch,
	onPageChange,
}: SearchResultsProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("ja-JP");
	};

	const formatReadingTime = (seconds: number) => {
		const minutes = Math.ceil(seconds / 60);
		return `${minutes}分`;
	};

	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return `${text.substring(0, maxLength)}...`;
	};

	const { novels, totalCount, currentPage, totalPages } = searchResult;

	if (novels.length === 0) {
		return (
			<div className="py-12 text-center">
				<div className="text-gray-500 text-lg">検索結果がありません</div>
				<p className="mt-2 text-gray-400">検索条件を変更してお試しください</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-xl">
					検索結果 ({totalCount.toLocaleString()}件)
				</h2>
				<div className="text-gray-600 text-sm">
					{currentPage}/{totalPages}ページ
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{novels.map((novel) => (
					<Card
						key={novel.id}
						className="cursor-pointer transition-shadow hover:shadow-lg"
					>
						<CardHeader className="pb-3">
							<CardTitle className="line-clamp-2 text-lg hover:text-blue-600">
								{novel.title}
							</CardTitle>
							<div className="flex items-center gap-4 text-gray-600 text-sm">
								<span>
									by
									<Button
										variant="link"
										size="sm"
										className="ml-1 h-auto p-0 text-blue-600 hover:text-blue-800"
										onClick={(e) => {
											e.stopPropagation();
											onAuthorSearch(novel.userName);
										}}
									>
										{novel.userName}
									</Button>
								</span>
								<span>{formatDate(novel.createDate)}</span>
							</div>
						</CardHeader>

						<CardContent className="space-y-3">
							<div className="line-clamp-3 text-gray-700 text-sm">
								{truncateText(novel.description, 100)}
							</div>

							<div className="flex flex-wrap gap-1">
								{novel.tags.slice(0, 3).map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
								{novel.tags.length > 3 && (
									<Badge variant="outline" className="text-xs">
										+{novel.tags.length - 3}
									</Badge>
								)}
							</div>

							<div className="flex items-center justify-between text-gray-500 text-sm">
								<div className="flex items-center gap-3">
									<span className="flex items-center gap-1">
										<EyeIcon size={14} />
										{novel.textCount.toLocaleString()}字
									</span>
									<span className="flex items-center gap-1">
										<ClockIcon size={14} />
										{formatReadingTime(novel.readingTime)}
									</span>
									<span className="flex items-center gap-1">
										<BookmarkIcon size={14} />
										{novel.bookmarkCount.toLocaleString()}
									</span>
								</div>
							</div>

							<Button
								className="mt-3 w-full"
								onClick={() => onNovelSelect(novel)}
							>
								詳細を見る
							</Button>
						</CardContent>
					</Card>
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
