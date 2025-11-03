"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Novel } from "@/types/novel";
import { NovelDetailDrawer } from "../novel-detail/NovelDetailDrawer";
import { CardContent } from "./components/card-content/CardContent";
import { CardHeader } from "./components/card-header/CardHeader";

interface NovelCardProps {
	novel: Novel;
	onAuthorSearch: (authorName: string) => void;
	onTagSearch: (tag: string) => void;
}

export function NovelCard({
	novel,
	onAuthorSearch,
	onTagSearch,
}: NovelCardProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<Card className="flex flex-col transition-shadow hover:shadow-lg dark:bg-card dark:text-card-foreground">
			<CardHeader
				title={novel.title}
				novelId={novel.id}
				userName={novel.userName}
				createDate={novel.createDate}
				seriesTitle={novel.seriesTitle}
				seriesId={novel.seriesId}
				onAuthorSearch={onAuthorSearch}
			/>

			<CardContent
				description={novel.description}
				tags={novel.tags}
				textCount={novel.textCount}
				readingTime={novel.readingTime}
				bookmarkCount={novel.bookmarkCount}
				onTagSearch={onTagSearch}
			/>

			<div className="px-6 pb-6">
				<Button className="w-full" onClick={() => setIsDrawerOpen(true)}>
					詳細を見る
				</Button>
			</div>

			<NovelDetailDrawer
				novel={novel}
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
				onTagSearch={onTagSearch}
				onAuthorSearch={onAuthorSearch}
			/>
		</Card>
	);
}
