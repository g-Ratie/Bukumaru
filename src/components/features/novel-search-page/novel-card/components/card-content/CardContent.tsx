"use client";

import { useMemo } from "react";
import { NovelStats } from "@/components/features/novel-search-page/novel-card/components/novel-stats/NovelStats";
import { NovelTags } from "@/components/features/novel-search-page/novel-card/components/novel-tags/NovelTags";
import { sanitizeNovelDescription } from "@/components/features/novel-search-page/utils";
import { CardContent as UICardContent } from "@/components/ui/card";

interface CardContentProps {
	description: string;
	tags: string[];
	customTagNames?: string[];
	textCount: number;
	readingTime: number;
	bookmarkCount: number;
	onTagSearch: (tag: string) => void;
	highlightTags: string[];
}

export function CardContent({
	description,
	tags,
	customTagNames,
	textCount,
	readingTime,
	bookmarkCount,
	onTagSearch,
	highlightTags,
}: CardContentProps) {
	const sanitizedDescription = useMemo(
		() => sanitizeNovelDescription(description),
		[description],
	);

	return (
		<UICardContent className="flex flex-1 flex-col space-y-4">
			<div
				className="line-clamp-3 min-h-[3rem] text-gray-700 text-sm dark:text-gray-300"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: 一旦許可
				dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
			/>
			<NovelTags
				tags={tags}
				customTagNames={customTagNames}
				onTagClick={onTagSearch}
				highlightTags={highlightTags}
			/>
			<NovelStats
				textCount={textCount}
				readingTime={readingTime}
				bookmarkCount={bookmarkCount}
			/>
		</UICardContent>
	);
}
