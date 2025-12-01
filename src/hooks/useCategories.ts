"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategorySettings, TagCategory } from "@/types/category";
import {
	addCategory as addCategoryToStorage,
	deleteCategory as deleteCategoryFromStorage,
	getCategorySettings,
	updateCategory as updateCategoryInStorage,
} from "@/utils/category/categoryStorage";

export function useCategories() {
	const [settings, setSettings] = useState<CategorySettings>({
		categories: [],
	});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const load = async () => {
			const loadedSettings = await getCategorySettings();
			if (!isMounted) return;
			setSettings(loadedSettings);
			setIsLoaded(true);
		};

		void load();
		return () => {
			isMounted = false;
		};
	}, []);

	const addCategory = useCallback(async (category: Omit<TagCategory, "id">) => {
		const newCategory = await addCategoryToStorage(category);
		setSettings((prev) => ({
			categories: [...prev.categories, newCategory],
		}));
		return newCategory;
	}, []);

	const updateCategory = useCallback(
		async (id: string, updates: Partial<Omit<TagCategory, "id">>) => {
			await updateCategoryInStorage(id, updates);
			setSettings((prev) => ({
				categories: prev.categories.map((cat) =>
					cat.id === id ? { ...cat, ...updates } : cat,
				),
			}));
		},
		[],
	);

	const deleteCategory = useCallback(async (id: string) => {
		await deleteCategoryFromStorage(id);
		setSettings((prev) => ({
			categories: prev.categories.filter((cat) => cat.id !== id),
		}));
	}, []);

	const addTagToCategory = useCallback(
		async (categoryId: string, tag: string) => {
			const category = settings.categories.find((cat) => cat.id === categoryId);
			if (!category) return;

			const updatedTags = [...category.tags, tag].filter(
				(tag, index, arr) => arr.indexOf(tag) === index,
			);

			await updateCategory(categoryId, { tags: updatedTags });
		},
		[settings.categories, updateCategory],
	);

	const removeTagFromCategory = useCallback(
		async (categoryId: string, tag: string) => {
			const category = settings.categories.find((cat) => cat.id === categoryId);
			if (!category) return;

			const updatedTags = category.tags.filter((t) => t !== tag);
			await updateCategory(categoryId, { tags: updatedTags });
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
