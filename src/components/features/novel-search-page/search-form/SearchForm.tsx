"use client";

import { FolderOpen, MoreVertical, Save, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAuthorSuggestions,
	getTagSuggestions,
} from "@/lib/novelSearchFilters";
import {
	deleteSavedFilter,
	getAllSavedFilters,
	saveFilter,
} from "@/lib/savedFiltersDB";
import type { Novel } from "@/types/novel";
import type { SavedFilter, SavedFilterData } from "@/types/savedFilter";
import type { SearchFilters } from "@/types/search";
import { SaveFilterDialog } from "./save-filter-dialog/SaveFilterDialog";
import { SavedFiltersSection } from "./saved-filters-section/SavedFiltersSection";

interface SearchFormProps {
	filters: SearchFilters;
	onFilterChange: (filters: SearchFilters) => void;
	novels: Novel[];
}

export function SearchForm({
	filters,
	onFilterChange,
	novels,
}: SearchFormProps) {
	const [tagInput, setTagInput] = useState("");
	const [authorInput, setAuthorInput] = useState(filters.authorName);
	const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
	const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
	const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
	const authorId = useId();
	const tagsId = useId();

	const allTags = useMemo(() => getTagSuggestions(novels), [novels]);
	const allAuthors = useMemo(() => getAuthorSuggestions(novels), [novels]);

	const loadSavedFilters = useCallback(async () => {
		try {
			const filters = await getAllSavedFilters();
			setSavedFilters(filters);
		} catch (error) {
			console.error("Failed to load saved filters:", error);
		}
	}, []);

	useEffect(() => {
		loadSavedFilters();
	}, [loadSavedFilters]);

	// フィルターが外部から変更されたときにauthorInputを同期
	useEffect(() => {
		setAuthorInput(filters.authorName);
	}, [filters.authorName]);

	const handleAuthorChange = (value: string) => {
		setAuthorInput(value);
		onFilterChange({ ...filters, authorName: value });
	};

	const handleTagAdd = () => {
		if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
			onFilterChange({
				...filters,
				tags: [...filters.tags, tagInput.trim()],
			});
			setTagInput("");
		}
	};

	const handleTagRemove = (tagToRemove: string) => {
		onFilterChange({
			...filters,
			tags: filters.tags.filter((tag) => tag !== tagToRemove),
		});
	};
	const handleTextCountChange = (type: "min" | "max", value: string) => {
		const numValue = parseInt(value) || 0;
		onFilterChange({
			...filters,
			[type === "min" ? "minTextCount" : "maxTextCount"]: numValue,
		});
	};

	const handleSortChange = (value: string) => {
		const [sortBy, sortOrder] = value.split("-");
		onFilterChange({
			...filters,
			sortBy: sortBy as SearchFilters["sortBy"],
			sortOrder: sortOrder as SearchFilters["sortOrder"],
		});
	};

	const handleReset = () => {
		setAuthorInput("");
		setTagInput("");
		onFilterChange({
			authorName: "",
			tags: [],
			selectedTag: "",
			minTextCount: 0,
			maxTextCount: 50000,
			sortBy: "createDate",
			sortOrder: "desc",
			currentPage: 1,
			itemsPerPage: 24,
		});
	};

	const handleSaveFilter = async (name: string) => {
		const filterData: SavedFilterData = {
			authorName: filters.authorName,
			tags: filters.tags,
			selectedTag: filters.selectedTag,
			minTextCount: filters.minTextCount,
			maxTextCount: filters.maxTextCount,
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder,
		};

		try {
			await saveFilter(name, filterData);
			await loadSavedFilters();
		} catch (error) {
			console.error("Failed to save filter:", error);
			throw error;
		}
	};

	const handleApplyFilter = (filter: SavedFilter) => {
		onFilterChange({
			...filters,
			...filter.filterData,
			currentPage: 1,
		});
		setAuthorInput(filter.filterData.authorName);
	};

	const handleDeleteFilter = async (id: string) => {
		try {
			await deleteSavedFilter(id);
			await loadSavedFilters();
		} catch (error) {
			console.error("Failed to delete filter:", error);
		}
	};

	return (
		<div className="space-y-6 rounded-lg bg-white p-4 shadow-md sm:p-6 dark:bg-card dark:text-card-foreground">
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-lg sm:text-xl">検索フィルター</h2>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={handleReset}>
						リセット
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" aria-label="メニュー">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setIsLoadDialogOpen(true)}>
								<FolderOpen className="mr-2 h-4 w-4" />
								検索条件を読み込む
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
								<Save className="mr-2 h-4 w-4" />
								検索条件を保存
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* 作者検索 */}
			<div className="space-y-2">
				<Label htmlFor={authorId}>作者名</Label>
				<div className="relative">
					<Input
						id={authorId}
						placeholder="作者名を入力"
						value={authorInput}
						onChange={(e) => handleAuthorChange(e.target.value)}
					/>
					{authorInput && (
						<div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-32 overflow-y-auto rounded-md border bg-white shadow-lg dark:border-border dark:bg-popover">
							{allAuthors
								.filter((author) =>
									author.userName
										.toLowerCase()
										.includes(authorInput.toLowerCase()),
								)
								.slice(0, 10)
								.map((author) => (
									<button
										key={author.userName}
										type="button"
										className="block w-full cursor-pointer rounded p-2 text-left text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-accent"
										onClick={() => handleAuthorChange(author.userName)}
										onTouchStart={(e) => {
											e.preventDefault();
											handleAuthorChange(author.userName);
										}}
									>
										{author.userName} ({author.count}作品)
									</button>
								))}
						</div>
					)}
				</div>
			</div>

			{/* タグ検索 */}
			<div className="space-y-2">
				<Label htmlFor={tagsId}>タグ</Label>
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Input
							id={tagsId}
							placeholder="タグを入力"
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
						/>
						{tagInput && (
							<div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-32 overflow-y-auto rounded-md border bg-white shadow-lg dark:border-border dark:bg-popover">
								{allTags
									.filter((tagSuggestion) =>
										tagSuggestion.tag
											.toLowerCase()
											.includes(tagInput.toLowerCase()),
									)
									.slice(0, 10)
									.map((tagSuggestion) => (
										<button
											key={tagSuggestion.tag}
											type="button"
											className="block w-full cursor-pointer rounded p-2 text-left text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-accent"
											onClick={() => {
												if (!filters.tags.includes(tagSuggestion.tag)) {
													onFilterChange({
														...filters,
														tags: [...filters.tags, tagSuggestion.tag],
													});
												}
												setTagInput("");
											}}
											onTouchStart={(e) => {
												e.preventDefault();
												if (!filters.tags.includes(tagSuggestion.tag)) {
													onFilterChange({
														...filters,
														tags: [...filters.tags, tagSuggestion.tag],
													});
												}
												setTagInput("");
											}}
										>
											{tagSuggestion.tag} ({tagSuggestion.count})
										</button>
									))}
							</div>
						)}
					</div>
					<Button onClick={handleTagAdd}>追加</Button>
				</div>
				{filters.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{filters.tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
								<Button
									variant="ghost"
									size="sm"
									className="ml-1 h-auto p-0"
									onClick={() => handleTagRemove(tag)}
								>
									<X size={12} />
								</Button>
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* 文字数絞り込み */}
			<div className="space-y-2">
				<Label>文字数</Label>
				<div className="grid grid-cols-2 gap-2">
					<Input
						placeholder="最小"
						type="number"
						value={filters.minTextCount}
						onChange={(e) => handleTextCountChange("min", e.target.value)}
					/>
					<Input
						placeholder="最大"
						type="number"
						value={filters.maxTextCount}
						onChange={(e) => handleTextCountChange("max", e.target.value)}
					/>
				</div>
				<div className="flex flex-wrap gap-1 sm:gap-2">
					<Button
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
						onClick={() =>
							onFilterChange({
								...filters,
								minTextCount: 0,
								maxTextCount: 5000,
							})
						}
					>
						短編 (~5K)
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
						onClick={() =>
							onFilterChange({
								...filters,
								minTextCount: 5000,
								maxTextCount: 20000,
							})
						}
					>
						中編 (5K-20K)
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
						onClick={() =>
							onFilterChange({
								...filters,
								minTextCount: 20000,
								maxTextCount: 50000,
							})
						}
					>
						長編 (20K+)
					</Button>
				</div>
			</div>

			{/* ソート */}
			<div className="space-y-2">
				<Label>ソート</Label>
				<Select
					value={`${filters.sortBy}-${filters.sortOrder}`}
					onValueChange={handleSortChange}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="createDate-desc">作成日 (新しい順)</SelectItem>
						<SelectItem value="createDate-asc">作成日 (古い順)</SelectItem>
						<SelectItem value="textCount-desc">文字数 (多い順)</SelectItem>
						<SelectItem value="textCount-asc">文字数 (少ない順)</SelectItem>
						<SelectItem value="bookmarkCount-desc">
							ブックマーク数 (多い順)
						</SelectItem>
						<SelectItem value="bookmarkCount-asc">
							ブックマーク数 (少ない順)
						</SelectItem>
						<SelectItem value="title-asc">タイトル (A-Z)</SelectItem>
						<SelectItem value="userName-asc">作者名 (A-Z)</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* 保存ダイアログ */}
			<SaveFilterDialog
				isOpen={isSaveDialogOpen}
				onClose={() => setIsSaveDialogOpen(false)}
				onSave={handleSaveFilter}
				existingFilters={savedFilters}
			/>

			{/* 読み込みダイアログ */}
			<SavedFiltersSection
				isOpen={isLoadDialogOpen}
				onClose={() => setIsLoadDialogOpen(false)}
				savedFilters={savedFilters}
				onApplyFilter={handleApplyFilter}
				onDeleteFilter={handleDeleteFilter}
			/>
		</div>
	);
}
