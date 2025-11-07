"use client";

import { NovelSeriesBadge } from "@/components/features/novel-search-page/novel-card/components/novel-series-badge/NovelSeriesBadge";
import {
	formatDate,
	getPixivNovelURL,
} from "@/components/features/novel-search-page/utils";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader as UICardHeader } from "@/components/ui/card";

interface CardHeaderProps {
	title: string;
	novelId: string;
	userName: string;
	createDate: string;
	seriesTitle?: string | null;
	seriesId?: string | null;
	onAuthorSearch: (authorName: string) => void;
}

export function CardHeader({
	title,
	novelId,
	userName,
	createDate,
	seriesTitle,
	seriesId,
	onAuthorSearch,
}: CardHeaderProps) {
	const handleAuthorClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onAuthorSearch(userName);
	};

	return (
		<UICardHeader className="shrink-0 pb-3">
			{seriesTitle && (
				<div className="mb-2">
					<NovelSeriesBadge seriesTitle={seriesTitle} seriesId={seriesId} />
				</div>
			)}
			<CardTitle className="mb-2 line-clamp-2 min-h-[1.5rem] break-words text-lg">
				<a
					href={getPixivNovelURL(novelId)}
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer break-words text-gray-900 hover:text-blue-800 hover:underline dark:text-gray-100 dark:hover:text-blue-400"
					style={{ wordBreak: "break-word" }}
					onClick={(e) => e.stopPropagation()}
				>
					{title}
				</a>
			</CardTitle>
			<div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
				<span className="min-w-0 flex-1 truncate">
					by
					<Button
						variant="link"
						size="sm"
						className="ml-1 h-auto p-0 text-gray-800 hover:text-blue-800 dark:text-gray-200 dark:hover:text-blue-400"
						onClick={handleAuthorClick}
					>
						<span className="truncate">{userName}</span>
					</Button>
				</span>
				<span className="shrink-0 text-xs">{formatDate(createDate)}</span>
			</div>
		</UICardHeader>
	);
}
