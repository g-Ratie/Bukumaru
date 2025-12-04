import { describe, expect, test } from "vitest";

import type { CustomTag } from "@/types/customTag";
import type { Novel } from "@/types/novel";
import { applyCustomTagsToNovels } from "../customTagMatcher";

const baseNovel: Novel = {
	id: "1",
	title: "Test Novel",
	genre: "0",
	xRestrict: 0,
	restrict: 0,
	url: "",
	tags: [],
	userId: "user-1",
	userName: "Author",
	profileImageUrl: "",
	textCount: 1000,
	wordCount: 500,
	readingTime: 200,
	useWordCount: false,
	description: "",
	isBookmarkable: true,
	bookmarkCount: 0,
	isOriginal: true,
	marker: null,
	titleCaptionTranslation: { workTitle: null, workCaption: null },
	createDate: "2024-01-01T00:00:00+09:00",
	updateDate: "2024-01-01T00:00:00+09:00",
	isMasked: false,
	aiType: 0,
	isUnlisted: false,
};

const customTags: CustomTag[] = [
	{ id: "c1", name: "複合タグ", color: "blue", tags: ["東方", "霊夢"] },
	{ id: "c2", name: "もう一つ", color: "red", tags: ["ウマ娘"] },
];

describe("applyCustomTagsToNovels", () => {
	test("すべての構成タグを持つ小説にカスタムタグを付与する", () => {
		const novels: Novel[] = [
			{ ...baseNovel, id: "1", tags: ["東方", "霊夢", "魔理沙"] },
		];

		const actual = applyCustomTagsToNovels(novels, customTags);

		expect(actual[0].tags).toContain("複合タグ");
	});

	test("構成タグが揃わない小説には付与しない", () => {
		const novels: Novel[] = [{ ...baseNovel, id: "2", tags: ["霊夢"] }];

		const actual = applyCustomTagsToNovels(novels, customTags);

		expect(actual[0].tags).not.toContain("複合タグ");
	});

	test("大文字小文字を無視して判定し、重複を避ける", () => {
		const novels: Novel[] = [
			{ ...baseNovel, id: "3", tags: ["ウマ娘", "UMAMUSUME"] },
		];

		const actual = applyCustomTagsToNovels(novels, customTags);

		expect(actual[0].tags.filter((tag) => tag === "もう一つ")).toHaveLength(1);
		expect(
			actual[0].tags.filter((tag) => tag.toLowerCase() === "umamusume"),
		).toHaveLength(1);
	});

	test("カスタムタグが存在しない場合は元の配列を返す", () => {
		const novels: Novel[] = [{ ...baseNovel, id: "4", tags: ["東方"] }];

		const actual = applyCustomTagsToNovels(novels, []);

		expect(actual).toBe(novels);
	});
});
