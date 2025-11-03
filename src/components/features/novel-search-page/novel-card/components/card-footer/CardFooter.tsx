"use client";

import { Button } from "@/components/ui/button";
import type { Novel } from "@/types/novel";

interface CardFooterProps {
	novel: Novel;
	onDetailClick: () => void;
	buttonText?: string;
}

export function CardFooter({
	novel,
	onDetailClick,
	buttonText = "詳細を見る",
}: CardFooterProps) {
	return (
		<Button className="mt-auto w-full" onClick={onDetailClick}>
			{buttonText}
		</Button>
	);
}
