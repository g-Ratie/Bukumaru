"use client";

import { Settings, PlayCircle } from "lucide-react";
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

interface WelcomeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDemoClick: () => void;
}

export function WelcomeModal({ isOpen, onClose, onDemoClick }: WelcomeModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl">小説検索サイトへようこそ</DialogTitle>
					<DialogDescription className="space-y-2 pt-3">
						<p>このアプリケーションを利用するには、小説データが必要です。</p>
						<p>以下のいずれかの方法で始めてください：</p>
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-4">
					<div className="rounded-lg border p-4">
						<h3 className="mb-2 font-semibold flex items-center gap-2">
							<Settings className="h-4 w-4" />
							自分のデータを使用
						</h3>
						<p className="text-sm text-muted-foreground mb-3">
							pixiv小説データ（JSON形式）をアップロードして検索を開始
						</p>
						<Link href="/settings">
							<Button className="w-full" onClick={onClose}>
								設定画面へ移動
							</Button>
						</Link>
					</div>

					<div className="rounded-lg border p-4">
						<h3 className="mb-2 font-semibold flex items-center gap-2">
							<PlayCircle className="h-4 w-4" />
							デモデータで試す
						</h3>
						<p className="text-sm text-muted-foreground mb-3">
							サンプルデータを使用してアプリの機能を体験
						</p>
						<Button variant="outline" className="w-full" onClick={onDemoClick}>
							デモを開始
						</Button>
					</div>
				</div>

				<DialogFooter className="sm:justify-start">
					<p className="text-xs text-muted-foreground">
						※ データはブラウザのローカルストレージに保存されます
					</p>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}