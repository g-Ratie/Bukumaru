"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { SearchFilters } from "@/types/search";

export function useURLSearchParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isInitialized, setIsInitialized] = useState(false);

	const getFiltersFromURL = useCallback((): SearchFilters => {
		const params = new URLSearchParams(searchParams.toString());

                const tagsParam = params.get("tags");
                const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
                const minTextCountParam = params.get("minCount");
                const parsedMinTextCount =
                        minTextCountParam === null ? null : Number(minTextCountParam);
                const minTextCount =
                        parsedMinTextCount === null || Number.isNaN(parsedMinTextCount)
                                ? null
                                : parsedMinTextCount;
                const maxTextCountParam = params.get("maxCount");
                const parsedMaxTextCount =
                        maxTextCountParam === null ? null : Number(maxTextCountParam);
                const maxTextCount =
                        parsedMaxTextCount === null || Number.isNaN(parsedMaxTextCount)
                                ? null
                                : parsedMaxTextCount;

                return {
                        authorName: params.get("author") || "",
                        tags,
                        selectedTag: params.get("selectedTag") || "",
                        minTextCount,
                        maxTextCount,
                        sortBy: (params.get("sortBy") as SearchFilters["sortBy"]) || "createDate",
                        sortOrder:
                                (params.get("sortOrder") as SearchFilters["sortOrder"]) || "desc",
			currentPage: Number(params.get("page")) || 1,
			itemsPerPage: Number(params.get("perPage")) || 24,
		};
	}, [searchParams]);

	const updateURLParams = useCallback(
		(filters: SearchFilters) => {
			const params = new URLSearchParams();

			if (filters.authorName) {
				params.set("author", filters.authorName);
			}
			if (filters.tags.length > 0) {
				params.set("tags", filters.tags.join(","));
                        }
                        if (filters.selectedTag) {
                                params.set("selectedTag", filters.selectedTag);
                        }
                        if (filters.minTextCount !== null) {
                                params.set("minCount", filters.minTextCount.toString());
                        }
                        if (filters.maxTextCount !== null) {
                                params.set("maxCount", filters.maxTextCount.toString());
                        }
			if (filters.sortBy !== "createDate") {
				params.set("sortBy", filters.sortBy);
			}
			if (filters.sortOrder !== "desc") {
				params.set("sortOrder", filters.sortOrder);
			}
			if (filters.currentPage > 1) {
				params.set("page", filters.currentPage.toString());
			}
			if (filters.itemsPerPage !== 24) {
				params.set("perPage", filters.itemsPerPage.toString());
			}

			const queryString = params.toString();
			const url = queryString ? `${pathname}?${queryString}` : pathname;

			router.replace(url, { scroll: false });
		},
		[pathname, router],
	);

	useEffect(() => {
		setIsInitialized(true);
	}, []);

	return {
		getFiltersFromURL,
		updateURLParams,
		isInitialized,
	};
}
