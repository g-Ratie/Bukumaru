"use client";

import { Database, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
	onTryDemoData: () => void;
};

export function EmptyState({ onTryDemoData }: EmptyStateProps) {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<div className="text-center">
				<Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="mb-2 font-semibold text-lg">小説データがありません</h2>
				<p className="mb-4 text-muted-foreground text-sm">
					設定ページから小説データをアップロードまたは
					<br />
					URLを指定してデータを読み込んでください
				</p>
				<div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
					<Link href="/settings">
						<Button>
							<Settings className="mr-2 h-4 w-4" />
							設定ページへ移動
						</Button>
					</Link>
					<Button variant="outline" onClick={onTryDemoData}>
						<Sparkles className="mr-2 h-4 w-4" />
						デモデータを試す
					</Button>
				</div>
			</div>
		</div>
	);
}
