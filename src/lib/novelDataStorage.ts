"use client";

import type { Novel } from "@/types/novel";
import { parseNovelData } from "./novelDataParser";

const STORAGE_KEY = "novel-data-source";

export interface NovelDataStorage {
	novels: Novel[];
	sourceType: "url" | "file" | "default";
	sourceUrl?: string;
	fileName?: string;
	updatedAt: string;
}

export function getStoredNovelData(): NovelDataStorage | null {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			return {
				...data,
				novels: parseNovelData(data.novels),
			};
		}
	} catch (error) {
		console.warn("保存された小説データの読み込みに失敗しました:", error);
	}

	return null;
}

export function saveNovelData(data: NovelDataStorage): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.warn("小説データの保存に失敗しました:", error);
		throw new Error(
			"データの保存に失敗しました。容量が不足している可能性があります。",
		);
	}
}

export function clearStoredNovelData(): void {
	if (typeof window === "undefined") {
		return;
	}

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.warn("保存された小説データのクリアに失敗しました:", error);
	}
}

export async function saveNovelDataFromUrl(url: string): Promise<void> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTPエラー: ${response.status}`);
		}

		const jsonData = await response.json();
		const novels = parseNovelData(jsonData);

		const storageData: NovelDataStorage = {
			novels,
			sourceType: "url",
			sourceUrl: url,
			updatedAt: new Date().toISOString(),
		};

		saveNovelData(storageData);
	} catch (error) {
		throw new Error(
			`URLからのデータ取得に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
		);
	}
}

export async function saveNovelDataFromFile(file: File): Promise<void> {
	try {
		const text = await file.text();
		const jsonData = JSON.parse(text);
		const novels = parseNovelData(jsonData);

		const storageData: NovelDataStorage = {
			novels,
			sourceType: "file",
			fileName: file.name,
			updatedAt: new Date().toISOString(),
		};

		saveNovelData(storageData);
	} catch (error) {
		throw new Error(
			`ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
		);
	}
}

export function formatUpdateTime(updatedAt: string): string {
	const date = new Date(updatedAt);
	const now = new Date();
	const diff = now.getTime() - date.getTime();

	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 1) return "たった今";
	if (minutes < 60) return `${minutes}分前`;
	if (hours < 24) return `${hours}時間前`;
	if (days < 7) return `${days}日前`;

	return date.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}
