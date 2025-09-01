"use client";

import {
	BookmarkIcon,
	ClockIcon,
	ExternalLinkIcon,
	EyeIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Novel } from "@/types/novel";

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
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatReadingTime = (seconds: number) => {
		const minutes = Math.ceil(seconds / 60);
		return `${minutes}分`;
	};

	const getPixivUrl = (id: string) => {
		return `https://www.pixiv.net/novel/show.php?id=${id}`;
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
									<span>{formatDate(novel.createDate)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">更新日</span>
									<span>{formatDate(novel.updateDate)}</span>
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
							<div className="flex flex-wrap gap-2">
								{novel.tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="cursor-pointer transition-opacity hover:opacity-80"
										onClick={() => {
											onTagSearch(tag);
											onClose();
										}}
									>
										{tag}
									</Badge>
								))}
							</div>
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
							onClick={() => window.open(getPixivUrl(novel.id), "_blank")}
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
