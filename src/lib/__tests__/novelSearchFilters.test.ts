import { describe, expect, test } from "vitest";
import type { Novel } from "@/types/novel";
import type { SearchFilters } from "@/types/search";
import {
	filterByAuthor,
	filterBySelectedTag,
	filterByTags,
	filterByTextCount,
	filterNovels,
	getAuthorSuggestions,
	getTagSuggestions,
	sortNovels,
} from "../novelSearchFilters";

// テスト用の小説データ
const mockNovels: Novel[] = [
	{
		id: "1",
		title: "ウマ娘の小説",
		userName: "作者A",
		tags: ["ウマ娘", "トレーナー", "感動"],
		textCount: 5000,
		createDate: "2024-01-01T00:00:00+09:00",
		// 他の必須フィールドを省略形で定義
		genre: "0",
		xRestrict: 0,
		restrict: 0,
		url: "",
		userId: "1",
		profileImageUrl: "",
		wordCount: 2500,
		readingTime: 600,
		useWordCount: false,
		description: "",
		isBookmarkable: true,
		bookmarkCount: 100,
		isOriginal: false,
		marker: null,
		titleCaptionTranslation: { workTitle: null, workCaption: null },
		updateDate: "2024-01-01T00:00:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
	},
	{
		id: "2",
		title: "東方の小説",
		userName: "作者B",
		tags: ["東方", "霊夢", "魔理沙"],
		textCount: 15000,
		createDate: "2024-01-02T00:00:00+09:00",
		// 他の必須フィールドを省略形で定義
		genre: "0",
		xRestrict: 0,
		restrict: 0,
		url: "",
		userId: "2",
		profileImageUrl: "",
		wordCount: 7500,
		readingTime: 1800,
		useWordCount: false,
		description: "",
		isBookmarkable: true,
		bookmarkCount: 200,
		isOriginal: false,
		marker: null,
		titleCaptionTranslation: { workTitle: null, workCaption: null },
		updateDate: "2024-01-02T00:00:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
	},
	{
		id: "3",
		title: "オリジナル小説",
		userName: "作者A",
		tags: ["オリジナル", "ファンタジー"],
		textCount: 25000,
		createDate: "2024-01-03T00:00:00+09:00",
		// 他の必須フィールドを省略形で定義
		genre: "0",
		xRestrict: 0,
		restrict: 0,
		url: "",
		userId: "1",
		profileImageUrl: "",
		wordCount: 12500,
		readingTime: 3000,
		useWordCount: false,
		description: "",
		isBookmarkable: true,
		bookmarkCount: 50,
		isOriginal: true,
		marker: null,
		titleCaptionTranslation: { workTitle: null, workCaption: null },
		updateDate: "2024-01-03T00:00:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
	},
];

describe("filterByAuthor", () => {
	test("should return true when authorName is empty", () => {
		const actual = filterByAuthor(mockNovels[0], "");
		expect(actual).toBe(true);
	});

	test("should return true when author matches exactly", () => {
		const actual = filterByAuthor(mockNovels[0], "作者A");
		expect(actual).toBe(true);
	});

	test("should return true when author matches partially", () => {
		const actual = filterByAuthor(mockNovels[0], "作者");
		expect(actual).toBe(true);
	});

	test("should return true when author matches case-insensitively", () => {
		const actual = filterByAuthor(mockNovels[0], "作者a");
		expect(actual).toBe(true);
	});

	test("should return false when author does not match", () => {
		const actual = filterByAuthor(mockNovels[0], "作者B");
		expect(actual).toBe(false);
	});
});

describe("filterByTags", () => {
	test("should return true when tags array is empty", () => {
		const actual = filterByTags(mockNovels[0], []);
		expect(actual).toBe(true);
	});

	test("should return true when all tags match", () => {
		const actual = filterByTags(mockNovels[0], ["ウマ娘", "トレーナー"]);
		expect(actual).toBe(true);
	});

	test("should return true when tags match partially", () => {
		const actual = filterByTags(mockNovels[0], ["ウマ"]);
		expect(actual).toBe(true);
	});

	test("should return false when some tags do not match", () => {
		const actual = filterByTags(mockNovels[0], ["ウマ娘", "存在しないタグ"]);
		expect(actual).toBe(false);
	});

	test("should return false when no tags match", () => {
		const actual = filterByTags(mockNovels[0], ["東方"]);
		expect(actual).toBe(false);
	});
});

describe("filterBySelectedTag", () => {
	test("should return true when selectedTag is empty", () => {
		const actual = filterBySelectedTag(mockNovels[0], "");
		expect(actual).toBe(true);
	});

	test("should return true when tag matches exactly", () => {
		const actual = filterBySelectedTag(mockNovels[0], "ウマ娘");
		expect(actual).toBe(true);
	});

	test("should return true when tag matches partially", () => {
		const actual = filterBySelectedTag(mockNovels[0], "ウマ");
		expect(actual).toBe(true);
	});

	test("should return false when tag does not match", () => {
		const actual = filterBySelectedTag(mockNovels[0], "東方");
		expect(actual).toBe(false);
	});
});

describe("filterByTextCount", () => {
	test("should return true when text count is within range", () => {
		const actual = filterByTextCount(mockNovels[0], 1000, 10000);
		expect(actual).toBe(true);
	});

	test("should return true when text count equals minimum", () => {
		const actual = filterByTextCount(mockNovels[0], 5000, 10000);
		expect(actual).toBe(true);
	});

	test("should return true when text count equals maximum", () => {
		const actual = filterByTextCount(mockNovels[0], 1000, 5000);
		expect(actual).toBe(true);
	});

	test("should return false when text count is below minimum", () => {
		const actual = filterByTextCount(mockNovels[0], 10000, 20000);
		expect(actual).toBe(false);
	});

	test("should return false when text count is above maximum", () => {
		const actual = filterByTextCount(mockNovels[0], 1000, 4000);
		expect(actual).toBe(false);
	});
});

describe("sortNovels", () => {
	test("should sort by textCount in ascending order", () => {
		const actual = sortNovels(mockNovels, "textCount", "asc");

		expect(actual[0].textCount).toBe(5000);
		expect(actual[1].textCount).toBe(15000);
		expect(actual[2].textCount).toBe(25000);
	});

	test("should sort by textCount in descending order", () => {
		const actual = sortNovels(mockNovels, "textCount", "desc");

		expect(actual[0].textCount).toBe(25000);
		expect(actual[1].textCount).toBe(15000);
		expect(actual[2].textCount).toBe(5000);
	});

	test("should sort by userName in ascending order", () => {
		const actual = sortNovels(mockNovels, "userName", "asc");

		expect(actual[0].userName).toBe("作者A");
		expect(actual[1].userName).toBe("作者A");
		expect(actual[2].userName).toBe("作者B");
	});

	test("should sort by createDate in descending order", () => {
		const actual = sortNovels(mockNovels, "createDate", "desc");

		expect(actual[0].createDate).toBe("2024-01-03T00:00:00+09:00");
		expect(actual[1].createDate).toBe("2024-01-02T00:00:00+09:00");
		expect(actual[2].createDate).toBe("2024-01-01T00:00:00+09:00");
	});

	test("should not mutate original array", () => {
		const original = [...mockNovels];
		const actual = sortNovels(mockNovels, "textCount", "asc");

		expect(mockNovels).toEqual(original);
		expect(actual).not.toBe(mockNovels);
	});
});

describe("filterNovels", () => {
	const defaultFilters: SearchFilters = {
		authorName: "",
		tags: [],
		selectedTag: "",
		minTextCount: 0,
		maxTextCount: 50000,
		currentPage: 1,
		itemsPerPage: 24,
		sortBy: "createDate",
		sortOrder: "desc",
	};

	test("should return all novels with default filters", () => {
		const actual = filterNovels(mockNovels, defaultFilters);

		expect(actual).toHaveLength(3);
		// デフォルトソート (createDate desc) で並んでいることを確認
		expect(actual[0].id).toBe("3");
		expect(actual[1].id).toBe("2");
		expect(actual[2].id).toBe("1");
	});

	test("should filter by author name", () => {
		const filters = { ...defaultFilters, authorName: "作者A" };
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(2);
		expect(actual[0].userName).toBe("作者A");
		expect(actual[1].userName).toBe("作者A");
	});

	test("should filter by tags", () => {
		const filters = { ...defaultFilters, tags: ["ウマ娘"] };
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("1");
	});

	test("should filter by selected tag", () => {
		const filters = { ...defaultFilters, selectedTag: "東方" };
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("2");
	});

	test("should filter by text count range", () => {
		const filters = {
			...defaultFilters,
			minTextCount: 10000,
			maxTextCount: 20000,
		};
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("2");
	});

	test("should apply multiple filters", () => {
		const filters = {
			...defaultFilters,
			authorName: "作者A",
			minTextCount: 20000,
			maxTextCount: 30000,
		};
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe("3");
	});

	test("should return empty array when no novels match", () => {
		const filters = { ...defaultFilters, authorName: "存在しない作者" };
		const actual = filterNovels(mockNovels, filters);

		expect(actual).toHaveLength(0);
	});
});

describe("getTagSuggestions", () => {
	test("should return tag suggestions sorted by count", () => {
		const actual = getTagSuggestions(mockNovels);

		expect(actual).toHaveLength(8);
		expect(actual[0].tag).toBe("ウマ娘");
		expect(actual[0].count).toBe(1);
		expect(actual[1].tag).toBe("トレーナー");
		expect(actual[1].count).toBe(1);
	});

	test("should handle empty novels array", () => {
		const actual = getTagSuggestions([]);

		expect(actual).toEqual([]);
	});

	test("should count tags correctly", () => {
		const novelsWithDuplicateTags = [
			{
				...mockNovels[0],
				tags: ["共通タグ", "ユニークタグ1"],
			},
			{
				...mockNovels[1],
				tags: ["共通タグ", "ユニークタグ2"],
			},
		];

		const actual = getTagSuggestions(novelsWithDuplicateTags);

		const commonTag = actual.find((tag) => tag.tag === "共通タグ");
		expect(commonTag?.count).toBe(2);

		const uniqueTag1 = actual.find((tag) => tag.tag === "ユニークタグ1");
		expect(uniqueTag1?.count).toBe(1);
	});
});

describe("getAuthorSuggestions", () => {
	test("should return author suggestions sorted by count", () => {
		const actual = getAuthorSuggestions(mockNovels);

		expect(actual).toHaveLength(2);
		expect(actual[0].userName).toBe("作者A");
		expect(actual[0].count).toBe(2);
		expect(actual[1].userName).toBe("作者B");
		expect(actual[1].count).toBe(1);
	});

	test("should handle empty novels array", () => {
		const actual = getAuthorSuggestions([]);

		expect(actual).toEqual([]);
	});

	test("should count authors correctly", () => {
		const novelsWithSameAuthor = [
			{ ...mockNovels[0], userName: "同一作者" },
			{ ...mockNovels[1], userName: "同一作者" },
			{ ...mockNovels[2], userName: "異なる作者" },
		];

		const actual = getAuthorSuggestions(novelsWithSameAuthor);

		expect(actual).toHaveLength(2);
		expect(actual[0].userName).toBe("同一作者");
		expect(actual[0].count).toBe(2);
		expect(actual[1].userName).toBe("異なる作者");
		expect(actual[1].count).toBe(1);
	});
});
