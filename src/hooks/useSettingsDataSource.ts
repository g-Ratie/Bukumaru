"use client";

import { useCallback, useEffect, useState } from "react";
import type { Novel } from "@/types/novel";
import {
	clearStoredNovelData,
	getStoredNovelData,
	saveNovelDataFromFile,
	saveNovelDataFromUrl,
} from "@/utils/novelData/novelDataStorage";

export type DataSourceType = "url" | "file" | "default" | "demo";

export interface DataSourceInfo {
	type: DataSourceType;
	url?: string;
	fileName?: string;
	updatedAt?: string;
}

interface HandleFileUploadOptions {
	file: File | null;
}

export function useSettingsDataSource() {
	const [novels, setNovels] = useState<Novel[]>([]);
	const [dataSource, setDataSource] = useState<DataSourceInfo>({
		type: "default",
	});
	const [isUploadingData, setIsUploadingData] = useState(false);
	const [dataSourceUrl, setDataSourceUrl] = useState("");
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	const loadNovels = useCallback(async () => {
		setIsInitialLoading(true);
		const storedData = await getStoredNovelData();

		if (storedData) {
			setNovels(storedData.novels);
			setDataSource({
				type: storedData.sourceType,
				url: storedData.sourceUrl,
				fileName: storedData.fileName,
				updatedAt: storedData.updatedAt,
			});
		} else {
			setNovels([]);
			setDataSource({ type: "default" });
		}

		setIsInitialLoading(false);
	}, []);

	useEffect(() => {
		void loadNovels();
	}, [loadNovels]);

	const handleFileUpload = useCallback(
		async ({ file }: HandleFileUploadOptions) => {
			if (!file) return;

			if (!file.name.endsWith(".json")) {
				setUploadError("JSONファイルを選択してください");
				return;
			}

			setIsUploadingData(true);
			setUploadError(null);

			try {
				await saveNovelDataFromFile(file);
				await loadNovels();
			} catch (error) {
				setUploadError(
					error instanceof Error
						? error.message
						: "ファイルの読み込みに失敗しました",
				);
			} finally {
				setIsUploadingData(false);
			}
		},
		[loadNovels],
	);

	const handleUrlSubmit = useCallback(async () => {
		if (!dataSourceUrl.trim()) {
			setUploadError("URLを入力してください");
			return;
		}

		setIsUploadingData(true);
		setUploadError(null);

		try {
			await saveNovelDataFromUrl(dataSourceUrl);
			await loadNovels();
			setDataSourceUrl("");
		} catch (error) {
			setUploadError(
				error instanceof Error
					? error.message
					: "URLからのデータ取得に失敗しました",
			);
		} finally {
			setIsUploadingData(false);
		}
	}, [dataSourceUrl, loadNovels]);

	const handleRefreshData = useCallback(async () => {
		if (dataSource.type !== "url" || !dataSource.url) {
			return;
		}

		setIsUploadingData(true);
		setUploadError(null);

		try {
			await saveNovelDataFromUrl(dataSource.url);
			await loadNovels();
		} catch (error) {
			setUploadError(
				error instanceof Error ? error.message : "データの更新に失敗しました",
			);
		} finally {
			setIsUploadingData(false);
		}
	}, [dataSource, loadNovels]);

	const handleClearData = useCallback(async () => {
		await clearStoredNovelData();
		await loadNovels();
	}, [loadNovels]);

	return {
		novels,
		dataSource,
		isUploadingData,
		dataSourceUrl,
		uploadError,
		isInitialLoading,
		setDataSourceUrl,
		setUploadError,
		handleFileUpload,
		handleUrlSubmit,
		handleRefreshData,
		handleClearData,
	};
}
