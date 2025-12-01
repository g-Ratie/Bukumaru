import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CategorySettings, TagCategory } from "@/types/category";
import {
	addCategory,
	deleteCategory,
	getCategoryForTag,
	getCategorySettings,
	saveCategorySettings,
	updateCategory,
} from "../../utils/category/categoryStorage";
import { db } from "../indexedDb";

beforeEach(async () => {
	vi.restoreAllMocks();
	localStorage.clear();
	await db.delete();
	await db.open();
});

describe("getCategorySettings", () => {
	test("should return empty categories when no data is stored", async () => {
		const actual = await getCategorySettings();

		const expected: CategorySettings = { categories: [] };
		expect(actual).toEqual(expected);
	});

	test("should return stored categories when data exists", async () => {
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
		await saveCategorySettings(storedSettings);

		const actual = await getCategorySettings();

		expect(actual).toEqual(storedSettings);
	});
});

describe("saveCategorySettings", () => {
	test("should save category settings to IndexedDB", async () => {
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

		await saveCategorySettings(settings);

		const stored = await db.categories.toArray();
		expect(stored).toEqual(settings.categories);
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

	beforeEach(async () => {
		await saveCategorySettings(testCategories);
	});

	test("should return category when tag matches exactly", async () => {
		const actual = await getCategoryForTag("タグA");

		expect(actual?.id).toBe("1");
		expect(actual?.name).toBe("カテゴリA");
	});

	test("should return category when tag matches case-insensitively", async () => {
		const actual = await getCategoryForTag("タグa");

		expect(actual?.id).toBe("1");
		expect(actual?.name).toBe("カテゴリA");
	});

	test("should return null when tag does not match", async () => {
		const actual = await getCategoryForTag("存在しないタグ");

		expect(actual).toBe(null);
	});

	test("should return first matching category when tag exists in multiple categories", async () => {
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
		await saveCategorySettings(duplicateCategories);

		const actual = await getCategoryForTag("共通タグ");

		expect(actual?.id).toBe("1");
	});
});

describe("addCategory", () => {
	test("should add new category with generated id", async () => {
		const mockId = "test-uuid-1";
		vi.spyOn(crypto, "randomUUID").mockReturnValue(mockId);

		const newCategory = {
			name: "新規カテゴリ",
			color: "green",
			tags: ["新規タグ"],
		};

		const actual = await addCategory(newCategory);

		expect(actual.id).toBe(mockId);
		expect(actual.name).toBe("新規カテゴリ");
		expect(actual.color).toBe("green");
		expect(actual.tags).toEqual(["新規タグ"]);
	});

	test("should persist added category to IndexedDB", async () => {
		const mockId = "test-uuid-1";
		vi.spyOn(crypto, "randomUUID").mockReturnValue(mockId);

		const newCategory = {
			name: "新規カテゴリ",
			color: "blue",
			tags: ["タグ"],
		};

		await addCategory(newCategory);

		const stored = await getCategorySettings();
		expect(stored.categories).toHaveLength(1);
		expect(stored.categories[0].id).toBe(mockId);
	});
});

describe("updateCategory", () => {
	const existingCategory: TagCategory = {
		id: "1",
		name: "既存カテゴリ",
		color: "blue",
		tags: ["タグ1"],
	};

	beforeEach(async () => {
		const settings: CategorySettings = {
			categories: [existingCategory],
		};
		await saveCategorySettings(settings);
	});

	test("should update existing category", async () => {
		await updateCategory("1", { name: "更新されたカテゴリ" });

		const stored = await getCategorySettings();
		expect(stored.categories[0].name).toBe("更新されたカテゴリ");
		expect(stored.categories[0].color).toBe("blue");
	});

	test("should not update when category id does not exist", async () => {
		const beforeUpdate = await getCategorySettings();

		await updateCategory("non-existent-id", { name: "更新" });

		const actual = await getCategorySettings();
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

	beforeEach(async () => {
		const settings: CategorySettings = { categories };
		await saveCategorySettings(settings);
	});

	test("should delete category by id", async () => {
		await deleteCategory("1");

		const stored = await getCategorySettings();
		expect(stored.categories).toHaveLength(1);
		expect(stored.categories[0].id).toBe("2");
	});

	test("should not affect other categories when deleting non-existent id", async () => {
		await deleteCategory("non-existent-id");

		const stored = await getCategorySettings();
		expect(stored.categories).toHaveLength(2);
	});
});
