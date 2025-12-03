"use client";

import {
	Database,
	Download,
	FileJson,
	Link2,
	RefreshCw,
	Sparkles,
	Upload,
	X,
} from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DataSourceInfo } from "@/hooks/useSettingsDataSource";
import { formatUpdateTime } from "@/utils/novelData/novelDataStorage";

interface DataSourceSettingsCardProps {
	dataSource: DataSourceInfo;
	novelsCount: number;
	isUploadingData: boolean;
	dataSourceUrl: string;
	uploadError: string | null;
	onUrlChange: (value: string) => void;
	onUrlSubmit: () => Promise<void>;
	onFileUpload: (file: File | null) => Promise<void>;
	onRefresh: () => Promise<void>;
	onClear: () => Promise<void>;
}

export function DataSourceSettingsCard({
	dataSource,
	novelsCount,
	isUploadingData,
	dataSourceUrl,
	uploadError,
	onUrlChange,
	onUrlSubmit,
	onFileUpload,
	onRefresh,
	onClear,
}: DataSourceSettingsCardProps) {
	const fileUploadId = useId();
	const isRefreshDisabled =
		dataSource.type !== "url" || !dataSource.url || isUploadingData;
	const isClearDisabled = dataSource.type === "default" || isUploadingData;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Database className="h-5 w-5" />
					小説データソース設定
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="rounded-lg border bg-muted/50 p-4">
					<div className="mb-2 flex items-center justify-between">
						<h3 className="font-medium text-sm">現在のデータソース</h3>
						{dataSource.type !== "default" && (
							<div className="flex gap-2">
								{dataSource.type === "url" && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => void onRefresh()}
										disabled={isRefreshDisabled}
									>
										<RefreshCw className="h-4 w-4" />
										更新
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={() => void onClear()}
									disabled={isClearDisabled}
								>
									<X className="h-4 w-4" />
									クリア
								</Button>
							</div>
						)}
					</div>
					<div className="space-y-1 text-sm">
						<p className="text-muted-foreground">
							{dataSource.type === "default" && (
								<>
									<FileJson className="mr-2 inline h-4 w-4" />
									データが設定されていません
								</>
							)}
							{dataSource.type === "demo" && (
								<>
									<Sparkles className="mr-2 inline h-4 w-4 text-primary" />
									デモデータを使用中
								</>
							)}
							{dataSource.type === "url" && (
								<>
									<Link2 className="mr-2 inline h-4 w-4" />
									URL: {dataSource.url}
								</>
							)}
							{dataSource.type === "file" && (
								<>
									<FileJson className="mr-2 inline h-4 w-4" />
									ファイル: {dataSource.fileName}
								</>
							)}
						</p>
						{dataSource.updatedAt && (
							<p className="text-muted-foreground text-xs">
								最終更新: {formatUpdateTime(dataSource.updatedAt)}
							</p>
						)}
						{novelsCount > 0 && (
							<p className="text-muted-foreground text-xs">
								{novelsCount}件の小説データ
							</p>
						)}
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="font-medium text-sm">JSONファイルをアップロード</h3>
					<div className="flex gap-2">
						<Label
							htmlFor={fileUploadId}
							className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 border-dashed px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
						>
							<Upload className="mr-2 h-4 w-4" />
							<span className="text-sm">ファイルを選択</span>
							<Input
								id={fileUploadId}
								type="file"
								accept=".json"
								className="hidden"
								disabled={isUploadingData}
								onChange={(event) => {
									const file = event.target.files?.[0] ?? null;
									void onFileUpload(file);
								}}
							/>
						</Label>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="font-medium text-sm">URLからデータを取得</h3>
					<div className="flex gap-2">
						<Input
							type="url"
							placeholder="https://example.com/novels.json"
							value={dataSourceUrl}
							onChange={(event) => onUrlChange(event.target.value)}
							disabled={isUploadingData}
						/>
						<Button
							onClick={() => void onUrlSubmit()}
							disabled={!dataSourceUrl.trim() || isUploadingData}
						>
							<Download className="mr-2 h-4 w-4" />
							取得
						</Button>
					</div>
				</div>

				{uploadError && (
					<div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
						{uploadError}
					</div>
				)}

				{isUploadingData && (
					<div className="flex items-center justify-center py-4">
						<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
						<span className="text-muted-foreground text-sm">
							データを読み込み中...
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
