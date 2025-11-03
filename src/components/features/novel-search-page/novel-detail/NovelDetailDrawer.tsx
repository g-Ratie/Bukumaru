"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Novel } from "@/types/novel";
import { NovelTags } from "../novel-card/components/novel-tags/NovelTags";
import { getPixivUserURL, sanitizeNovelDescription } from "../utils";

interface NovelDetailDrawerProps {
	novel: Novel;
	isOpen: boolean;
	onClose: () => void;
	onTagSearch: (tag: string) => void;
	onAuthorSearch: (authorName: string) => void;
}

export function NovelDetailDrawer({
	novel,
	isOpen,
	onClose,
	onTagSearch,
	onAuthorSearch,
}: NovelDetailDrawerProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const sanitizedDescription = useMemo(
		() => sanitizeNovelDescription(novel.description),
		[novel.description],
	);

	const handleAuthorSearch = () => {
		onAuthorSearch(novel.userName);
		onClose();
	};

	const handleOpenPixivAuthorPage = () => {
		window.open(getPixivUserURL(novel.userId), "_blank", "noopener,noreferrer");
	};

	const handleTagClick = (tag: string) => {
		onTagSearch(tag);
		onClose();
	};

	return (
		<Drawer
			open={isOpen}
			onOpenChange={onClose}
			direction={isDesktop ? "right" : "bottom"}
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle className="text-left">{novel.title}</DrawerTitle>
					<DrawerDescription className="text-left">
						作品の詳細情報
					</DrawerDescription>
				</DrawerHeader>

				<div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
					{/* 作者名 */}
					<div>
						<h3 className="mb-1 font-semibold text-sm">作者</h3>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="link"
									className="h-auto p-0 font-normal text-base text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300"
								>
									{novel.userName}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56">
								<DropdownMenuItem onClick={handleAuthorSearch}>
									作者名で検索する
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleOpenPixivAuthorPage}>
									Pixivの作者ページを開く
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* 文字数 */}
					<div>
						<h3 className="mb-1 font-semibold text-sm">文字数</h3>
						<p className="text-gray-700 dark:text-gray-300">
							{novel.textCount.toLocaleString()}字
						</p>
					</div>

					{/* タグ */}
					<div>
						<h3 className="mb-2 font-semibold text-sm">タグ</h3>
						<NovelTags tags={novel.tags} onTagClick={handleTagClick} />
					</div>

					{/* 小説の説明文 */}
					<div>
						<h3 className="mb-2 font-semibold text-sm">説明</h3>
						<div
							className="text-gray-700 text-sm dark:text-gray-300"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: 一旦許可
							dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
						/>
					</div>
				</div>

				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">閉じる</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
