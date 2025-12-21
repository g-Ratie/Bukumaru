"use client";

import type { MouseEvent, ReactNode, TouchEvent } from "react";

import { cn } from "@/lib/utils";

export type SuggestionListItem = {
	key: string;
	label: ReactNode;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void;
	onTouchStart?: (event: TouchEvent<HTMLButtonElement>) => void;
};

type SuggestionListProps = {
	items: SuggestionListItem[];
	className?: string;
	itemClassName?: string;
};

export function SuggestionList({
	items,
	className,
	itemClassName,
}: SuggestionListProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"absolute top-full right-0 left-0 z-10 mt-1 max-h-32 overflow-y-auto rounded-md border bg-white shadow-lg dark:border-border dark:bg-popover",
				className,
			)}
		>
			{items.map((item) => (
				<button
					key={item.key}
					type="button"
					className={cn(
						"block w-full cursor-pointer rounded p-2 text-left text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-accent",
						itemClassName,
					)}
					onClick={item.onClick}
					onMouseDown={item.onMouseDown}
					onTouchStart={item.onTouchStart}
				>
					{item.label}
				</button>
			))}
		</div>
	);
}
