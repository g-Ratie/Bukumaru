"use client";

import type { CategorySettings, TagCategory } from "@/types/category";
import { getValue, setValue } from "../../lib/indexedDb";

const STORAGE_KEY = "novel-search-categories";

async function migrateFromLocalStorage(): Promise<CategorySettings | null> {
	if (typeof window === "undefined") return null;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored) as CategorySettings;
			await setValue<CategorySettings>(STORAGE_KEY, parsed);
			localStorage.removeItem(STORAGE_KEY);
			return parsed;
		}
	} catch (error) {
		console.warn("カテゴリ設定の移行に失敗しました:", error);
	}

	return null;
}

export async function getCategorySettings(): Promise<CategorySettings> {
	if (typeof window === "undefined") {
		return { categories: [] };
	}

	try {
		const stored = await getValue<CategorySettings>(STORAGE_KEY);
		if (stored) {
			return stored;
		}

		const migrated = await migrateFromLocalStorage();
		if (migrated) {
			return migrated;
		}
	} catch (error) {
		console.warn("カテゴリ設定の読み込みに失敗しました:", error);
	}

	return { categories: [] };
}

export async function saveCategorySettings(
	settings: CategorySettings,
): Promise<void> {
	if (typeof window === "undefined") {
		return;
	}

	try {
		await setValue<CategorySettings>(STORAGE_KEY, settings);
	} catch (error) {
		console.warn("カテゴリ設定の保存に失敗しました:", error);
	}
}

export async function getCategoryForTag(
	tag: string,
): Promise<TagCategory | null> {
	const settings = await getCategorySettings();
	return (
		settings.categories.find((category) =>
			category.tags.some(
				(categoryTag) => categoryTag.toLowerCase() === tag.toLowerCase(),
			),
		) || null
	);
}

export async function addCategory(
	category: Omit<TagCategory, "id">,
): Promise<TagCategory> {
	const settings = await getCategorySettings();
	const newCategory: TagCategory = {
		...category,
		id: crypto.randomUUID(),
	};

	settings.categories.push(newCategory);
	await saveCategorySettings(settings);
	return newCategory;
}

export async function updateCategory(
	id: string,
	updates: Partial<Omit<TagCategory, "id">>,
): Promise<void> {
	const settings = await getCategorySettings();
	const categoryIndex = settings.categories.findIndex((cat) => cat.id === id);

	if (categoryIndex >= 0) {
		settings.categories[categoryIndex] = {
			...settings.categories[categoryIndex],
			...updates,
		};
		await saveCategorySettings(settings);
	}
}

export async function deleteCategory(id: string): Promise<void> {
	const settings = await getCategorySettings();
	settings.categories = settings.categories.filter((cat) => cat.id !== id);
	await saveCategorySettings(settings);
}
