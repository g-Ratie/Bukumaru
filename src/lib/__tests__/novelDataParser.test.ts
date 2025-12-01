import { describe, expect, test, vi } from "vitest";
import type { Novel } from "@/types/novel";
import {
	loadNovelData,
	parseNovelData,
	parseNovelItem,
} from "../../utils/novelData/novelDataParser";
import { createMinimalNovelData } from "./testData";

describe("parseNovelItem", () => {
	const validNovelData = {
		id: "23307032",
		title: "テスト小説",
		genre: "0",
		xRestrict: 0,
		restrict: 0,
		url: "https://example.com/novel.jpg",
		tags: ["タグ1", "タグ2"],
		userId: "550422",
		userName: "テスト作者",
		profileImageUrl: "https://example.com/profile.png",
		textCount: 6997,
		wordCount: 3341,
		readingTime: 839,
		useWordCount: false,
		description: "テスト説明",
		isBookmarkable: true,
		bookmarkData: {
			id: "2903080741",
			private: false,
		},
		bookmarkCount: 188,
		isOriginal: false,
		marker: null,
		titleCaptionTranslation: {
			workTitle: null,
			workCaption: null,
		},
		createDate: "2024-10-31T00:00:04+09:00",
		updateDate: "2024-10-31T00:00:04+09:00",
		isMasked: false,
		aiType: 1,
		isUnlisted: false,
		seriesId: "12345",
		seriesTitle: "テストシリーズ",
	};

	test("should parse valid novel data correctly", () => {
		const actual = parseNovelItem(validNovelData);

		const expected: Novel = {
			id: "23307032",
			title: "テスト小説",
			genre: "0",
			xRestrict: 0,
			restrict: 0,
			url: "https://example.com/novel.jpg",
			tags: ["タグ1", "タグ2"],
			userId: "550422",
			userName: "テスト作者",
			profileImageUrl: "https://example.com/profile.png",
			textCount: 6997,
			wordCount: 3341,
			readingTime: 839,
			useWordCount: false,
			description: "テスト説明",
			isBookmarkable: true,
			bookmarkData: {
				id: "2903080741",
				private: false,
			},
			bookmarkCount: 188,
			isOriginal: false,
			marker: null,
			titleCaptionTranslation: {
				workTitle: null,
				workCaption: null,
			},
			createDate: "2024-10-31T00:00:04+09:00",
			updateDate: "2024-10-31T00:00:04+09:00",
			isMasked: false,
			aiType: 1,
			isUnlisted: false,
			seriesId: "12345",
			seriesTitle: "テストシリーズ",
		};

		expect(actual).toEqual(expected);
	});

	test("should handle missing optional fields with default values", () => {
		const minimalData = createMinimalNovelData({
			id: "123",
			title: "最小小説",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
			// オプションフィールドを削除
			url: undefined,
			profileImageUrl: undefined,
			description: undefined,
			bookmarkData: undefined,
			wordCount: undefined,
		});

		const actual = parseNovelItem(minimalData);

		expect(actual.id).toBe("123");
		expect(actual.title).toBe("最小小説");
		expect(actual.userName).toBe("作者");
		expect(actual.tags).toEqual(["タグ"]);
		expect(actual.textCount).toBe(1000);
		expect(actual.createDate).toBe("2024-01-01T00:00:00+09:00");
		expect(actual.genre).toBe("0");
		expect(actual.xRestrict).toBe(0);
		expect(actual.wordCount).toBe(0);
		expect(actual.description).toBe("");
		expect(actual.bookmarkData).toBeUndefined();
		expect(actual.seriesId).toBeUndefined();
		expect(actual.seriesTitle).toBeUndefined();
	});

	test("should throw error for missing required fields", () => {
		const invalidData = {
			id: "123",
			title: "タイトル",
			// userName, tags, textCount, createDate missing
		};

		expect(() => parseNovelItem(invalidData)).toThrow(
			"Missing required field: userName",
		);
	});

	test("should throw error for non-object input", () => {
		expect(() => parseNovelItem(null)).toThrow("Novel item must be an object");
		expect(() => parseNovelItem("string")).toThrow(
			"Novel item must be an object",
		);
		expect(() => parseNovelItem(123)).toThrow("Novel item must be an object");
	});

	test("should throw error for invalid field types", () => {
		const invalidTypeData = {
			id: 123, // should be string
			title: "タイトル",
			userName: "作者",
			tags: ["タグ"],
			textCount: 1000,
			createDate: "2024-01-01T00:00:00+09:00",
		};

		expect(() => parseNovelItem(invalidTypeData)).toThrow(
			"id must be a string",
		);
	});

	test("should throw error for invalid tags array", () => {
		const invalidTagsData = createMinimalNovelData({
			tags: [123, "タグ"], // should be all strings
		});

		expect(() => parseNovelItem(invalidTagsData)).toThrow(
			"tags[0] must be a string",
		);
	});

	test("should handle null marker correctly", () => {
		const dataWithNullMarker = {
			...validNovelData,
			marker: null,
		};

		const actual = parseNovelItem(dataWithNullMarker);
		expect(actual.marker).toBe(null);
	});

	test("should handle bookmarkData as null", () => {
		const dataWithNullBookmark = {
			...validNovelData,
			bookmarkData: null,
		};

		const actual = parseNovelItem(dataWithNullBookmark);
		expect(actual.bookmarkData).toBeUndefined();
	});

	test("should handle series data correctly", () => {
		const dataWithSeries = {
			...validNovelData,
			seriesId: "14139531",
			seriesTitle: "最後に勝つのは",
		};

		const actual = parseNovelItem(dataWithSeries);
		expect(actual.seriesId).toBe("14139531");
		expect(actual.seriesTitle).toBe("最後に勝つのは");
	});

	test("should handle missing series data as undefined", () => {
		const dataWithoutSeries = {
			...validNovelData,
			seriesId: undefined,
			seriesTitle: undefined,
		};

		const actual = parseNovelItem(dataWithoutSeries);
		expect(actual.seriesId).toBeUndefined();
		expect(actual.seriesTitle).toBeUndefined();
	});

	test("should handle empty string series data as undefined", () => {
		const dataWithEmptySeries = {
			...validNovelData,
			seriesId: "",
			seriesTitle: "",
		};

		const actual = parseNovelItem(dataWithEmptySeries);
		expect(actual.seriesId).toBeUndefined();
		expect(actual.seriesTitle).toBeUndefined();
	});
});

describe("parseNovelData", () => {
	test("should parse array of valid novels", () => {
		const novelsData = [
			createMinimalNovelData({
				id: "1",
				title: "小説1",
				userName: "作者1",
				tags: ["タグ1"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			}),
			createMinimalNovelData({
				id: "2",
				title: "小説2",
				userName: "作者2",
				tags: ["タグ2"],
				textCount: 2000,
				createDate: "2024-01-02T00:00:00+09:00",
			}),
		];

		const actual = parseNovelData(novelsData);

		expect(actual).toHaveLength(2);
		expect(actual[0].id).toBe("1");
		expect(actual[0].title).toBe("小説1");
		expect(actual[1].id).toBe("2");
		expect(actual[1].title).toBe("小説2");
	});

	test("should throw error for non-array input", () => {
		expect(() => parseNovelData({})).toThrow("Expected an array of novels");
		expect(() => parseNovelData(null)).toThrow("Expected an array of novels");
		expect(() => parseNovelData("string")).toThrow(
			"Expected an array of novels",
		);
	});

	test("should skip invalid items and return valid novels only", () => {
		const invalidData = [
			createMinimalNovelData({
				id: "1",
				title: "小説1",
				userName: "作者1",
				tags: ["タグ1"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			}),
			{
				id: "2",
				title: "小説2",
				// missing required fields
			},
		];

		const actual = parseNovelData(invalidData);

		// 無効なデータをスキップして有効なデータのみを返す
		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("1");
		expect(actual[0].title).toBe("小説1");
	});

	test("should handle empty array", () => {
		const actual = parseNovelData([]);
		expect(actual).toEqual([]);
	});

	test("should skip malformed data with numeric genre and null bookmarkCount", () => {
		const malformedData = [
			createMinimalNovelData({
				id: "1",
				title: "正常なデータ",
				userName: "作者1",
				tags: ["タグ1"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			}),
			{
				id: "2",
				title: "異常なデータ",
				genre: 1, // number instead of string
				userName: "作者2",
				tags: ["タグ2"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
				bookmarkCount: null, // null instead of number
			},
		];

		const actual = parseNovelData(malformedData);

		// 正常なデータ1件と、型変換できる異常なデータ1件の計2件が処理される
		expect(actual).toHaveLength(2);
		expect(actual[0].id).toBe("1");
		expect(actual[0].title).toBe("正常なデータ");
		expect(actual[1].id).toBe("2");
		expect(actual[1].title).toBe("異常なデータ");
		expect(actual[1].genre).toBe("1"); // number -> string に変換
		expect(actual[1].bookmarkCount).toBe(0); // null -> 0 に変換
	});

	test("should skip obviously invalid data patterns", () => {
		const invalidData = [
			createMinimalNovelData({
				id: "1",
				title: "正常なデータ",
				userName: "作者1",
				tags: ["タグ1"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			}),
			{
				id: "2",
				title: "-----", // 明らかに不正なタイトル
				userName: "作者2",
				tags: ["タグ2"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			},
			{
				id: "3",
				title: "正常なタイトル",
				userName: "-----", // 明らかに不正なユーザー名
				tags: ["タグ3"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			},
			{
				id: "4",
				title: "正常なタイトル",
				userName: "作者4",
				tags: ["タグ4"],
				textCount: 0, // 文字数0は不正
				createDate: "2024-01-01T00:00:00+09:00",
			},
		];

		const actual = parseNovelData(invalidData);

		// 正常なデータのみが処理される
		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("1");
		expect(actual[0].title).toBe("正常なデータ");
	});
});

describe("loadNovelData", () => {
	test("should return success result for valid data", async () => {
		// Mock fetch to return valid data
		const mockData = [
			createMinimalNovelData({
				id: "1",
				title: "小説1",
				userName: "作者1",
				tags: ["タグ1"],
				textCount: 1000,
				createDate: "2024-01-01T00:00:00+09:00",
			}),
		];

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockData),
		});

		const actual = await loadNovelData("/test.json");

		expect(actual.success).toBe(true);
		expect(actual.data).toHaveLength(1);
		expect(actual.data?.[0].id).toBe("1");
		expect(actual.error).toBeUndefined();
	});

	test("should return error result for HTTP error", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
		});

		const actual = await loadNovelData("/test.json");

		expect(actual.success).toBe(false);
		expect(actual.data).toBeUndefined();
		expect(actual.error).toBe("HTTP error! status: 404");
	});

	test("should return error result for fetch failure", async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

		const actual = await loadNovelData("/test.json");

		expect(actual.success).toBe(false);
		expect(actual.data).toBeUndefined();
		expect(actual.error).toBe("Network error");
	});

	test("should return error result for invalid JSON data", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve("invalid data"),
		});

		const actual = await loadNovelData("/test.json");

		expect(actual.success).toBe(false);
		expect(actual.data).toBeUndefined();
		expect(actual.error).toBe("Expected an array of novels");
	});
});
