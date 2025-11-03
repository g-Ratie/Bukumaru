"use client";

import { BookmarkIcon, ClockIcon, EyeIcon } from "lucide-react";
import { formatReadingTime } from "@/lib/novelFormatters";

interface NovelStatsProps {
	textCount: number;
	readingTime: number;
	bookmarkCount: number;
	className?: string;
}

export function NovelStats({
	textCount,
	readingTime,
	bookmarkCount,
	className = "",
}: NovelStatsProps) {
	return (
		<div
			className={`flex items-center justify-between text-gray-500 text-sm dark:text-gray-400 ${className}`}
		>
			<div className="flex items-center gap-2">
				<span className="flex items-center gap-1">
					<EyeIcon size={14} />
					<span className="text-xs">{textCount.toLocaleString()}字</span>
				</span>
				<span className="flex items-center gap-1">
					<ClockIcon size={14} />
					<span className="text-xs">{formatReadingTime(readingTime)}</span>
				</span>
				<span className="flex items-center gap-1">
					<BookmarkIcon size={14} />
					<span className="text-xs">{bookmarkCount.toLocaleString()}</span>
				</span>
			</div>
		</div>
	);
}
