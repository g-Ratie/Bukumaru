"use client";

import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Novel } from "@/types/novel";
import type { SearchFilters } from "@/types/search";
import { SearchForm } from "./SearchForm";

interface CollapsibleSearchFormProps {
	filters: SearchFilters;
	onFilterChange: (filters: SearchFilters) => void;
	novels: Novel[];
}

export function CollapsibleSearchForm({
	filters,
	onFilterChange,
	novels,
}: CollapsibleSearchFormProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const hasActiveFilters =
		filters.authorName !== "" ||
		filters.tags.length > 0 ||
		filters.selectedTag !== "" ||
		filters.minTextCount !== 0 ||
		filters.maxTextCount !== 50000 ||
		filters.sortBy !== "createDate" ||
		filters.sortOrder !== "desc";

	return (
		<div className="w-full">
			{/* 格納時のヘッダー */}
			<Button
				variant="outline"
				className="h-auto w-full justify-between p-4"
				onClick={toggleExpanded}
			>
				<div className="flex items-center gap-2">
					<Filter size={16} />
					<span className="font-medium">検索フィルター</span>
					{hasActiveFilters && (
						<span className="rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs">
							適用中
						</span>
					)}
				</div>
				{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</Button>

			{/* 展開時のコンテンツ */}
			{isExpanded && (
				<div className="mt-2 rounded-lg border bg-white">
					<SearchForm
						filters={filters}
						onFilterChange={onFilterChange}
						novels={novels}
					/>
				</div>
			)}
		</div>
	);
}
