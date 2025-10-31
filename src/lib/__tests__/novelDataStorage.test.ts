import { beforeEach, describe, expect, test, vi } from "vitest";
import type { NovelDataStorage } from "../novelDataStorage";
import {
	clearStoredNovelData,
	formatUpdateTime,
	getStoredNovelData,
	saveNovelData,
} from "../novelDataStorage";
import { createMinimalNovelData } from "./testData";

const mockLocalStorage = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

beforeEach(() => {
	vi.restoreAllMocks();
	Object.defineProperty(global, "localStorage", {
		value: mockLocalStorage,
		writable: true,
	});
	mockLocalStorage.clear();
});

describe("getStoredNovelData", () => {
	test("should return null when no data is stored", () => {
		const actual = getStoredNovelData();

		expect(actual).toBe(null);
	});

	test("should return stored novel data when data exists", () => {
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

		mockLocalStorage.setItem("novel-data-source", JSON.stringify(storedData));

		const actual = getStoredNovelData();

		expect(actual).not.toBe(null);
		expect(actual?.novels).toHaveLength(1);
		expect(actual?.sourceType).toBe("file");
		expect(actual?.fileName).toBe("test.json");
	});

	test("should return null when stored data is invalid JSON", () => {
		mockLocalStorage.setItem("novel-data-source", "invalid json");

		const actual = getStoredNovelData();

		expect(actual).toBe(null);
	});
});

describe("saveNovelData", () => {
	test("should save novel data to localStorage", () => {
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

		saveNovelData(data);

		const stored = mockLocalStorage.getItem("novel-data-source");
		expect(stored).not.toBe(null);

		const actual = JSON.parse(stored || "{}") as NovelDataStorage;
		expect(actual.novels).toHaveLength(1);
		expect(actual.sourceType).toBe("file");
	});

	test("should throw error when localStorage save fails", () => {
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

		vi.spyOn(mockLocalStorage, "setItem").mockImplementation(() => {
			throw new Error("QuotaExceededError");
		});

		expect(() => saveNovelData(data)).toThrow(
			"データの保存に失敗しました。容量が不足している可能性があります。",
		);
	});
});

describe("clearStoredNovelData", () => {
	test("should remove novel data from localStorage", () => {
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

		mockLocalStorage.setItem("novel-data-source", JSON.stringify(data));

		clearStoredNovelData();

		const actual = mockLocalStorage.getItem("novel-data-source");
		expect(actual).toBe(null);
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
