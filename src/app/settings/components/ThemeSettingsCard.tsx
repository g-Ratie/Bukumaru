"use client";

import { Settings } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ThemeSettingsCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					アプリケーション設定
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-medium">テーマ</h3>
						<p className="text-gray-600 text-sm dark:text-gray-400">
							ライト・ダークモードの切り替え
						</p>
					</div>
					<ThemeToggle />
				</div>
			</CardContent>
		</Card>
	);
}
