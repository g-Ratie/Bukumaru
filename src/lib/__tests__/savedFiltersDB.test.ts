import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { SavedFilterData } from "@/types/savedFilter";
import {
	deleteSavedFilter,
	getAllSavedFilters,
	saveFilter,
} from "../../utils/filter/savedFiltersDB";

beforeEach(async () => {
	const request = indexedDB.deleteDatabase("PixivNovelFilters");
	await new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(undefined);
		request.onerror = () => reject(request.error);
	});
});

afterEach(async () => {
	const request = indexedDB.deleteDatabase("PixivNovelFilters");
	await new Promise((resolve) => {
		request.onsuccess = () => resolve(undefined);
	});
});

describe("saveFilter", () => {
	test("should save filter with generated id", async () => {
		const filterData: SavedFilterData = {
			authorName: "作者A",
			tags: ["タグ1", "タグ2"],
			excludeTags: [],
			selectedTag: "",
			minTextCount: null,
			maxTextCount: null,
			sortBy: "createDate",
			sortOrder: "desc",
		};

		const actual = await saveFilter("テストフィルタ", filterData);

		expect(actual.id).toBeDefined();
		expect(actual.name).toBe("テストフィルタ");
		expect(actual.filterData).toEqual(filterData);
		expect(actual.createdAt).toBeGreaterThan(0);
	});

	test("should generate unique ids for multiple filters", async () => {
		const filterData: SavedFilterData = {
			authorName: "作者",
			tags: [],
			excludeTags: [],
			selectedTag: "",
			minTextCount: null,
			maxTextCount: null,
			sortBy: "createDate",
			sortOrder: "desc",
		};

		const filter1 = await saveFilter("フィルタ1", filterData);
		const filter2 = await saveFilter("フィルタ2", filterData);

		expect(filter1.id).not.toBe(filter2.id);
	});
});

describe("getAllSavedFilters", () => {
	test("should return empty array when no filters are saved", async () => {
		const actual = await getAllSavedFilters();

		expect(actual).toEqual([]);
	});

	test("should return all saved filters sorted by createdAt descending", async () => {
		const filterData: SavedFilterData = {
			authorName: "",
			tags: [],
			excludeTags: [],
			selectedTag: "",
			minTextCount: null,
			maxTextCount: null,
			sortBy: "createDate",
			sortOrder: "desc",
		};

		const filter1 = await saveFilter("フィルタ1", filterData);
		await new Promise((resolve) => setTimeout(resolve, 10));
		const filter2 = await saveFilter("フィルタ2", filterData);

		const actual = await getAllSavedFilters();

		expect(actual).toHaveLength(2);
		expect(actual[0].id).toBe(filter2.id);
		expect(actual[1].id).toBe(filter1.id);
	});
});

describe("deleteSavedFilter", () => {
	test("should delete filter by id", async () => {
		const filterData: SavedFilterData = {
			authorName: "作者",
			tags: [],
			excludeTags: [],
			selectedTag: "",
			minTextCount: null,
			maxTextCount: null,
			sortBy: "createDate",
			sortOrder: "desc",
		};

		const filter = await saveFilter("削除テスト", filterData);

		await deleteSavedFilter(filter.id);

		const actual = await getAllSavedFilters();
		expect(actual).toHaveLength(0);
	});

	test("should not affect other filters when deleting one", async () => {
		const filterData: SavedFilterData = {
			authorName: "",
			tags: [],
			excludeTags: [],
			selectedTag: "",
			minTextCount: null,
			maxTextCount: null,
			sortBy: "createDate",
			sortOrder: "desc",
		};

		const filter1 = await saveFilter("フィルタ1", filterData);
		const filter2 = await saveFilter("フィルタ2", filterData);

		await deleteSavedFilter(filter1.id);

		const actual = await getAllSavedFilters();
		expect(actual).toHaveLength(1);
		expect(actual[0].id).toBe(filter2.id);
	});
});
