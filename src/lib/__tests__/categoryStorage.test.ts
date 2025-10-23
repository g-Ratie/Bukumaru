import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CategorySettings, TagCategory } from "@/types/category";
import {
	addCategory,
	deleteCategory,
	getCategoryForTag,
	getCategorySettings,
	saveCategorySettings,
	updateCategory,
} from "../categoryStorage";

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
	Object.defineProperty(global, "localStorage", {
		value: mockLocalStorage,
		writable: true,
	});
	mockLocalStorage.clear();
	vi.clearAllMocks();
});

describe("getCategorySettings", () => {
	test("should return empty categories when no data is stored", () => {
		const actual = getCategorySettings();

		const expected: CategorySettings = { categories: [] };
		expect(actual).toEqual(expected);
	});

	test("should return stored categories when data exists", () => {
		const storedSettings: CategorySettings = {
			categories: [
				{
					id: "1",
					name: "テストカテゴリ",
					color: "blue",
					tags: ["タグ1", "タグ2"],
				},
			],
		};
		mockLocalStorage.setItem(
			"novel-search-categories",
			JSON.stringify(storedSettings),
		);

		const actual = getCategorySettings();

		expect(actual).toEqual(storedSettings);
	});

	test("should return empty categories when stored data is invalid JSON", () => {
		mockLocalStorage.setItem("novel-search-categories", "invalid json");

		const actual = getCategorySettings();

		const expected: CategorySettings = { categories: [] };
		expect(actual).toEqual(expected);
	});
});

describe("saveCategorySettings", () => {
	test("should save category settings to localStorage", () => {
		const settings: CategorySettings = {
			categories: [
				{
					id: "1",
					name: "テストカテゴリ",
					color: "blue",
					tags: ["タグ1"],
				},
			],
		};

		saveCategorySettings(settings);

		const actual = mockLocalStorage.getItem("novel-search-categories");
		const expected = JSON.stringify(settings);
		expect(actual).toBe(expected);
	});
});

describe("getCategoryForTag", () => {
	const testCategories: CategorySettings = {
		categories: [
			{
				id: "1",
				name: "カテゴリA",
				color: "blue",
				tags: ["タグA", "タグB"],
			},
			{
				id: "2",
				name: "カテゴリB",
				color: "red",
				tags: ["タグC", "タグD"],
			},
		],
	};

	beforeEach(() => {
		mockLocalStorage.setItem(
			"novel-search-categories",
			JSON.stringify(testCategories),
		);
	});

	test("should return category when tag matches exactly", () => {
		const actual = getCategoryForTag("タグA");

		expect(actual?.id).toBe("1");
		expect(actual?.name).toBe("カテゴリA");
	});

	test("should return category when tag matches case-insensitively", () => {
		const actual = getCategoryForTag("タグa");

		expect(actual?.id).toBe("1");
		expect(actual?.name).toBe("カテゴリA");
	});

	test("should return null when tag does not match", () => {
		const actual = getCategoryForTag("存在しないタグ");

		expect(actual).toBe(null);
	});

	test("should return first matching category when tag exists in multiple categories", () => {
		const duplicateCategories: CategorySettings = {
			categories: [
				{
					id: "1",
					name: "カテゴリA",
					color: "blue",
					tags: ["共通タグ"],
				},
				{
					id: "2",
					name: "カテゴリB",
					color: "red",
					tags: ["共通タグ"],
				},
			],
		};
		mockLocalStorage.setItem(
			"novel-search-categories",
			JSON.stringify(duplicateCategories),
		);

		const actual = getCategoryForTag("共通タグ");

		expect(actual?.id).toBe("1");
	});
});

describe("addCategory", () => {
	test("should add new category with generated id", () => {
		const mockId = "test-uuid-1";
		vi.spyOn(crypto, "randomUUID").mockReturnValue(mockId);

		const newCategory = {
			name: "新規カテゴリ",
			color: "green",
			tags: ["新規タグ"],
		};

		const actual = addCategory(newCategory);

		expect(actual.id).toBe(mockId);
		expect(actual.name).toBe("新規カテゴリ");
		expect(actual.color).toBe("green");
		expect(actual.tags).toEqual(["新規タグ"]);
	});

	test("should persist added category to localStorage", () => {
		const mockId = "test-uuid-1";
		vi.spyOn(crypto, "randomUUID").mockReturnValue(mockId);

		const newCategory = {
			name: "新規カテゴリ",
			color: "blue",
			tags: ["タグ"],
		};

		addCategory(newCategory);

		const stored = mockLocalStorage.getItem("novel-search-categories");
		const actual = JSON.parse(stored || "{}") as CategorySettings;
		expect(actual.categories).toHaveLength(1);
		expect(actual.categories[0].id).toBe(mockId);
	});
});

describe("updateCategory", () => {
	const existingCategory: TagCategory = {
		id: "1",
		name: "既存カテゴリ",
		color: "blue",
		tags: ["タグ1"],
	};

	beforeEach(() => {
		const settings: CategorySettings = {
			categories: [existingCategory],
		};
		mockLocalStorage.setItem(
			"novel-search-categories",
			JSON.stringify(settings),
		);
	});

	test("should update existing category", () => {
		updateCategory("1", { name: "更新されたカテゴリ" });

		const stored = mockLocalStorage.getItem("novel-search-categories");
		const actual = JSON.parse(stored || "{}") as CategorySettings;
		expect(actual.categories[0].name).toBe("更新されたカテゴリ");
		expect(actual.categories[0].color).toBe("blue");
	});

	test("should not update when category id does not exist", () => {
		const beforeUpdate = getCategorySettings();

		updateCategory("non-existent-id", { name: "更新" });

		const actual = getCategorySettings();
		expect(actual).toEqual(beforeUpdate);
	});
});

describe("deleteCategory", () => {
	const categories: TagCategory[] = [
		{
			id: "1",
			name: "カテゴリ1",
			color: "blue",
			tags: ["タグ1"],
		},
		{
			id: "2",
			name: "カテゴリ2",
			color: "red",
			tags: ["タグ2"],
		},
	];

	beforeEach(() => {
		const settings: CategorySettings = { categories };
		mockLocalStorage.setItem(
			"novel-search-categories",
			JSON.stringify(settings),
		);
	});

	test("should delete category by id", () => {
		deleteCategory("1");

		const stored = mockLocalStorage.getItem("novel-search-categories");
		const actual = JSON.parse(stored || "{}") as CategorySettings;
		expect(actual.categories).toHaveLength(1);
		expect(actual.categories[0].id).toBe("2");
	});

	test("should not affect other categories when deleting non-existent id", () => {
		deleteCategory("non-existent-id");

		const stored = mockLocalStorage.getItem("novel-search-categories");
		const actual = JSON.parse(stored || "{}") as CategorySettings;
		expect(actual.categories).toHaveLength(2);
	});
});
