export interface TagCategory {
	id: string;
	name: string;
	color: string;
	tags: string[];
}

export interface CategorySettings {
	categories: TagCategory[];
}

export interface CategoryColor {
	name: string;
	value: string;
	bgClass: string;
	textClass: string;
}

export const CATEGORY_COLORS: CategoryColor[] = [
	{
		name: "青",
		value: "blue",
		bgClass: "bg-blue-100 dark:bg-blue-900",
		textClass: "text-blue-800 dark:text-blue-200",
	},
	{
		name: "緑",
		value: "green",
		bgClass: "bg-green-100 dark:bg-green-900",
		textClass: "text-green-800 dark:text-green-200",
	},
	{
		name: "紫",
		value: "purple",
		bgClass: "bg-purple-100 dark:bg-purple-900",
		textClass: "text-purple-800 dark:text-purple-200",
	},
	{
		name: "赤",
		value: "red",
		bgClass: "bg-red-100 dark:bg-red-900",
		textClass: "text-red-800 dark:text-red-200",
	},
	{
		name: "黄",
		value: "yellow",
		bgClass: "bg-yellow-100 dark:bg-yellow-900",
		textClass: "text-yellow-800 dark:text-yellow-200",
	},
	{
		name: "ピンク",
		value: "pink",
		bgClass: "bg-pink-100 dark:bg-pink-900",
		textClass: "text-pink-800 dark:text-pink-200",
	},
	{
		name: "オレンジ",
		value: "orange",
		bgClass: "bg-orange-100 dark:bg-orange-900",
		textClass: "text-orange-800 dark:text-orange-200",
	},
	{
		name: "青緑",
		value: "teal",
		bgClass: "bg-teal-100 dark:bg-teal-900",
		textClass: "text-teal-800 dark:text-teal-200",
	},
];
