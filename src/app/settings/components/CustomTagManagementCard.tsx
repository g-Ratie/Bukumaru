"use client";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomTag } from "@/types/customTag";
import { getCategoryColorClasses } from "@/utils/category/categoryColors";

interface CustomTagManagementCardProps {
	customTags: CustomTag[];
	isLoading: boolean;
	onAddCustomTagClick: () => void;
	onEditCustomTag: (customTag: CustomTag) => void;
	onDeleteCustomTag: (id: string) => Promise<void>;
}

export function CustomTagManagementCard({
	customTags,
	isLoading,
	onAddCustomTagClick,
	onEditCustomTag,
	onDeleteCustomTag,
}: CustomTagManagementCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<Badge variant="secondary" className="h-5 w-5 rounded-full p-0" />
						カスタムタグ管理
					</span>
					<Button onClick={onAddCustomTagClick} size="sm">
						<Plus className="mr-2 h-4 w-4" />
						カスタムタグ追加
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">データを読み込み中...</span>
					</div>
				) : customTags.length === 0 ? (
					<div className="py-8 text-center">
						<p className="text-gray-500 dark:text-gray-400">
							カスタムタグが設定されていません
						</p>
						<p className="mt-1 text-gray-400 text-sm dark:text-gray-500">
							タグを組み合わせて管理しやすい名前を付けましょう
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{customTags.map((customTag) => {
							const colorClasses = getCategoryColorClasses(customTag.color);

							return (
                                                                <div
                                                                        key={customTag.id}
                                                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                                                >
                                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                                <div className="flex flex-wrap items-center gap-3">
                                                                                        <Badge
                                                                                                className={`${colorClasses.bgClass} ${colorClasses.textClass} border-0`}
                                                                                        >
                                                                                                <span
                                                                                                        aria-hidden
                                                                                                        className={`h-2.5 w-2.5 rounded-full border border-white/60 ${colorClasses.bgClass}`}
                                                                                                />
                                                                                                {customTag.name}
                                                                                        </Badge>
                                                                                        <span className="text-muted-foreground text-sm">
                                                                                                {customTag.tags.length > 0
                                                                                                        ? `構成タグ: ${customTag.tags.length}件`
													: "構成タグなし"}
											</span>
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => onEditCustomTag(customTag)}
											>
												<Pencil className="mr-2 h-4 w-4" />
												編集
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700"
												onClick={() => void onDeleteCustomTag(customTag.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
									<div className="mt-3 flex flex-wrap gap-2">
										{customTag.tags.length === 0 ? (
											<p className="text-muted-foreground text-sm">
												構成タグが登録されていません
											</p>
										) : (
											customTag.tags.map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="flex items-center gap-1"
												>
													{tag}
												</Badge>
											))
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
