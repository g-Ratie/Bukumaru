"use client";

import type { CategorySettings, TagCategory } from "@/types/category";

const STORAGE_KEY = "novel-search-categories";

export function getCategorySettings(): CategorySettings {
	if (typeof window === "undefined") {
		return { categories: [] };
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.warn("カテゴリ設定の読み込みに失敗しました:", error);
	}

	return { categories: [] };
}

export function saveCategorySettings(settings: CategorySettings): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch (error) {
		console.warn("カテゴリ設定の保存に失敗しました:", error);
	}
}

export function getCategoryForTag(tag: string): TagCategory | null {
	const settings = getCategorySettings();
	return (
		settings.categories.find((category) =>
			category.tags.some(
				(categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase(),
			),
		) || null
	);
}

export function addCategory(category: Omit<TagCategory, "id">): TagCategory {
	const settings = getCategorySettings();
	const newCategory: TagCategory = {
		...category,
		id: crypto.randomUUID(),
	};

	settings.categories.push(newCategory);
	saveCategorySettings(settings);
	return newCategory;
}

export function updateCategory(
	id: string,
	updates: Partial<Omit<TagCategory, "id">>,
): void {
	const settings = getCategorySettings();
	const categoryIndex = settings.categories.findIndex((cat) => cat.id === id);

	if (categoryIndex >= 0) {
		settings.categories[categoryIndex] = {
			...settings.categories[categoryIndex],
			...updates,
		};
		saveCategorySettings(settings);
	}
}

export function deleteCategory(id: string): void {
	const settings = getCategorySettings();
	settings.categories = settings.categories.filter((cat) => cat.id !== id);
	saveCategorySettings(settings);
}
