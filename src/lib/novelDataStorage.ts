"use client";

import type { Novel } from "@/types/novel";
import { parseNovelData } from "./novelDataParser";
import { generateDemoNovels } from "./demoData";

const STORAGE_KEY = "novel-data-source";
const FIRST_VISIT_KEY = "novel-search-first-visit";

export interface NovelDataStorage {
	novels: Novel[];
	sourceType: "url" | "file" | "demo";
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
		// CORSエラー対策とストリーミング処理
		let response: Response;
		try {
			response = await fetch(url, {
				mode: "cors",
				credentials: "omit",
				headers: {
					Accept: "application/json",
				},
			});
		} catch {
			// CORS エラーの場合、プロキシ経由で取得を試みる
			const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
			response = await fetch(proxyUrl);
		}

		if (!response.ok) {
			throw new Error(`HTTPエラー: ${response.status}`);
		}

		// Content-Lengthをチェック
		const contentLength = response.headers.get("content-length");
		const sizeInMB = contentLength
			? parseInt(contentLength) / (1024 * 1024)
			: 0;

		if (sizeInMB > 10) {
			throw new Error(
				`ファイルサイズが大きすぎます (${sizeInMB.toFixed(2)}MB)。10MB以下のファイルを使用してください。`,
			);
		}

		// レスポンスをテキストとして取得してからパース（大容量対応）
		const text = await response.text();

		// JSONパースを試みる
		let jsonData: unknown;
		try {
			jsonData = JSON.parse(text);
		} catch (parseError) {
			// パースエラーの詳細を提供
			if (parseError instanceof SyntaxError) {
				const errorMsg = parseError.message;
				// エラーメッセージから位置情報を抽出
				const lineMatch = errorMsg.match(/line (\d+)/);
				const columnMatch = errorMsg.match(/column (\d+)/);
				if (lineMatch && columnMatch) {
					const line = parseInt(lineMatch[1]);
					const column = parseInt(columnMatch[1]);
					const lines = text.split("\n");
					if (lines[line - 1]) {
						const problemLine = lines[line - 1];
						const start = Math.max(0, column - 20);
						const end = Math.min(problemLine.length, column + 20);
						const excerpt = problemLine.substring(start, end);
						throw new Error(
							`JSONパースエラー (${line}行目, ${column}文字目): ${errorMsg}\n` +
								`問題の箇所: ...${excerpt}...`,
						);
					}
				}
			}
			throw new Error(
				`JSONパースエラー: ${parseError instanceof Error ? parseError.message : "不明なエラー"}`,
			);
		}

		const novels = parseNovelData(jsonData);

		// LocalStorage容量チェック
		const storageData: NovelDataStorage = {
			novels,
			sourceType: "url",
			sourceUrl: url,
			updatedAt: new Date().toISOString(),
		};

		// 保存前にサイズを推定
		const dataStr = JSON.stringify(storageData);
		const dataSizeInMB = new Blob([dataStr]).size / (1024 * 1024);

		if (dataSizeInMB > 5) {
			throw new Error(
				`データサイズが大きすぎます (${dataSizeInMB.toFixed(2)}MB)。LocalStorageの制限を超える可能性があります。`,
			);
		}

		saveNovelData(storageData);
	} catch (error) {
		// エラーメッセージをより詳細に
		if (
			error instanceof TypeError &&
			error.message.includes("Failed to fetch")
		) {
			throw new Error("ネットワークエラー: URLにアクセスできません。");
		}
		throw new Error(
			`URLからのデータ取得に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
		);
	}
}

export async function saveNovelDataFromFile(file: File): Promise<void> {
	try {
		// ファイルサイズをチェック
		const sizeInMB = file.size / (1024 * 1024);
		if (sizeInMB > 10) {
			throw new Error(
				`ファイルサイズが大きすぎます (${sizeInMB.toFixed(2)}MB)。10MB以下のファイルを使用してください。`,
			);
		}

		const text = await file.text();

		// JSONパースを試みる
		let jsonData: unknown;
		try {
			jsonData = JSON.parse(text);
		} catch (parseError) {
			// パースエラーの詳細を提供
			if (parseError instanceof SyntaxError) {
				const errorMsg = parseError.message;
				const lineMatch = errorMsg.match(/line (\d+)/);
				const columnMatch = errorMsg.match(/column (\d+)/);
				if (lineMatch && columnMatch) {
					const line = parseInt(lineMatch[1]);
					const column = parseInt(columnMatch[1]);
					const lines = text.split("\n");
					if (lines[line - 1]) {
						const problemLine = lines[line - 1];
						const start = Math.max(0, column - 20);
						const end = Math.min(problemLine.length, column + 20);
						const excerpt = problemLine.substring(start, end);
						throw new Error(
							`JSONパースエラー (${line}行目, ${column}文字目): ${errorMsg}\n` +
								`問題の箇所: ...${excerpt}...`,
						);
					}
				}
			}
			throw new Error(
				`JSONパースエラー: ${parseError instanceof Error ? parseError.message : "不明なエラー"}`,
			);
		}

		const novels = parseNovelData(jsonData);

		const storageData: NovelDataStorage = {
			novels,
			sourceType: "file",
			fileName: file.name,
			updatedAt: new Date().toISOString(),
		};

		// 保存前にサイズを推定
		const dataStr = JSON.stringify(storageData);
		const dataSizeInMB = new Blob([dataStr]).size / (1024 * 1024);

		if (dataSizeInMB > 5) {
			throw new Error(
				`データサイズが大きすぎます (${dataSizeInMB.toFixed(2)}MB)。LocalStorageの制限を超える可能性があります。`,
			);
		}

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

export function isFirstVisit(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
	return !hasVisited;
}

export function markAsVisited(): void {
	if (typeof window === "undefined") {
		return;
	}

	localStorage.setItem(FIRST_VISIT_KEY, "true");
}

export function saveDemoData(): void {
	const demoNovels = generateDemoNovels();
	const storageData: NovelDataStorage = {
		novels: demoNovels,
		sourceType: "demo",
		updatedAt: new Date().toISOString(),
	};

	saveNovelData(storageData);
	markAsVisited();
}
