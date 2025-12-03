"use client";

import type { CategorySettings, TagCategory } from "@/types/category";
import { db, getAllCategories, replaceCategories } from "../../lib/indexedDb";

const LEGACY_CATEGORY_STORAGE_KEY = "novel-search-categories";

function readLegacyCategories(): TagCategory[] | null {
	const legacyData = localStorage.getItem(LEGACY_CATEGORY_STORAGE_KEY);
	if (!legacyData) return null;

	try {
		const parsed = JSON.parse(legacyData) as
			| TagCategory[]
			| { categories?: TagCategory[] };

		const categories = Array.isArray(parsed)
			? parsed
			: Array.isArray(parsed.categories)
				? parsed.categories
				: null;

		if (!categories || categories.length === 0) return null;

		const isValidCategory = (category: TagCategory) =>
			typeof category.id === "string" &&
			typeof category.name === "string" &&
			typeof category.color === "string" &&
			Array.isArray(category.tags) &&
			category.tags.every((tag) => typeof tag === "string");

		return categories.every(isValidCategory) ? categories : null;
	} catch (error) {
		console.warn("旧カテゴリ設定のパースに失敗しました:", error);
		return null;
	}
}

async function migrateLegacyCategories(): Promise<TagCategory[] | null> {
	const legacyCategories = readLegacyCategories();
	if (!legacyCategories) return null;

	try {
		await db.open();
		await replaceCategories(legacyCategories);
		localStorage.removeItem(LEGACY_CATEGORY_STORAGE_KEY);
	} catch (error) {
		console.warn("旧カテゴリ設定のIndexedDB移行に失敗しました:", error);
	}

	return legacyCategories;
}

export async function getCategorySettings(): Promise<CategorySettings> {
	if (typeof window === "undefined") {
		return { categories: [] };
	}

	try {
		await db.open();
		const categories = await getAllCategories();
		if (categories.length > 0) {
			return { categories };
		}
	} catch (error) {
		console.warn("カテゴリ設定の読み込みに失敗しました:", error);
	}

	const migratedCategories = await migrateLegacyCategories();
	if (migratedCategories) {
		return { categories: migratedCategories };
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
		localStorage.removeItem(LEGACY_CATEGORY_STORAGE_KEY);
		await db.open();
		await replaceCategories(settings.categories);
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
	await db.open();
	const newCategory: TagCategory = {
		...category,
		id: crypto.randomUUID(),
	};

	await db.categories.put(newCategory);
	return newCategory;
}

export async function updateCategory(
	id: string,
	updates: Partial<Omit<TagCategory, "id">>,
): Promise<void> {
	await db.open();
	const existing = await db.categories.get(id);
	if (!existing) return;

	await db.categories.put({
		...existing,
		...updates,
	});
}

export async function deleteCategory(id: string): Promise<void> {
	await db.open();
	await db.categories.delete(id);
}
