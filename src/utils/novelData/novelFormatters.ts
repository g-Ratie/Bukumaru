export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("ja-JP");
}

export function formatDateWithTime(dateString: string): string {
	return new Date(dateString).toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatReadingTime(seconds: number): string {
	const minutes = Math.ceil(seconds / 60);
	return `${minutes}分`;
}
