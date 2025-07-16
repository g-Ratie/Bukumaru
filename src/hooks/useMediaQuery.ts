"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);

		// 初期値を設定
		setMatches(media.matches);

		// リスナーを設定
		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// addEventListener は新しい API、古いブラウザではaddListenerを使用
		if (media.addEventListener) {
			media.addEventListener("change", listener);
		} else {
			media.addListener(listener);
		}

		// クリーンアップ
		return () => {
			if (media.removeEventListener) {
				media.removeEventListener("change", listener);
			} else {
				media.removeListener(listener);
			}
		};
	}, [query]);

	return matches;
}
