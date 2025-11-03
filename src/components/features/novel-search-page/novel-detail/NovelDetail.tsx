"use client";

import {
	BookmarkIcon,
	ClockIcon,
	ExternalLinkIcon,
	EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Novel } from "@/types/novel";
import { NovelTags } from "../novel-card/components/novel-tags/NovelTags";
import {
	formatDateWithTime,
	formatReadingTime,
	getPixivNovelURL,
} from "../utils";

interface NovelDetailProps {
	novel: Novel;
	onClose: () => void;
	onAuthorSearch: (authorName: string) => void;
	onTagSearch: (tag: string) => void;
}

export function NovelDetail({
	novel,
	onClose,
	onAuthorSearch,
	onTagSearch,
}: NovelDetailProps) {
	const handleTagClick = (tag: string) => {
		onTagSearch(tag);
		onClose();
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="pr-8 font-bold text-2xl">
						{novel.title}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* 基本情報 */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">作品情報</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">作者</span>
									<Button
										variant="link"
										size="sm"
										className="h-auto p-0 font-medium text-blue-600 hover:text-blue-800"
										onClick={() => onAuthorSearch(novel.userName)}
									>
										{novel.userName}
									</Button>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">文字数</span>
									<span>{novel.textCount.toLocaleString()}字</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">単語数</span>
									<span>{novel.wordCount.toLocaleString()}語</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">読了時間</span>
									<span>{formatReadingTime(novel.readingTime)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">ブックマーク数</span>
									<span className="flex items-center gap-1">
										<BookmarkIcon size={16} />
										{novel.bookmarkCount.toLocaleString()}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">公開情報</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">作成日</span>
									<span>{formatDateWithTime(novel.createDate)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">更新日</span>
									<span>{formatDateWithTime(novel.updateDate)}</span>
								</div>

								<div className="flex justify-between">
									<span className="text-gray-600">オリジナル</span>
									<span>{novel.isOriginal ? "はい" : "いいえ"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">AI使用</span>
									<span>{novel.aiType === 2 ? "はい" : "いいえ"}</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* 説明文 */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">作品説明</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="whitespace-pre-wrap text-gray-700">
								{novel.description || "説明がありません"}
							</div>
						</CardContent>
					</Card>

					{/* タグ */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">タグ</CardTitle>
						</CardHeader>
						<CardContent>
							<NovelTags tags={novel.tags} onTagClick={handleTagClick} />
						</CardContent>
					</Card>

					{/* アクション */}
					<div className="flex items-center justify-between border-t pt-4">
						<div className="flex items-center gap-4 text-gray-500 text-sm">
							<span className="flex items-center gap-1">
								<EyeIcon size={16} />
								{novel.textCount.toLocaleString()}字
							</span>
							<span className="flex items-center gap-1">
								<ClockIcon size={16} />
								{formatReadingTime(novel.readingTime)}
							</span>
							<span className="flex items-center gap-1">
								<BookmarkIcon size={16} />
								{novel.bookmarkCount.toLocaleString()}
							</span>
						</div>

						<Button
							onClick={() => window.open(getPixivNovelURL(novel.id), "_blank")}
							className="flex items-center gap-2"
						>
							<ExternalLinkIcon size={16} />
							pixivで読む
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
