"use client";

import type { CategorySettings, TagCategory } from "@/types/category";
import { db, getAllCategories, replaceCategories } from "../../lib/indexedDb";

export async function getCategorySettings(): Promise<CategorySettings> {
	if (typeof window === "undefined") {
		return { categories: [] };
	}

	try {
		await db.open();
		const categories = await getAllCategories();
		return { categories };
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
