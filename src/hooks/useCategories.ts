"use client";

import { useCallback, useEffect, useState } from "react";
import {
	addCategory as addCategoryToStorage,
	deleteCategory as deleteCategoryFromStorage,
	getCategorySettings,
	updateCategory as updateCategoryInStorage,
} from "@/lib/categoryStorage";
import type { CategorySettings, TagCategory } from "@/types/category";

export function useCategories() {
	const [settings, setSettings] = useState<CategorySettings>({
		categories: [],
	});
	const [isLoaded, setIsLoaded] = useState(false);

	// ローカルストレージから設定を読み込み
	useEffect(() => {
		const loadedSettings = getCategorySettings();
		setSettings(loadedSettings);
		setIsLoaded(true);
	}, []);

	const addCategory = useCallback((category: Omit<TagCategory, "id">) => {
		const newCategory = addCategoryToStorage(category);
		setSettings((prev) => ({
			categories: [...prev.categories, newCategory],
		}));
		return newCategory;
	}, []);

	const updateCategory = useCallback(
		(id: string, updates: Partial<Omit<TagCategory, "id">>) => {
			updateCategoryInStorage(id, updates);
			setSettings((prev) => ({
				categories: prev.categories.map((cat) =>
					cat.id === id ? { ...cat, ...updates } : cat,
				),
			}));
		},
		[],
	);

	const deleteCategory = useCallback((id: string) => {
		deleteCategoryFromStorage(id);
		setSettings((prev) => ({
			categories: prev.categories.filter((cat) => cat.id !== id),
		}));
	}, []);

	const addTagToCategory = useCallback(
		(categoryId: string, tag: string) => {
			const category = settings.categories.find((cat) => cat.id === categoryId);
			if (!category) return;

			const updatedTags = [...category.tags, tag].filter(
				(tag, index, arr) => arr.indexOf(tag) === index,
			);

			updateCategory(categoryId, { tags: updatedTags });
		},
		[settings.categories, updateCategory],
	);

	const removeTagFromCategory = useCallback(
		(categoryId: string, tag: string) => {
			const category = settings.categories.find((cat) => cat.id === categoryId);
			if (!category) return;

			const updatedTags = category.tags.filter((t) => t !== tag);
			updateCategory(categoryId, { tags: updatedTags });
		},
		[settings.categories, updateCategory],
	);

	const getCategoryForTag = useCallback(
		(tag: string): TagCategory | null => {
			return (
				settings.categories.find((category) =>
					category.tags.some(
						(categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase(),
					),
				) || null
			);
		},
		[settings.categories],
	);

	return {
		settings,
		isLoaded,
		addCategory,
		updateCategory,
		deleteCategory,
		addTagToCategory,
		removeTagFromCategory,
		getCategoryForTag,
	};
}
