"use client";

import {
	ArrowLeft,
	Database,
	Download,
	FileJson,
	Link2,
	Loader2,
	Plus,
	RefreshCw,
	Save,
	Settings,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

import {
	clearStoredNovelData,
	formatUpdateTime,
	getStoredNovelData,
	saveNovelDataFromFile,
	saveNovelDataFromUrl,
} from "@/lib/novelDataStorage";
import { getTagSuggestions } from "@/lib/novelSearchFilters";
import type { TagCategory } from "@/types/category";
import { CATEGORY_COLORS } from "@/types/category";
import type { Novel } from "@/types/novel";

export default function SettingsPage() {
	const fileUploadId = useId();
	const {
		settings,
		addCategory,
		updateCategory,
		deleteCategory,
		addTagToCategory,
		removeTagFromCategory,
	} = useCategories();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<TagCategory | null>(
		null,
	);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryColor, setNewCategoryColor] = useState("blue");
	const [newTag, setNewTag] = useState("");
	const [novels, setNovels] = useState<Novel[]>([]);
	const [activeTagInput, setActiveTagInput] = useState<string | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [dataSource, setDataSource] = useState<{
		type: "url" | "file" | "default";
		url?: string;
		fileName?: string;
		updatedAt?: string;
	}>({ type: "default" });
	const [isUploadingData, setIsUploadingData] = useState(false);
	const [dataSourceUrl, setDataSourceUrl] = useState("");
	const [uploadError, setUploadError] = useState<string | null>(null);
	const categoryNameId = useId();
	const editCategoryNameId = useId();

	// 小説データを読み込み
	const loadNovels = useCallback(() => {
		setIsInitialLoading(true);
		// LocalStorageから読み込み
		const storedData = getStoredNovelData();
		if (storedData) {
			setNovels(storedData.novels);
			setDataSource({
				type: storedData.sourceType,
				url: storedData.sourceUrl,
				fileName: storedData.fileName,
				updatedAt: storedData.updatedAt,
			});
		} else {
			// データがない場合は空配列をセット
			setNovels([]);
			setDataSource({ type: "default" });
		}
		setIsInitialLoading(false);
	}, []);

	useEffect(() => {
		loadNovels();
	}, [loadNovels]);

	// タグ候補を取得
	const allTags = useMemo(() => getTagSuggestions(novels), [novels]);

	const handleAddCategory = () => {
		if (newCategoryName.trim()) {
			addCategory({
				name: newCategoryName.trim(),
				color: newCategoryColor,
				tags: [],
			});
			setNewCategoryName("");
			setNewCategoryColor("blue");
			setIsAddDialogOpen(false);
		}
	};

	const handleEditCategory = (category: TagCategory) => {
		setEditingCategory(category);
		setNewCategoryName(category.name);
		setNewCategoryColor(category.color);
	};

	const handleSaveCategory = () => {
		if (editingCategory && newCategoryName.trim()) {
			updateCategory(editingCategory.id, {
				name: newCategoryName.trim(),
				color: newCategoryColor,
			});
			setEditingCategory(null);
			setNewCategoryName("");
			setNewCategoryColor("blue");
		}
	};

	const handleDeleteCategory = (id: string) => {
		deleteCategory(id);
	};

	const handleAddTag = (categoryId: string) => {
		if (newTag.trim()) {
			addTagToCategory(categoryId, newTag.trim());
			setNewTag("");
			setActiveTagInput(null);
		}
	};

	const handleTagSelect = (categoryId: string, tag: string) => {
		addTagToCategory(categoryId, tag);
		setNewTag("");
		setActiveTagInput(null);
	};

	const handleRemoveTag = (categoryId: string, tag: string) => {
		removeTagFromCategory(categoryId, tag);
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.name.endsWith(".json")) {
			setUploadError("JSONファイルを選択してください");
			return;
		}

		setIsUploadingData(true);
		setUploadError(null);

		try {
			await saveNovelDataFromFile(file);
			await loadNovels();
			setUploadError(null);
		} catch (error) {
			setUploadError(
				error instanceof Error
					? error.message
					: "ファイルの読み込みに失敗しました",
			);
		} finally {
			setIsUploadingData(false);
		}
	};

	const handleUrlSubmit = async () => {
		if (!dataSourceUrl.trim()) {
			setUploadError("URLを入力してください");
			return;
		}

		setIsUploadingData(true);
		setUploadError(null);

		try {
			await saveNovelDataFromUrl(dataSourceUrl);
			await loadNovels();
			setDataSourceUrl("");
			setUploadError(null);
		} catch (error) {
			setUploadError(
				error instanceof Error
					? error.message
					: "URLからのデータ取得に失敗しました",
			);
		} finally {
			setIsUploadingData(false);
		}
	};

	const handleClearData = () => {
		clearStoredNovelData();
		loadNovels();
	};

	const handleRefreshData = async () => {
		if (dataSource.type === "url" && dataSource.url) {
			setIsUploadingData(true);
			setUploadError(null);

			try {
				await saveNovelDataFromUrl(dataSource.url);
				await loadNovels();
				setUploadError(null);
			} catch (error) {
				setUploadError(
					error instanceof Error ? error.message : "データの更新に失敗しました",
				);
			} finally {
				setIsUploadingData(false);
			}
		}
	};

	const getCategoryColorClasses = (color: string) => {
		const colorConfig = CATEGORY_COLORS.find((c) => c.value === color);
		return {
			bgClass: colorConfig?.bgClass || "bg-gray-100 dark:bg-gray-800",
			textClass: colorConfig?.textClass || "text-gray-800 dark:text-gray-200",
		};
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-background">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link href="/">
								<Button variant="outline" size="sm">
									<ArrowLeft className="mr-2 h-4 w-4" />
									戻る
								</Button>
							</Link>
							<div>
								<h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-foreground">
									設定
								</h1>
								<p className="text-gray-600 dark:text-muted-foreground">
									作品カテゴリの管理とアプリケーション設定
								</p>
							</div>
						</div>
						<ThemeToggle />
					</div>
				</header>

				<div className="space-y-8">
					{/* データソース設定 */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								小説データソース設定
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* 現在のデータソース */}
							<div className="rounded-lg border bg-muted/50 p-4">
								<div className="mb-2 flex items-center justify-between">
									<h3 className="font-medium text-sm">現在のデータソース</h3>
									{dataSource.type !== "default" && (
										<div className="flex gap-2">
											{dataSource.type === "url" && (
												<Button
													variant="outline"
													size="sm"
													onClick={handleRefreshData}
													disabled={isUploadingData}
												>
													<RefreshCw className="h-4 w-4" />
													更新
												</Button>
											)}
											<Button
												variant="outline"
												size="sm"
												onClick={handleClearData}
												disabled={isUploadingData}
											>
												<X className="h-4 w-4" />
												クリア
											</Button>
										</div>
									)}
								</div>
								<div className="space-y-1 text-sm">
									<p className="text-muted-foreground">
										{dataSource.type === "default" && (
											<>
												<FileJson className="mr-2 inline h-4 w-4" />
												データが設定されていません
											</>
										)}
										{dataSource.type === "url" && (
											<>
												<Link2 className="mr-2 inline h-4 w-4" />
												URL: {dataSource.url}
											</>
										)}
										{dataSource.type === "file" && (
											<>
												<FileJson className="mr-2 inline h-4 w-4" />
												ファイル: {dataSource.fileName}
											</>
										)}
									</p>
									{dataSource.updatedAt && (
										<p className="text-muted-foreground text-xs">
											最終更新: {formatUpdateTime(dataSource.updatedAt)}
										</p>
									)}
									{novels.length > 0 && (
										<p className="text-muted-foreground text-xs">
											{novels.length}件の小説データ
										</p>
									)}
								</div>
							</div>

							{/* ファイルアップロード */}
							<div className="space-y-3">
								<h3 className="font-medium text-sm">
									JSONファイルをアップロード
								</h3>
								<div className="flex gap-2">
									<Label
										htmlFor={fileUploadId}
										className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 border-dashed px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
									>
										<Upload className="mr-2 h-4 w-4" />
										<span className="text-sm">ファイルを選択</span>
										<Input
											id={fileUploadId}
											type="file"
											accept=".json"
											onChange={handleFileUpload}
											className="hidden"
											disabled={isUploadingData}
										/>
									</Label>
								</div>
							</div>

							{/* URL入力 */}
							<div className="space-y-3">
								<h3 className="font-medium text-sm">URLからデータを取得</h3>
								<div className="flex gap-2">
									<Input
										type="url"
										placeholder="https://example.com/novels.json"
										value={dataSourceUrl}
										onChange={(e) => setDataSourceUrl(e.target.value)}
										disabled={isUploadingData}
									/>
									<Button
										onClick={handleUrlSubmit}
										disabled={!dataSourceUrl.trim() || isUploadingData}
									>
										<Download className="mr-2 h-4 w-4" />
										取得
									</Button>
								</div>
							</div>

							{/* エラー表示 */}
							{uploadError && (
								<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
									{uploadError}
								</div>
							)}

							{/* ローディング表示 */}
							{isUploadingData && (
								<div className="flex items-center justify-center py-4">
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									<span className="text-muted-foreground text-sm">
										データを読み込み中...
									</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* テーマ設定 */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Settings className="h-5 w-5" />
								アプリケーション設定
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">テーマ</h3>
									<p className="text-gray-600 text-sm dark:text-gray-400">
										ライト・ダークモードの切り替え
									</p>
								</div>
								<ThemeToggle />
							</div>
						</CardContent>
					</Card>

					{/* カテゴリ管理 */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className="h-5 w-5 rounded-full p-0"
									/>
									作品カテゴリ管理
								</span>
								<Button onClick={() => setIsAddDialogOpen(true)} size="sm">
									<Plus className="mr-2 h-4 w-4" />
									カテゴリ追加
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{isInitialLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
									<span className="text-muted-foreground">
										データを読み込み中...
									</span>
								</div>
							) : settings.categories.length === 0 ? (
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
										{settings.categories.map((category) => {
											const colorClasses = getCategoryColorClasses(
												category.color,
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
																onClick={() => handleEditCategory(category)}
															>
																編集
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleDeleteCategory(category.id)
																}
																className="text-red-600 hover:text-red-700"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</div>

													{/* タグ一覧 */}
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
																	onClick={() =>
																		handleRemoveTag(category.id, tag)
																	}
																>
																	<X className="h-3 w-3" />
																</Button>
															</Badge>
														))}
													</div>

													{/* タグ追加 */}
													<div className="flex gap-2">
														<div className="relative flex-1">
															<Input
																placeholder="タグ名を入力"
																value={newTag}
																onChange={(e) => setNewTag(e.target.value)}
																onKeyDown={(e) => {
																	if (e.key === "Enter") {
																		handleAddTag(category.id);
																	}
																}}
																onFocus={() => setActiveTagInput(category.id)}
																onBlur={() =>
																	setTimeout(() => setActiveTagInput(null), 150)
																}
																className="flex-1"
															/>
															{newTag && activeTagInput === category.id && (
																<div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-32 overflow-y-auto rounded-md border bg-white shadow-lg dark:border-border dark:bg-popover">
																	{allTags
																		.filter(
																			(tagSuggestion) =>
																				tagSuggestion.tag
																					.toLowerCase()
																					.includes(newTag.toLowerCase()) &&
																				!category.tags.includes(
																					tagSuggestion.tag,
																				),
																		)
																		.slice(0, 10)
																		.map((tagSuggestion) => (
																			<button
																				key={tagSuggestion.tag}
																				type="button"
																				className="block w-full cursor-pointer rounded p-2 text-left text-gray-600 text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-accent"
																				onClick={() =>
																					handleTagSelect(
																						category.id,
																						tagSuggestion.tag,
																					)
																				}
																				onTouchStart={(e) => {
																					e.preventDefault();
																					handleTagSelect(
																						category.id,
																						tagSuggestion.tag,
																					);
																				}}
																			>
																				{tagSuggestion.tag} (
																				{tagSuggestion.count})
																			</button>
																		))}
																</div>
															)}
														</div>
														<Button
															onClick={() => handleAddTag(category.id)}
															size="sm"
															disabled={!newTag.trim()}
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
				</div>
			</div>

			{/* カテゴリ追加ダイアログ */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>新しいカテゴリを追加</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor={categoryNameId}>カテゴリ名</Label>
							<Input
								id={categoryNameId}
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								placeholder="カテゴリ名を入力"
							/>
						</div>
						<div>
							<Label htmlFor="category-color">色</Label>
							<Select
								value={newCategoryColor}
								onValueChange={setNewCategoryColor}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CATEGORY_COLORS.map((color) => (
										<SelectItem key={color.value} value={color.value}>
											<div className="flex items-center gap-2">
												<div
													className={`h-3 w-3 rounded-full ${color.bgClass}`}
												/>
												{color.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
							キャンセル
						</Button>
						<Button
							onClick={handleAddCategory}
							disabled={!newCategoryName.trim()}
						>
							追加
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* カテゴリ編集ダイアログ */}
			<Dialog
				open={!!editingCategory}
				onOpenChange={() => setEditingCategory(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>カテゴリを編集</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor={editCategoryNameId}>カテゴリ名</Label>
							<Input
								id={editCategoryNameId}
								value={newCategoryName}
								onChange={(e) => setNewCategoryName(e.target.value)}
								placeholder="カテゴリ名を入力"
							/>
						</div>
						<div>
							<Label htmlFor="edit-category-color">色</Label>
							<Select
								value={newCategoryColor}
								onValueChange={setNewCategoryColor}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CATEGORY_COLORS.map((color) => (
										<SelectItem key={color.value} value={color.value}>
											<div className="flex items-center gap-2">
												<div
													className={`h-3 w-3 rounded-full ${color.bgClass}`}
												/>
												{color.name}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingCategory(null)}>
							キャンセル
						</Button>
						<Button
							onClick={handleSaveCategory}
							disabled={!newCategoryName.trim()}
						>
							<Save className="mr-2 h-4 w-4" />
							保存
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
