"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<div className="text-center">
				<Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
				<p className="text-muted-foreground">データを読み込み中...</p>
			</div>
		</div>
	);
}
