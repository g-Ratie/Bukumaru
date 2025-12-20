"use client";

import { useMemo } from "react";
import {
	getCategoryColorClasses,
	sortTagsByCategory,
} from "@/components/features/novel-search-page/utils/categoryHelpers";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";

interface NovelTagsProps {
	tags: string[];
	onTagClick?: (tag: string) => void;
	highlightTags?: string[];
	className?: string;
}

export function NovelTags({
	tags,
	onTagClick,
	highlightTags,
	className = "",
}: NovelTagsProps) {
	const { getCategoryForTag } = useCategories();
	const { categorizedTags, uncategorizedTags } = sortTagsByCategory(
		tags,
		getCategoryForTag,
	);
	const highlightTagSet = useMemo(
		() => new Set((highlightTags ?? []).map((tag) => tag.toLowerCase())),
		[highlightTags],
	);

	const handleTagClick = (tag: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onTagClick?.(tag);
	};
	const getHighlightClasses = (tag: string) =>
		highlightTagSet.has(tag.toLowerCase())
			? "ring-2 ring-blue-400/70 ring-offset-1 ring-offset-background dark:ring-blue-300/70"
			: "";

	return (
		<div className={`flex flex-wrap gap-1 ${className}`}>
			{categorizedTags.map(({ tag, category }) => {
				const colorClasses = getCategoryColorClasses(category.color);
				const highlightClasses = getHighlightClasses(tag);
				return (
					<Badge
						key={tag}
						className={`${colorClasses.bgClass} ${colorClasses.textClass} ${highlightClasses} cursor-pointer border-0 text-xs transition-opacity hover:opacity-80`}
						onClick={(e) => handleTagClick(tag, e)}
					>
						{tag}
					</Badge>
				);
			})}
			{uncategorizedTags.map((tag) => {
				const highlightClasses = getHighlightClasses(tag);
				return (
					<Badge
						key={tag}
						variant="secondary"
						className={`${highlightClasses} cursor-pointer text-xs transition-opacity hover:opacity-80`}
						onClick={(e) => handleTagClick(tag, e)}
					>
						{tag}
					</Badge>
				);
			})}
		</div>
	);
}
