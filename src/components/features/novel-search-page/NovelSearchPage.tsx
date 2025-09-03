"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { NovelSearchPageContent } from "./NovelSearchPageContent";

function LoadingFallback() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
				<p className="text-muted-foreground">読み込み中...</p>
			</div>
		</div>
	);
}

export function NovelSearchPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<NovelSearchPageContent />
		</Suspense>
	);
}
