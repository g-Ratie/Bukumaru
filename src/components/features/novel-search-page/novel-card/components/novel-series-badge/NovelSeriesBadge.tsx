"use client";

import { getPixivSeriesURL } from "@/components/features/novel-search-page/utils/pixivURLs";
import { Badge } from "@/components/ui/badge";

interface NovelSeriesBadgeProps {
	seriesTitle: string;
	seriesId?: string | null;
}

export function NovelSeriesBadge({
	seriesTitle,
	seriesId,
}: NovelSeriesBadgeProps) {
	if (seriesId) {
		return (
			<Badge
				asChild
				variant="outline"
				className="border-blue-200 bg-blue-50 text-blue-700 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
			>
				<a
					href={getPixivSeriesURL(seriesId)}
					target="_blank"
					rel="noopener noreferrer"
					className="block"
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					シリーズ: {seriesTitle}
				</a>
			</Badge>
		);
	}

	return (
		<Badge
			variant="outline"
			className="border-blue-200 bg-blue-50 text-blue-700 text-xs dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
		>
			シリーズ: {seriesTitle}
		</Badge>
	);
}
