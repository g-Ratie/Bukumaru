"use client";

import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useCategories } from "@/hooks/useCategories";
import { CATEGORY_COLORS } from "@/types/category";
import type { Novel } from "@/types/novel";

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
	const { getCategoryForTag } = useCategories();
	const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);

	const getPixivUserUrl = (userId: string) => {
		return `https://www.pixiv.net/users/${userId}`;
	};

	const handleAuthorSearch = () => {
		onAuthorSearch(novel.userName);
		setIsAuthorDialogOpen(false);
		onClose();
	};

	const handleOpenPixivAuthorPage = () => {
		window.open(getPixivUserUrl(novel.userId), "_blank", "noopener,noreferrer");
		setIsAuthorDialogOpen(false);
	};

	const getCategoryColorClasses = (color: string) => {
		const colorConfig = CATEGORY_COLORS.find((c) => c.value === color);
		return {
			bgClass: colorConfig?.bgClass || "bg-gray-100 dark:bg-gray-800",
			textClass: colorConfig?.textClass || "text-gray-800 dark:text-gray-200",
		};
	};

	const sortTagsByCategory = (tags: string[]) => {
		const categorizedTags: {
			tag: string;
			category: { id: string; name: string; color: string; tags: string[] };
		}[] = [];
		const uncategorizedTags: string[] = [];

		tags.forEach((tag) => {
			const category = getCategoryForTag(tag);
			if (category) {
				categorizedTags.push({ tag, category });
			} else {
				uncategorizedTags.push(tag);
			}
		});

		return { categorizedTags, uncategorizedTags };
	};

	const { categorizedTags, uncategorizedTags } = sortTagsByCategory(novel.tags);

	const sanitizedDescription = useMemo(() => {
		const normalizedDescription = novel.description.replace(/\r?\n/g, "<br />");

		return DOMPurify.sanitize(normalizedDescription, {
			USE_PROFILES: { html: true },
			ALLOWED_TAGS: ["a", "b", "br", "em", "i", "strong", "u"],
			ALLOWED_ATTR: ["href", "title", "target", "rel"],
		});
	}, [novel.description]);

	return (
		<>
			<Drawer open={isOpen} onOpenChange={onClose}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle className="text-left">{novel.title}</DrawerTitle>
						<DrawerDescription className="text-left">
							作品の詳細情報
						</DrawerDescription>
					</DrawerHeader>

					<div className="max-h-[60vh] space-y-4 overflow-y-auto px-4 pb-4">
						{/* 作者名 */}
						<div>
							<h3 className="mb-1 font-semibold text-sm">作者</h3>
							<Button
								variant="link"
								className="h-auto p-0 font-normal text-base text-gray-700 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300"
								onClick={() => setIsAuthorDialogOpen(true)}
							>
								{novel.userName}
							</Button>
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
							<div className="flex flex-wrap gap-1">
								{/* カテゴリ付きタグ */}
								{categorizedTags.map(({ tag, category }) => {
									const colorClasses = getCategoryColorClasses(category.color);
									return (
										<Badge
											key={tag}
											className={`${colorClasses.bgClass} ${colorClasses.textClass} cursor-pointer border-0 text-xs transition-opacity hover:opacity-80`}
											onClick={() => {
												onTagSearch(tag);
												onClose();
											}}
										>
											{tag}
										</Badge>
									);
								})}
								{/* 通常のタグ */}
								{uncategorizedTags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="cursor-pointer text-xs transition-opacity hover:opacity-80"
										onClick={() => {
											onTagSearch(tag);
											onClose();
										}}
									>
										{tag}
									</Badge>
								))}
							</div>
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
			<Dialog open={isAuthorDialogOpen} onOpenChange={setIsAuthorDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>作者に関する操作</DialogTitle>
						<DialogDescription>
							Pixivの作者ページを開くか、この作者名で再検索できます。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleAuthorSearch}>
							作者名で検索する
						</Button>
						<Button onClick={handleOpenPixivAuthorPage}>
							Pixivの作者ページを開く
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
