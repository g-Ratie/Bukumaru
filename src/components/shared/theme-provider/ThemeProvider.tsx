"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

interface ThemeProviderProps {
	children: React.ReactNode;
	attribute?: string;
	defaultTheme?: string;
	enableSystem?: boolean;
	disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
	children,
	attribute = "class",
	defaultTheme = "system",
	enableSystem = true,
	disableTransitionOnChange = true,
	...props
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute={attribute as any}
			defaultTheme={defaultTheme}
			enableSystem={enableSystem}
			disableTransitionOnChange={disableTransitionOnChange}
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
