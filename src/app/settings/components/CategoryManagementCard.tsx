"use client";

import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
	SuggestionList,
	type SuggestionListItem,
} from "@/components/shared/suggestion-list/SuggestionList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TagCategory } from "@/types/category";
import { getCategoryColorClasses } from "@/utils/category/categoryColors";

interface CategoryManagementCardProps {
	categories: TagCategory[];
	isLoading: boolean;
	onAddCategoryClick: () => void;
	onEditCategory: (category: TagCategory) => void;
	onDeleteCategory: (id: string) => Promise<void>;
	onAddTag: (categoryId: string, tag: string) => Promise<void>;
	onRemoveTag: (categoryId: string, tag: string) => Promise<void>;
	tagSuggestions: Array<{ tag: string; count: number }>;
}

export function CategoryManagementCard({
	categories,
	isLoading,
	onAddCategoryClick,
	onEditCategory,
	onDeleteCategory,
	onAddTag,
	onRemoveTag,
	tagSuggestions,
}: CategoryManagementCardProps) {
	const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

	const suggestionsByCategory = useMemo(() => {
		return categories.reduce<
			Record<string, Array<{ tag: string; count: number }>>
		>((acc, category) => {
			const keyword = tagInputs[category.id]?.toLowerCase() ?? "";
			if (!keyword) {
				acc[category.id] = [];
			} else {
				acc[category.id] = tagSuggestions
					.filter(
						(suggestion) =>
							suggestion.tag.toLowerCase().includes(keyword) &&
							!category.tags.includes(suggestion.tag),
					)
					.slice(0, 10);
			}
			return acc;
		}, {});
	}, [categories, tagInputs, tagSuggestions]);

	const handleTagInputChange = (categoryId: string, value: string) => {
		setTagInputs((previous) => ({ ...previous, [categoryId]: value }));
	};

	const handleTagAddition = (categoryId: string) => {
		const newTag = tagInputs[categoryId]?.trim();
		if (!newTag) return;
		void onAddTag(categoryId, newTag);
		setTagInputs((previous) => ({ ...previous, [categoryId]: "" }));
		setActiveCategoryId(null);
	};

	const handleTagSelect = (categoryId: string, tag: string) => {
		void onAddTag(categoryId, tag);
		setTagInputs((previous) => ({ ...previous, [categoryId]: "" }));
		setActiveCategoryId(null);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<Badge variant="secondary" className="h-5 w-5 rounded-full p-0" />
						作品カテゴリ管理
					</span>
					<Button onClick={onAddCategoryClick} size="sm">
						<Plus className="mr-2 h-4 w-4" />
						カテゴリ追加
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">データを読み込み中...</span>
					</div>
				) : categories.length === 0 ? (
					<div className="py-8 text-center">
						<p className="text-gray-500 dark:text-gray-400">
							カテゴリが設定されていません
						</p>
						<p className="mt-1 text-gray-400 text-sm dark:text-gray-500">
							カテゴリを作成してタグに色を付けましょう
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{categories.map((category) => {
							const colorClasses = getCategoryColorClasses(category.color);
							const inputValue = tagInputs[category.id] ?? "";
							const suggestions = suggestionsByCategory[category.id] ?? [];
							const suggestionItems: SuggestionListItem[] = suggestions.map(
								(suggestion) => ({
									key: suggestion.tag,
									label: `${suggestion.tag} (${suggestion.count})`,
									onMouseDown: (event) => {
										event.preventDefault();
										handleTagSelect(category.id, suggestion.tag);
									},
								}),
							);

							return (
								<div
									key={category.id}
									className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
								>
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge
												className={`${colorClasses.bgClass} ${colorClasses.textClass} border-0`}
											>
												{category.name}
											</Badge>
											<span className="text-gray-500 text-sm dark:text-gray-400">
												({category.tags.length}個のタグ)
											</span>
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => onEditCategory(category)}
											>
												編集
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => void onDeleteCategory(category.id)}
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<div className="mb-3 flex flex-wrap gap-2">
										{category.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="flex items-center gap-1"
											>
												{tag}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0"
													onClick={() => void onRemoveTag(category.id, tag)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>

									<div className="flex gap-2">
										<div className="relative flex-1">
											<Input
												placeholder="タグ名を入力"
												value={inputValue}
												onChange={(event) =>
													handleTagInputChange(category.id, event.target.value)
												}
												onKeyDown={(event) => {
													if (event.key === "Enter") {
														event.preventDefault();
														handleTagAddition(category.id);
													}
												}}
												onFocus={() => setActiveCategoryId(category.id)}
												onBlur={() =>
													setTimeout(() => setActiveCategoryId(null), 150)
												}
												className="flex-1"
											/>
											{inputValue &&
												activeCategoryId === category.id &&
												suggestions.length > 0 && (
													<SuggestionList items={suggestionItems} />
												)}
										</div>
										<Button
											onClick={() => handleTagAddition(category.id)}
											size="sm"
											disabled={!inputValue.trim()}
										>
											追加
										</Button>
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
