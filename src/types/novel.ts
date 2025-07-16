export interface Novel {
	id: string;
	title: string;
	genre: string;
	xRestrict: number;
	restrict: number;
	url: string;
	tags: string[];
	userId: string;
	userName: string;
	profileImageUrl: string;
	textCount: number;
	wordCount: number;
	readingTime: number;
	useWordCount: boolean;
	description: string;
	isBookmarkable: boolean;
	bookmarkData?: {
		id: string;
		private: boolean;
	};
	bookmarkCount: number;
	isOriginal: boolean;
	marker: string | null;
	titleCaptionTranslation: {
		workTitle: string | null;
		workCaption: string | null;
	};
	createDate: string;
	updateDate: string;
	isMasked: boolean;
	aiType: number;
	isUnlisted: boolean;
}
