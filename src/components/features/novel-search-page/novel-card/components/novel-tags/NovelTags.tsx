"use client";

import {
	getCategoryColorClasses,
	sortTagsByCategory,
} from "@/components/features/novel-search-page/utils/categoryHelpers";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";

interface NovelTagsProps {
	tags: string[];
	onTagClick?: (tag: string) => void;
	className?: string;
}

export function NovelTags({
	tags,
	onTagClick,
	className = "",
}: NovelTagsProps) {
	const { getCategoryForTag } = useCategories();
	const { categorizedTags, uncategorizedTags } = sortTagsByCategory(
		tags,
		getCategoryForTag,
	);

	const handleTagClick = (tag: string, e: React.MouseEvent) => {
		e.stopPropagation();
		onTagClick?.(tag);
	};

	return (
		<div className={`flex flex-wrap gap-1 ${className}`}>
			{categorizedTags.map(({ tag, category }) => {
				const colorClasses = getCategoryColorClasses(category.color);
				return (
					<Badge
						key={tag}
						className={`${colorClasses.bgClass} ${colorClasses.textClass} cursor-pointer border-0 text-xs transition-opacity hover:opacity-80`}
						onClick={(e) => handleTagClick(tag, e)}
					>
						{tag}
					</Badge>
				);
			})}
			{uncategorizedTags.map((tag) => (
				<Badge
					key={tag}
					variant="secondary"
					className="cursor-pointer text-xs transition-opacity hover:opacity-80"
					onClick={(e) => handleTagClick(tag, e)}
				>
					{tag}
				</Badge>
			))}
		</div>
	);
}
