import { beforeEach, describe, expect, test, vi } from "vitest";
import type { NovelDataStorage } from "../../utils/novelData/novelDataStorage";
import {
	clearStoredNovelData,
	formatUpdateTime,
	getStoredNovelData,
	saveNovelData,
} from "../../utils/novelData/novelDataStorage";
import * as indexedDb from "../indexedDb";
import { createMinimalNovelData } from "./testData";

const STORAGE_KEY = "novel-data-source";
const { db } = indexedDb;

beforeEach(async () => {
	vi.restoreAllMocks();
	localStorage.clear();
	await db.delete();
	await db.open();
});

describe("getStoredNovelData", () => {
	test("should return null when no data is stored", async () => {
		const actual = await getStoredNovelData();

		expect(actual).toBe(null);
	});

	test("should return stored novel data when data exists", async () => {
		const mockNovel = createMinimalNovelData({
			id: "1",
			title: "テスト小説",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
		});

		const storedData: NovelDataStorage = {
			novels: [mockNovel],
			sourceType: "file",
			fileName: "test.json",
			updatedAt: "2024-01-01T00:00:00+09:00",
		};

		await saveNovelData(storedData);

		const actual = await getStoredNovelData();

		expect(actual).not.toBe(null);
		expect(actual?.novels).toHaveLength(1);
		expect(actual?.sourceType).toBe("file");
		expect(actual?.fileName).toBe("test.json");
	});

	test("should return null when stored data is invalid JSON", async () => {
		localStorage.setItem(STORAGE_KEY, "invalid json");

		const actual = await getStoredNovelData();

		expect(actual).toBe(null);
	});
});

describe("saveNovelData", () => {
	test("should save novel data to IndexedDB", async () => {
		const mockNovel = createMinimalNovelData({
			id: "1",
			title: "テスト小説",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
		});

		const data: NovelDataStorage = {
			novels: [mockNovel],
			sourceType: "file",
			fileName: "test.json",
			updatedAt: "2024-01-01T00:00:00+09:00",
		};

		await saveNovelData(data);

		const stored = await db.keyValues.get(STORAGE_KEY);
		expect(stored?.value).toEqual(data);
	});

	test("should throw error when IndexedDB save fails", async () => {
		const mockNovel = createMinimalNovelData({
			id: "1",
			title: "テスト小説",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
		});

		const data: NovelDataStorage = {
			novels: [mockNovel],
			sourceType: "file",
			fileName: "test.json",
			updatedAt: "2024-01-01T00:00:00+09:00",
		};

		vi.spyOn(db, "open").mockResolvedValue(db);
		vi.spyOn(indexedDb, "setValue").mockRejectedValue(
			new Error("QuotaExceededError"),
		);

		await expect(saveNovelData(data)).rejects.toThrow(
			"データの保存に失敗しました。容量が不足している可能性があります。",
		);
	});
});

describe("clearStoredNovelData", () => {
	test("should remove novel data from IndexedDB", async () => {
		const mockNovel = createMinimalNovelData({
			id: "1",
			title: "テスト小説",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
		});

		const data: NovelDataStorage = {
			novels: [mockNovel],
			sourceType: "file",
			fileName: "test.json",
			updatedAt: "2024-01-01T00:00:00+09:00",
		};

		await saveNovelData(data);

		await clearStoredNovelData();

		const stored = await db.keyValues.get(STORAGE_KEY);
		expect(stored).toBeUndefined();
	});
});

describe("formatUpdateTime", () => {
	test("should return 'たった今' for less than 1 minute ago", () => {
		const now = new Date();
		const updatedAt = new Date(now.getTime() - 30 * 1000).toISOString();

		const actual = formatUpdateTime(updatedAt);

		expect(actual).toBe("たった今");
	});

	test("should return minutes for less than 1 hour ago", () => {
		const now = new Date();
		const updatedAt = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

		const actual = formatUpdateTime(updatedAt);

		expect(actual).toBe("30分前");
	});

	test("should return hours for less than 24 hours ago", () => {
		const now = new Date();
		const updatedAt = new Date(
			now.getTime() - 5 * 60 * 60 * 1000,
		).toISOString();

		const actual = formatUpdateTime(updatedAt);

		expect(actual).toBe("5時間前");
	});

	test("should return days for less than 7 days ago", () => {
		const now = new Date();
		const updatedAt = new Date(
			now.getTime() - 3 * 24 * 60 * 60 * 1000,
		).toISOString();

		const actual = formatUpdateTime(updatedAt);

		expect(actual).toBe("3日前");
	});

	test("should return formatted date for 7 days or more ago", () => {
		const now = new Date();
		const updatedAt = new Date(
			now.getTime() - 10 * 24 * 60 * 60 * 1000,
		).toISOString();

		const actual = formatUpdateTime(updatedAt);

		expect(actual).toMatch(/\d{4}\/\d{2}\/\d{2}/);
	});
});
