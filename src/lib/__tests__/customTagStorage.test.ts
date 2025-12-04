import { beforeEach, describe, expect, test, vi } from "vitest";

import type { CustomTag } from "@/types/customTag";
import {
	addCustomTag,
	deleteCustomTag,
	getCustomTags,
	saveCustomTags,
	updateCustomTag,
} from "@/utils/custom-tag/customTagStorage";

import { db } from "../indexedDb";

beforeEach(async () => {
	vi.restoreAllMocks();
	localStorage.clear();
	await db.delete();
	await db.open();
});

describe("getCustomTags", () => {
	test("should return empty array when no custom tags are stored", async () => {
		const actual = await getCustomTags();

		expect(actual).toEqual([]);
	});

	test("should return stored custom tags", async () => {
		const customTag: CustomTag = {
			id: "custom-1",
			name: "複合タグ",
			color: "blue",
			tags: ["タグA", "タグB"],
		};

		await saveCustomTags([customTag]);

		const actual = await getCustomTags();

		expect(actual).toEqual([customTag]);
	});
});

describe("addCustomTag", () => {
	test("should create a custom tag with generated id", async () => {
		vi.spyOn(crypto, "randomUUID").mockReturnValue("generated-id-1");

		const created = await addCustomTag({
			name: "組み合わせA",
			color: "green",
			tags: ["タグ1", "タグ2"],
		});

		expect(created.id).toBe("generated-id-1");
		expect(created.tags).toEqual(["タグ1", "タグ2"]);

		const stored = await getCustomTags();
		expect(stored).toEqual([created]);
	});

	test("should normalize tags by trimming and deduplicating", async () => {
		const created = await addCustomTag({
			name: "正規化テスト",
			color: "red",
			tags: [" タグA", "タグA", "タグB ", "たぐa"],
		});

		expect(created.tags).toEqual(["タグA", "タグB", "たぐa"]);
	});
});

describe("updateCustomTag", () => {
	test("should update custom tag fields and return updated value", async () => {
		const base = await addCustomTag({
			name: "元のタグ",
			color: "blue",
			tags: ["A"],
		});

		const updated = await updateCustomTag(base.id, {
			name: "更新されたタグ",
			color: "purple",
			tags: [" A ", "B"],
		});

		expect(updated?.name).toBe("更新されたタグ");
		expect(updated?.color).toBe("purple");
		expect(updated?.tags).toEqual(["A", "B"]);

		const stored = await getCustomTags();
		expect(stored[0]).toEqual(updated);
	});

	test("should return null when updating non-existent custom tag", async () => {
		const result = await updateCustomTag("missing-id", { name: "更新" });

		expect(result).toBeNull();
	});
});

describe("deleteCustomTag", () => {
	test("should remove custom tag by id", async () => {
		const first = await addCustomTag({
			name: "削除対象",
			color: "orange",
			tags: ["削除"],
		});
		const second = await addCustomTag({
			name: "残すタグ",
			color: "pink",
			tags: ["残す"],
		});

		await deleteCustomTag(first.id);

		const stored = await getCustomTags();
		expect(stored).toEqual([second]);
	});
});
