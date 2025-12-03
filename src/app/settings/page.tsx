"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useSettingsDataSource } from "@/hooks/useSettingsDataSource";
import type { TagCategory } from "@/types/category";
import { getTagSuggestions } from "@/utils/filter/novelSearchFilters";

import { CategoryDialog } from "./components/CategoryDialog";
import { CategoryManagementCard } from "./components/CategoryManagementCard";
import { DataSourceSettingsCard } from "./components/DataSourceSettingsCard";
import { ThemeSettingsCard } from "./components/ThemeSettingsCard";

export default function SettingsPage() {
	const {
		novels,
		dataSource,
		isUploadingData,
		dataSourceUrl,
		uploadError,
		isInitialLoading,
		setDataSourceUrl,
		handleFileUpload,
		handleUrlSubmit,
		handleRefreshData,
		handleClearData,
	} = useSettingsDataSource();
	const {
		settings,
		isLoaded,
		addCategory,
		updateCategory,
		deleteCategory,
		addTagToCategory,
		removeTagFromCategory,
	} = useCategories();

	const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<TagCategory | null>(
		null,
	);

	const tagSuggestions = useMemo(() => getTagSuggestions(novels), [novels]);
	const isCategoryLoading = isInitialLoading || !isLoaded;

	const handleOpenAddDialog = () => {
		setDialogMode("add");
		setEditingCategory(null);
		setIsDialogOpen(true);
	};

	const handleOpenEditDialog = (category: TagCategory) => {
		setDialogMode("edit");
		setEditingCategory(category);
		setIsDialogOpen(true);
	};

	const handleDialogSubmit = ({
		name,
		color,
	}: {
		name: string;
		color: string;
	}) => {
		if (dialogMode === "add") {
			void addCategory({ name, color, tags: [] });
		} else if (editingCategory) {
			void updateCategory(editingCategory.id, { name, color });
		}

		setIsDialogOpen(false);
		setEditingCategory(null);
	};

	const handleDialogOpenChange = (open: boolean) => {
		setIsDialogOpen(open);
		if (!open) {
			setEditingCategory(null);
		}
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
					<DataSourceSettingsCard
						dataSource={dataSource}
						novelsCount={novels.length}
						isUploadingData={isUploadingData}
						dataSourceUrl={dataSourceUrl}
						uploadError={uploadError}
						onUrlChange={setDataSourceUrl}
						onUrlSubmit={handleUrlSubmit}
						onFileUpload={(file) => handleFileUpload({ file })}
						onRefresh={handleRefreshData}
						onClear={handleClearData}
					/>

					<ThemeSettingsCard />

					<CategoryManagementCard
						categories={settings.categories}
						isLoading={isCategoryLoading}
						onAddCategoryClick={handleOpenAddDialog}
						onEditCategory={handleOpenEditDialog}
						onDeleteCategory={deleteCategory}
						onAddTag={addTagToCategory}
						onRemoveTag={removeTagFromCategory}
						tagSuggestions={tagSuggestions}
					/>
				</div>
			</div>

			<CategoryDialog
				mode={dialogMode}
				open={isDialogOpen}
				onOpenChange={handleDialogOpenChange}
				onSubmit={handleDialogSubmit}
				defaultValues={
					dialogMode === "edit" && editingCategory
						? { name: editingCategory.name, color: editingCategory.color }
						: undefined
				}
			/>
		</div>
	);
}
