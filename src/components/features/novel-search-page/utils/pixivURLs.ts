export function getPixivNovelURL(novelId: string): string {
	return `https://www.pixiv.net/novel/show.php?id=${novelId}`;
}

export function getPixivSeriesURL(seriesId: string): string {
	return `https://www.pixiv.net/novel/series/${seriesId}`;
}

export function getPixivUserURL(userId: string): string {
	return `https://www.pixiv.net/users/${userId}`;
}
