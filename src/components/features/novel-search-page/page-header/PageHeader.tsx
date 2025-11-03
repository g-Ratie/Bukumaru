"use client";

import { Settings } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/shared/theme-toggle/ThemeToggle";
import { Button } from "@/components/ui/button";

export function PageHeader() {
	return (
		<header className="mb-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-foreground">
						ぶく丸
					</h1>
				</div>
				<div className="flex items-center gap-2">
					<Link href="/settings">
						<Button variant="outline" size="sm">
							<Settings className="mr-2 h-4 w-4" />
							設定
						</Button>
					</Link>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
