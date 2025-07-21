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
	const generatePageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// 全ページを表示
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// 現在のページの前後2ページを表示
			const startPage = Math.max(1, currentPage - 2);
			const endPage = Math.min(totalPages, currentPage + 2);

			// 最初のページ
			if (startPage > 1) {
				pages.push(1);
				if (startPage > 2) {
					pages.push("...");
				}
			}

			// 中間のページ
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// 最後のページ
			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					pages.push("...");
				}
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = generatePageNumbers();

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
		<div className={`flex items-center justify-center gap-2 ${className}`}>
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

			<div className="flex items-center gap-1">
				{pageNumbers.map((page, index) => (
					<div key={page === "..." ? `ellipsis-${index}` : `page-${page}`}>
						{page === "..." ? (
							<span className="px-2 py-1 text-gray-500 dark:text-gray-400">
								...
							</span>
						) : (
							<Button
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								onClick={() => onPageChange(page as number)}
								className="min-w-[2.5rem]"
							>
								{page}
							</Button>
						)}
					</div>
				))}
			</div>

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
