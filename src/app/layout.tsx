import type { Metadata } from "next";
import { ThemeProvider } from "@/components/shared/theme-provider/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
	title: "ぶく丸",
	description: "Pixivの小説ブックマークを検索・閲覧できるWebアプリケーション",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className="antialiased">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
