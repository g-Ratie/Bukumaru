"use client";

import { Button } from "@/components/ui/button";

interface CardFooterProps {
	onDetailClick: () => void;
	buttonText?: string;
}

export function CardFooter({
	onDetailClick,
	buttonText = "詳細を見る",
}: CardFooterProps) {
	return (
		<Button className="mt-auto w-full" onClick={onDetailClick}>
			{buttonText}
		</Button>
	);
}
