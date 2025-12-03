"use client";

import Dexie, { type Table } from "dexie";

import type { TagCategory } from "@/types/category";
import type { Novel } from "@/types/novel";

interface NovelDataMeta {
	id: string;
	sourceType: "url" | "file" | "default" | "demo";
	sourceUrl?: string;
	fileName?: string;
	updatedAt: string;
}

class AppDatabase extends Dexie {
	categories!: Table<TagCategory, string>;
	novels!: Table<Novel, string>;
	novelDataMeta!: Table<NovelDataMeta, string>;

	constructor() {
		super("bukumaru");
		this.version(1).stores({
			categories: "id",
			novels: "id",
			novelDataMeta: "&id",
		});
	}
}

export const db = new AppDatabase();

export async function getAllCategories(): Promise<TagCategory[]> {
	return db.categories.toArray();
}

export async function replaceCategories(
	categories: TagCategory[],
): Promise<void> {
	await db.transaction("rw", db.categories, async () => {
		await db.categories.clear();
		if (categories.length > 0) {
			await db.categories.bulkPut(categories);
		}
	});
}

export async function getAllNovels(): Promise<Novel[]> {
	return db.novels.toArray();
}

export async function replaceNovels(novels: Novel[]): Promise<void> {
	await db.transaction("rw", db.novels, async () => {
		await db.novels.clear();
		if (novels.length > 0) {
			await db.novels.bulkPut(novels);
		}
	});
}

export async function getNovelDataMeta(): Promise<NovelDataMeta | undefined> {
	return db.novelDataMeta.get("current");
}

export async function setNovelDataMeta(meta: NovelDataMeta): Promise<void> {
	await db.novelDataMeta.put(meta);
}

export async function clearNovelDataMeta(): Promise<void> {
	await db.novelDataMeta.delete("current");
}
