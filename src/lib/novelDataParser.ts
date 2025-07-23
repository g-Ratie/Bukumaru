import type { Novel } from "@/types/novel";

export interface NovelParseResult {
	success: boolean;
	data?: Novel[];
	error?: string;
}

export async function loadNovelData(url: string): Promise<NovelParseResult> {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			return {
				success: false,
				error: `HTTP error! status: ${response.status}`,
			};
		}

		const jsonData = await response.json();
		const parsedData = parseNovelData(jsonData);

		return {
			success: true,
			data: parsedData,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}

export function parseNovelData(jsonData: unknown): Novel[] {
	if (!Array.isArray(jsonData)) {
		throw new Error("Expected an array of novels");
	}

	const validNovels: Novel[] = [];

	for (let index = 0; index < jsonData.length; index++) {
		const item = jsonData[index];
		try {
			// 明らかに不正なデータをスキップ
			if (isInvalidNovelData(item)) {
				console.warn(`Skipping invalid novel data at index ${index}:`, item);
				continue;
			}

			const novel = parseNovelItem(item);
			validNovels.push(novel);
		} catch (error) {
			console.warn(
				`Skipping invalid novel data at index ${index}:`,
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	}

	return validNovels;
}

function isInvalidNovelData(item: unknown): boolean {
	if (typeof item !== "object" || item === null) {
		return true;
	}

	const novel = item as Record<string, unknown>;

	// 明らかに不正なデータの特徴をチェック
	return (
		novel.title === "-----" ||
		novel.userName === "-----" ||
		novel.description === "-----" ||
		novel.isMasked === true ||
		novel.textCount === 0 ||
		!novel.id ||
		!novel.title ||
		!novel.userName
	);
}

export function parseNovelItem(item: unknown): Novel {
	if (typeof item !== "object" || item === null) {
		throw new Error("Novel item must be an object");
	}

	const novel = item as Record<string, unknown>;

	// 必須フィールドの検証
	const requiredFields = [
		"id",
		"title",
		"userName",
		"tags",
		"textCount",
		"createDate",
	];
	for (const field of requiredFields) {
		if (!(field in novel)) {
			throw new Error(`Missing required field: ${field}`);
		}
	}

	// 型の検証とパース
	return {
		id: validateString(novel.id, "id"),
		title: validateString(novel.title, "title"),
		genre: validateOptionalString(novel.genre, "genre") || "0",
		xRestrict: validateOptionalNumber(novel.xRestrict, "xRestrict") || 0,
		restrict: validateOptionalNumber(novel.restrict, "restrict") || 0,
		url: validateOptionalString(novel.url, "url"),
		tags: validateStringArray(novel.tags, "tags"),
		userId: validateOptionalString(novel.userId, "userId"),
		userName: validateString(novel.userName, "userName"),
		profileImageUrl: validateOptionalString(
			novel.profileImageUrl,
			"profileImageUrl",
		),
		textCount: validateNumber(novel.textCount, "textCount"),
		wordCount: validateOptionalNumber(novel.wordCount, "wordCount") || 0,
		readingTime: validateOptionalNumber(novel.readingTime, "readingTime") || 0,
		useWordCount:
			validateOptionalBoolean(novel.useWordCount, "useWordCount") || false,
		description: validateOptionalString(novel.description, "description"),
		isBookmarkable: validateOptionalBoolean(
			novel.isBookmarkable,
			"isBookmarkable",
		),
		bookmarkData: parseBookmarkData(novel.bookmarkData),
		bookmarkCount: validateOptionalNumber(novel.bookmarkCount, "bookmarkCount"),
		isOriginal: validateOptionalBoolean(novel.isOriginal, "isOriginal"),
		marker:
			novel.marker === null
				? null
				: validateOptionalString(novel.marker, "marker"),
		titleCaptionTranslation: parseTitleCaptionTranslation(
			novel.titleCaptionTranslation,
		),
		createDate: validateString(novel.createDate, "createDate"),
		updateDate: validateOptionalString(novel.updateDate, "updateDate"),
		isMasked: validateOptionalBoolean(novel.isMasked, "isMasked"),
		aiType: validateOptionalNumber(novel.aiType, "aiType"),
		isUnlisted: validateOptionalBoolean(novel.isUnlisted, "isUnlisted"),
		seriesId: validateOptionalStringOrUndefined(novel.seriesId, "seriesId"),
		seriesTitle: validateOptionalStringOrUndefined(
			novel.seriesTitle,
			"seriesTitle",
		),
	};
}

function validateString(value: unknown, fieldName: string): string {
	if (typeof value !== "string") {
		throw new Error(`${fieldName} must be a string`);
	}
	return value;
}

function validateOptionalString(value: unknown, fieldName: string): string {
	if (value === undefined || value === null) {
		return "";
	}
	if (typeof value === "string") {
		return value;
	}
	if (typeof value === "number") {
		return value.toString();
	}
	throw new Error(`${fieldName} must be a string or number`);
}

function validateOptionalStringOrUndefined(
	value: unknown,
	fieldName: string,
): string | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}
	if (typeof value === "string") {
		return value.length > 0 ? value : undefined;
	}
	if (typeof value === "number") {
		return value.toString();
	}
	throw new Error(`${fieldName} must be a string or number`);
}

function validateNumber(value: unknown, fieldName: string): number {
	if (typeof value !== "number") {
		throw new Error(`${fieldName} must be a number`);
	}
	return value;
}

function validateOptionalNumber(value: unknown, fieldName: string): number {
	if (value === undefined || value === null) {
		return 0;
	}
	if (typeof value === "number") {
		return value;
	}
	if (typeof value === "string") {
		const parsed = parseFloat(value);
		if (!Number.isNaN(parsed)) {
			return parsed;
		}
	}
	throw new Error(
		`${fieldName} must be a number or string representing a number`,
	);
}

function validateBoolean(value: unknown, fieldName: string): boolean {
	if (typeof value !== "boolean") {
		throw new Error(`${fieldName} must be a boolean`);
	}
	return value;
}

function validateOptionalBoolean(value: unknown, fieldName: string): boolean {
	if (value === undefined || value === null) {
		return false;
	}
	if (typeof value !== "boolean") {
		throw new Error(`${fieldName} must be a boolean`);
	}
	return value;
}

function validateStringArray(value: unknown, fieldName: string): string[] {
	if (!Array.isArray(value)) {
		throw new Error(`${fieldName} must be an array`);
	}

	return value.map((item, index) => {
		if (typeof item !== "string") {
			throw new Error(`${fieldName}[${index}] must be a string`);
		}
		return item;
	});
}

function parseBookmarkData(
	value: unknown,
): { id: string; private: boolean } | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}

	if (typeof value !== "object") {
		throw new Error("bookmarkData must be an object");
	}

	const bookmark = value as Record<string, unknown>;
	return {
		id: validateString(bookmark.id, "bookmarkData.id"),
		private: validateBoolean(bookmark.private, "bookmarkData.private"),
	};
}

function parseTitleCaptionTranslation(value: unknown): {
	workTitle: string | null;
	workCaption: string | null;
} {
	if (typeof value !== "object" || value === null) {
		return { workTitle: null, workCaption: null };
	}

	const translation = value as Record<string, unknown>;
	return {
		workTitle:
			translation.workTitle === null
				? null
				: validateString(
						translation.workTitle,
						"titleCaptionTranslation.workTitle",
					),
		workCaption:
			translation.workCaption === null
				? null
				: validateString(
						translation.workCaption,
						"titleCaptionTranslation.workCaption",
					),
	};
}
