"use client";

import { Database, Loader2, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type SetupDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUseDemoData: () => void;
	isApplyingDemoData: boolean;
};

export function SetupDialog({
	open,
	onOpenChange,
	onUseDemoData,
	isApplyingDemoData,
}: SetupDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>小説データの準備</DialogTitle>
					<DialogDescription>
						データが見つかりませんでした。設定ページでデータを読み込むか、デモデータを利用できます。
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4">
						<Database className="mt-1 h-5 w-5 text-muted-foreground" />
						<div className="space-y-1 text-sm">
							<p className="font-medium">設定ページでデータを読み込む</p>
							<p className="text-muted-foreground">
								pixivからエクスポートしたJSONファイルやURLを読み込みます。```
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 rounded-md border bg-muted/50 p-4">
						<Sparkles className="mt-1 h-5 w-5 text-primary" />
						<div className="space-y-1 text-sm">
							<p className="font-medium">すぐに試せるデモデータを使用</p>
							<p className="text-muted-foreground">
								アプリの使い方を確認できるサンプルデータです。後から設定ページで本番データに切り替えられます。
							</p>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button asChild variant="outline">
						<Link href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							設定ページへ
						</Link>
					</Button>
					<Button onClick={onUseDemoData} disabled={isApplyingDemoData}>
						{isApplyingDemoData && <Loader2 className="h-4 w-4 animate-spin" />}
						デモデータを読み込む
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
