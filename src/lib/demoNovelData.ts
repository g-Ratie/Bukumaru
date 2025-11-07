import type { Novel } from "@/types/novel";
import type { NovelDataStorage } from "./novelDataStorage";

const GENRES: Array<{
	readonly ja: string;
	readonly en: string;
}> = [
	{ ja: "青春", en: "youth" },
	{ ja: "恋愛", en: "romance" },
	{ ja: "ミステリー", en: "mystery" },
	{ ja: "ファンタジー", en: "fantasy" },
	{ ja: "SF", en: "science fiction" },
	{ ja: "歴史", en: "historical" },
	{ ja: "現代ドラマ", en: "contemporary drama" },
	{ ja: "ホラー", en: "horror" },
	{ ja: "コメディ", en: "comedy" },
	{ ja: "冒険", en: "adventure" },
];

const TITLE_PREFIXES = [
	{ ja: "蒼き", en: "Azure" },
	{ ja: "星屑の", en: "Stardust" },
	{ ja: "静寂な", en: "Silent" },
	{ ja: "風舞う", en: "Windborne" },
	{ ja: "暁の", en: "Dawn" },
	{ ja: "月影の", en: "Moonlit" },
	{ ja: "水鏡の", en: "Watermirror" },
	{ ja: "薄明の", en: "Daybreak" },
	{ ja: "紡がれた", en: "Woven" },
	{ ja: "儚い", en: "Ephemeral" },
];

const TITLE_MIDDLES = [
	{ ja: "季節", en: "Seasons" },
	{ ja: "回廊", en: "Corridor" },
	{ ja: "調べ", en: "Melody" },
	{ ja: "祈り", en: "Prayer" },
	{ ja: "記憶", en: "Memories" },
	{ ja: "灯り", en: "Lights" },
	{ ja: "鼓動", en: "Heartbeat" },
	{ ja: "旋律", en: "Harmony" },
	{ ja: "願い", en: "Wishes" },
	{ ja: "物語", en: "Tales" },
];

const TITLE_SUFFIXES = [
	{ ja: "標", en: "Beacon" },
	{ ja: "手紙", en: "Letters" },
	{ ja: "航路", en: "Voyage" },
	{ ja: "レシピ", en: "Recipes" },
	{ ja: "地図", en: "Map" },
	{ ja: "方舟", en: "Ark" },
	{ ja: "風景", en: "Landscape" },
	{ ja: "瞬き", en: "Glimmer" },
	{ ja: "ささやき", en: "Whispers" },
	{ ja: "序曲", en: "Overture" },
];

const THEME_TAGS = [
	{ ja: "旅", en: "journeys" },
	{ ja: "再会", en: "reunions" },
	{ ja: "友情", en: "friendship" },
	{ ja: "家族", en: "family" },
	{ ja: "未来", en: "futures" },
	{ ja: "幻想", en: "fantasies" },
	{ ja: "挑戦", en: "challenges" },
	{ ja: "秘密", en: "secrets" },
	{ ja: "日常", en: "everyday moments" },
	{ ja: "冒険", en: "adventures" },
];

const FAMILY_NAMES = [
	"青井",
	"霧島",
	"藤原",
	"真白",
	"橘",
	"桐生",
	"篠原",
	"深雪",
	"神楽",
	"結城",
];
const GIVEN_NAMES = [
	"遥",
	"紗季",
	"湊",
	"陸",
	"澪",
	"奏",
	"渚",
	"春斗",
	"灯",
	"詩音",
];

const JST_OFFSET_MINUTES = 9 * 60;

const BASE_CREATED_AT = new Date(Date.UTC(2023, 0, 1, 0, 0, 0));
const BASE_UPDATED_AT = new Date(Date.UTC(2024, 0, 1, 3, 0, 0));

const PROFILE_BASE_URL = "https://i.pximg.net/user-profile/img/2024";

const LONG_TITLE_DEMO =
        "これでもかというほど長い長いタイトルで改行挙動を徹底的に検証するためのデモンストレーション小説タイトル";
const LONG_SERIES_TITLE_DEMO =
        "とてつもなく長いシリーズ名がどのように表示領域を圧迫するのかを徹底的に観察するためのデモシリーズ名その一";

function padNumber(value: number, length: number): string {
	return value.toString().padStart(length, "0");
}

function formatDateWithOffset(date: Date, offsetMinutes: number): string {
	const shifted = new Date(date.getTime() + offsetMinutes * 60 * 1000);
	const iso = shifted.toISOString().replace("Z", "");
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const absMinutes = Math.abs(offsetMinutes);
	const hours = padNumber(Math.floor(absMinutes / 60), 2);
	const minutes = padNumber(absMinutes % 60, 2);
	return `${iso.slice(0, 19)}${sign}${hours}:${minutes}`;
}

function createProfileImageUrl(index: number): string {
	const month = padNumber((index % 12) + 1, 2);
	const day = padNumber(((index * 3) % 28) + 1, 2);
	const hour = padNumber((index * 7) % 24, 2);
	const minute = padNumber((index * 11) % 60, 2);
	const second = padNumber((index * 13) % 60, 2);
	return `${PROFILE_BASE_URL}/${month}/${day}/${hour}/${minute}/${second}/demo_${padNumber(index + 1, 3)}.png`;
}

function createTitle(index: number): { ja: string; en: string } {
	const prefix = TITLE_PREFIXES[index % TITLE_PREFIXES.length];
	const middle = TITLE_MIDDLES[index % TITLE_MIDDLES.length];
	const suffix = TITLE_SUFFIXES[index % TITLE_SUFFIXES.length];
	const japanese = `${prefix.ja}${middle.ja}の${suffix.ja}`;
	const english = `${prefix.en} ${middle.en} ${suffix.en}`.trim();
	return { ja: japanese, en: english };
}

function createDescription(
	index: number,
	titleJa: string,
	themeJa: string,
): string {
	return `${titleJa}を舞台に、${themeJa}をめぐる出会いと成長を描いたデモ用ストーリー第${index + 1}話。`;
}

function createTranslation(
	genreEn: string,
	titleEn: string,
	themeEn: string,
	index: number,
): { workTitle: string; workCaption: string } {
	return {
		workTitle: titleEn,
		workCaption: `Demo collection story #${index + 1}: a ${genreEn} tale about ${themeEn}.`,
	};
}

function createDates(index: number): {
	createDate: string;
	updateDate: string;
} {
	const createOffsetDays = index * 2;
	const updateOffsetDays = createOffsetDays + 30;
	const createOffsetMinutes = (index * 17) % (24 * 60);
	const updateOffsetMinutes = (index * 23) % (24 * 60);
	const createDate = new Date(
		BASE_CREATED_AT.getTime() +
			createOffsetDays * 24 * 60 * 60 * 1000 +
			createOffsetMinutes * 60 * 1000,
	);
	const updateDate = new Date(
		BASE_UPDATED_AT.getTime() +
			updateOffsetDays * 24 * 60 * 60 * 1000 +
			updateOffsetMinutes * 60 * 1000,
	);
	return {
		createDate: formatDateWithOffset(createDate, JST_OFFSET_MINUTES),
		updateDate: formatDateWithOffset(updateDate, JST_OFFSET_MINUTES),
	};
}

function createCounts(index: number): {
	textCount: number;
	wordCount: number;
	readingTime: number;
	bookmarkCount: number;
} {
	const baseText = 2200 + (index % 15) * 600 + Math.floor(index / 15) * 400;
	const textCount = baseText;
	const wordCount = Math.round(textCount * 0.86);
	const readingTime = Math.max(4, Math.round(wordCount / 400));
	const bookmarkCount = 80 + ((index * 37) % 420);
	return { textCount, wordCount, readingTime, bookmarkCount };
}

function createSeries(index: number): {
	seriesId?: string;
	seriesTitle?: string;
} {
	if (index % 5 !== 0) {
		return {};
	}
	const seriesNumber = Math.floor(index / 5) + 1;
	return {
		seriesId: `series-demo-${padNumber(seriesNumber, 2)}`,
		seriesTitle: `デモシリーズ${padNumber(seriesNumber, 2)}`,
	};
}

function createDemoNovel(index: number): Novel {
	const id = `demo-${padNumber(index + 1, 3)}`;
	const genre = GENRES[index % GENRES.length];
	const title = createTitle(index);
	const theme = THEME_TAGS[index % THEME_TAGS.length];
	const userId = `user-demo-${padNumber(index + 1, 3)}`;
	const userName = `${FAMILY_NAMES[index % FAMILY_NAMES.length]} ${GIVEN_NAMES[(index * 3) % GIVEN_NAMES.length]}`;
	const profileImageUrl = createProfileImageUrl(index);
	const { textCount, wordCount, readingTime, bookmarkCount } =
		createCounts(index);
	const { createDate, updateDate } = createDates(index);
	const description = createDescription(index, title.ja, theme.ja);
	const translation = createTranslation(genre.en, title.en, theme.en, index);
	return {
		id,
		title: title.ja,
		genre: genre.ja,
		xRestrict: 0,
		restrict: 0,
		url: `https://www.pixiv.net/novel/show.php?id=${id}`,
		tags: [
			...new Set([genre.ja, theme.ja, `デモ${padNumber((index % 10) + 1, 2)}`]),
		],
		userId,
		userName,
		profileImageUrl,
		textCount,
		wordCount,
		readingTime,
		useWordCount: true,
		description,
		isBookmarkable: true,
		bookmarkData: {
			id: `bookmark-${id}`,
			private: false,
		},
		bookmarkCount,
		isOriginal: true,
		marker: null,
		titleCaptionTranslation: translation,
		createDate,
		updateDate,
		isMasked: false,
		aiType: 0,
		isUnlisted: false,
		...createSeries(index),
	};
}

const DEMO_NOVELS: Novel[] = Array.from({ length: 100 }, (_, index) =>
        createDemoNovel(index),
);

DEMO_NOVELS[0] = {
        ...DEMO_NOVELS[0],
        title: LONG_TITLE_DEMO,
        seriesTitle: LONG_SERIES_TITLE_DEMO,
        seriesId: DEMO_NOVELS[0].seriesId ?? "series-demo-01",
};

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
