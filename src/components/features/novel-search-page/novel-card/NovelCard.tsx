"use client";

import { BookmarkIcon, ClockIcon, EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/useCategories";
import { CATEGORY_COLORS } from "@/types/category";
import type { Novel } from "@/types/novel";

interface NovelCardProps {
	novel: Novel;
	onNovelSelect: (novel: Novel) => void;
	onAuthorSearch: (authorName: string) => void;
	onTagSearch: (tag: string) => void;
}

export function NovelCard({
	novel,
	onNovelSelect,
	onAuthorSearch,
	onTagSearch,
}: NovelCardProps) {
	const { getCategoryForTag } = useCategories();
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

	const getPixivUrl = (id: string) => {
		return `https://www.pixiv.net/novel/show.php?id=${id}`;
	};

	const getCategoryColorClasses = (color: string) => {
		const colorConfig = CATEGORY_COLORS.find((c) => c.value === color);
		return {
			bgClass: colorConfig?.bgClass || "bg-gray-100 dark:bg-gray-800",
			textClass: colorConfig?.textClass || "text-gray-800 dark:text-gray-200",
		};
	};

	const sortTagsByCategory = (tags: string[]) => {
		const categorizedTags: {
			tag: string;
			category: { id: string; name: string; color: string; tags: string[] };
		}[] = [];
		const uncategorizedTags: string[] = [];

		tags.forEach((tag) => {
			const category = getCategoryForTag(tag);
			if (category) {
				categorizedTags.push({ tag, category });
			} else {
				uncategorizedTags.push(tag);
			}
		});

		return { categorizedTags, uncategorizedTags };
	};

	const { categorizedTags, uncategorizedTags } = sortTagsByCategory(novel.tags);

	return (
		<Card className="flex flex-col transition-shadow hover:shadow-lg dark:bg-card dark:text-card-foreground">
			<CardHeader className="shrink-0 pb-3">
				<CardTitle className="mb-2 line-clamp-2 min-h-[1.5rem] text-lg">
					<a
						href={getPixivUrl(novel.id)}
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer text-gray-900 hover:text-blue-800 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
						onClick={(e) => e.stopPropagation()}
					>
						{novel.title}
					</a>
				</CardTitle>
				<div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
					<span className="min-w-0 flex-1 truncate">
						by
						<Button
							variant="link"
							size="sm"
							className="ml-1 h-auto p-0 text-gray-800 hover:text-blue-800 dark:text-gray-200 dark:hover:text-blue-400"
							onClick={(e) => {
								e.stopPropagation();
								onAuthorSearch(novel.userName);
							}}
						>
							<span className="truncate">{novel.userName}</span>
						</Button>
					</span>
					<span className="shrink-0 text-xs">
						{formatDate(novel.createDate)}
					</span>
				</div>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col space-y-4">
				<div className="line-clamp-3 min-h-[3rem] text-gray-700 text-sm dark:text-gray-300">
					{truncateText(novel.description, 100)}
				</div>

				<div className="flex flex-wrap gap-1">
					{/* カテゴリ付きタグを先に表示 */}
					{categorizedTags.map(({ tag, category }) => {
						const colorClasses = getCategoryColorClasses(category.color);
						return (
							<Badge
								key={tag}
								className={`${colorClasses.bgClass} ${colorClasses.textClass} cursor-pointer border-0 text-xs transition-opacity hover:opacity-80`}
								onClick={(e) => {
									e.stopPropagation();
									onTagSearch(tag);
								}}
							>
								{tag}
							</Badge>
						);
					})}
					{/* 通常のタグ */}
					{uncategorizedTags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="cursor-pointer text-xs transition-opacity hover:opacity-80"
							onClick={(e) => {
								e.stopPropagation();
								onTagSearch(tag);
							}}
						>
							{tag}
						</Badge>
					))}
				</div>

				<div className="flex items-center justify-between text-gray-500 text-sm dark:text-gray-400">
					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1">
							<EyeIcon size={14} />
							<span className="text-xs">
								{novel.textCount.toLocaleString()}字
							</span>
						</span>
						<span className="flex items-center gap-1">
							<ClockIcon size={14} />
							<span className="text-xs">
								{formatReadingTime(novel.readingTime)}
							</span>
						</span>
						<span className="flex items-center gap-1">
							<BookmarkIcon size={14} />
							<span className="text-xs">
								{novel.bookmarkCount.toLocaleString()}
							</span>
						</span>
					</div>
				</div>

				<Button className="mt-auto w-full" onClick={() => onNovelSelect(novel)}>
					詳細を見る
				</Button>
			</CardContent>
		</Card>
	);
}
