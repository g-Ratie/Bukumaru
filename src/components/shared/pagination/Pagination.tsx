"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
}: PaginationProps) {
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className={`flex items-center justify-center gap-3 ${className}`}>
			<Button
				variant="outline"
				size="sm"
				onClick={handlePreviousPage}
				disabled={currentPage === 1}
				className="flex items-center gap-1"
			>
				<ChevronLeftIcon size={16} />
				前へ
			</Button>

			<span className="font-medium text-sm">
				{currentPage} / {totalPages}
			</span>

			<Button
				variant="outline"
				size="sm"
				onClick={handleNextPage}
				disabled={currentPage === totalPages}
				className="flex items-center gap-1"
			>
				次へ
				<ChevronRightIcon size={16} />
			</Button>
		</div>
	);
}
