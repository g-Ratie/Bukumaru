import type { Novel } from "@/types/novel";
import type { NovelDataStorage } from "./novelDataStorage";

const DEMO_NOVELS: Novel[] = [
	{
		id: "demo-001",
		title: "春霞の散歩道",
		genre: "青春",
		xRestrict: 0,
		restrict: 0,
		url: "https://www.pixiv.net/novel/show.php?id=demo-001",
		tags: ["青春", "短編", "桜"],
		userId: "user-demo-001",
		userName: "青井 春",
		profileImageUrl:
			"https://i.pximg.net/user-profile/img/2024/01/01/00/00/00/12345678_abcdef1234567890.png",
		textCount: 3200,
		wordCount: 2800,
		readingTime: 15,
		useWordCount: true,
		description:
			"春の訪れを感じながら、幼なじみとの距離が少しずつ縮まっていく様子を描いた心温まる短編です。",
		isBookmarkable: true,
		bookmarkData: {
			id: "bookmark-demo-001",
			private: false,
		},
		bookmarkCount: 124,
		isOriginal: true,
		marker: null,
		titleCaptionTranslation: {
			workTitle: "Spring Haze Promenade",
			workCaption:
				"A warm short story about childhood friends walking under cherry blossoms.",
		},
		createDate: "2024-03-20T09:00:00+09:00",
		updateDate: "2024-04-02T12:30:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
	},
	{
		id: "demo-002",
		title: "星灯りの推理録",
		genre: "ミステリー",
		xRestrict: 0,
		restrict: 0,
		url: "https://www.pixiv.net/novel/show.php?id=demo-002",
		tags: ["ミステリー", "連載", "探偵"],
		userId: "user-demo-002",
		userName: "霧島 星",
		profileImageUrl:
			"https://i.pximg.net/user-profile/img/2024/02/14/12/34/56/23456789_bcdefa2345678901.png",
		textCount: 18400,
		wordCount: 16000,
		readingTime: 70,
		useWordCount: true,
		description:
			"灯台の町で起こった不可解な事件を、冷静沈着な高校生探偵が解き明かしていく連作ミステリー。",
		isBookmarkable: true,
		bookmarkData: {
			id: "bookmark-demo-002",
			private: false,
		},
		bookmarkCount: 312,
		isOriginal: true,
		marker: null,
		titleCaptionTranslation: {
			workTitle: "Star-lit Case Files",
			workCaption:
				"A serial mystery solved by a brilliant high school detective in a lighthouse town.",
		},
		createDate: "2023-11-12T21:15:00+09:00",
		updateDate: "2024-05-18T08:45:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
		seriesId: "series-demo-01",
		seriesTitle: "星灯りシリーズ",
	},
	{
		id: "demo-003",
		title: "深夜カフェと雨音のレシピ",
		genre: "恋愛",
		xRestrict: 0,
		restrict: 0,
		url: "https://www.pixiv.net/novel/show.php?id=demo-003",
		tags: ["恋愛", "社会人", "雨"],
		userId: "user-demo-003",
		userName: "藤原 湊",
		profileImageUrl:
			"https://i.pximg.net/user-profile/img/2024/04/10/08/00/00/34567890_cdefab3456789012.png",
		textCount: 9200,
		wordCount: 8400,
		readingTime: 40,
		useWordCount: true,
		description:
			"雨の夜にだけ開くカフェで、パティシエと会社員が互いの傷を癒やしながら新しい夢を見つけていく物語。",
		isBookmarkable: true,
		bookmarkData: {
			id: "bookmark-demo-003",
			private: false,
		},
		bookmarkCount: 208,
		isOriginal: true,
		marker: null,
		titleCaptionTranslation: {
			workTitle: "Midnight Café Recipes",
			workCaption:
				"A slow-burn romance blooming in a café that opens only on rainy nights.",
		},
		createDate: "2024-06-05T19:00:00+09:00",
		updateDate: "2024-06-20T10:10:00+09:00",
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
	},
];

export function createDemoNovelData(): NovelDataStorage {
	return {
		novels: DEMO_NOVELS.map((novel) => ({
			...novel,
			tags: [...novel.tags],
			bookmarkData: novel.bookmarkData ? { ...novel.bookmarkData } : undefined,
			titleCaptionTranslation: {
				...novel.titleCaptionTranslation,
			},
		})),
		sourceType: "demo",
		updatedAt: new Date().toISOString(),
	};
}
