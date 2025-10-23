import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { SearchFilters } from "@/types/search";
import { useURLSearchParams } from "../useURLSearchParams";

const mockReplace = vi.fn();
const mockUsePathname = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
	usePathname: () => mockUsePathname(),
	useSearchParams: () => mockUseSearchParams(),
}));

beforeEach(() => {
	vi.clearAllMocks();
	mockUsePathname.mockReturnValue("/");
	mockUseSearchParams.mockReturnValue(new URLSearchParams());
});

describe("useURLSearchParams", () => {
	describe("getFiltersFromURL", () => {
		test("should return default filters when no URL params exist", () => {
			mockUseSearchParams.mockReturnValue(new URLSearchParams());

			const { result } = renderHook(() => useURLSearchParams());

			const actual = result.current.getFiltersFromURL();

			const expected: SearchFilters = {
				authorName: "",
				tags: [],
				selectedTag: "",
				minTextCount: 0,
				maxTextCount: 50000,
				sortBy: "createDate",
				sortOrder: "desc",
				currentPage: 1,
				itemsPerPage: 24,
			};
			expect(actual).toEqual(expected);
		});

		test("should parse author param from URL", () => {
			const params = new URLSearchParams();
			params.set("author", "作者A");
			mockUseSearchParams.mockReturnValue(params);

			const { result } = renderHook(() => useURLSearchParams());

			const actual = result.current.getFiltersFromURL();

			expect(actual.authorName).toBe("作者A");
		});

		test("should parse tags param from URL", () => {
			const params = new URLSearchParams();
			params.set("tags", "タグ1,タグ2,タグ3");
			mockUseSearchParams.mockReturnValue(params);

			const { result } = renderHook(() => useURLSearchParams());

			const actual = result.current.getFiltersFromURL();

			expect(actual.tags).toEqual(["タグ1", "タグ2", "タグ3"]);
		});

		test("should parse numeric params from URL", () => {
			const params = new URLSearchParams();
			params.set("minCount", "1000");
			params.set("maxCount", "10000");
			params.set("page", "3");
			params.set("perPage", "48");
			mockUseSearchParams.mockReturnValue(params);

			const { result } = renderHook(() => useURLSearchParams());

			const actual = result.current.getFiltersFromURL();

			expect(actual.minTextCount).toBe(1000);
			expect(actual.maxTextCount).toBe(10000);
			expect(actual.currentPage).toBe(3);
			expect(actual.itemsPerPage).toBe(48);
		});

		test("should parse sort params from URL", () => {
			const params = new URLSearchParams();
			params.set("sortBy", "textCount");
			params.set("sortOrder", "asc");
			mockUseSearchParams.mockReturnValue(params);

			const { result } = renderHook(() => useURLSearchParams());

			const actual = result.current.getFiltersFromURL();

			expect(actual.sortBy).toBe("textCount");
			expect(actual.sortOrder).toBe("asc");
		});
	});

	describe("updateURLParams", () => {
		test("should update URL with non-default filter values", () => {
			mockUsePathname.mockReturnValue("/search");

			const { result } = renderHook(() => useURLSearchParams());

			const filters: SearchFilters = {
				authorName: "作者A",
				tags: ["タグ1", "タグ2"],
				selectedTag: "",
				minTextCount: 1000,
				maxTextCount: 50000,
				sortBy: "createDate",
				sortOrder: "desc",
				currentPage: 1,
				itemsPerPage: 24,
			};

			result.current.updateURLParams(filters);

			expect(mockReplace).toHaveBeenCalledWith(
				expect.stringContaining("author="),
				{ scroll: false },
			);
			expect(mockReplace).toHaveBeenCalledWith(
				expect.stringContaining("tags="),
				{ scroll: false },
			);
			expect(mockReplace).toHaveBeenCalledWith(
				expect.stringContaining("minCount=1000"),
				{ scroll: false },
			);
		});

		test("should not include default values in URL params", () => {
			mockUsePathname.mockReturnValue("/search");

			const { result } = renderHook(() => useURLSearchParams());

			const filters: SearchFilters = {
				authorName: "",
				tags: [],
				selectedTag: "",
				minTextCount: 0,
				maxTextCount: 50000,
				sortBy: "createDate",
				sortOrder: "desc",
				currentPage: 1,
				itemsPerPage: 24,
			};

			result.current.updateURLParams(filters);

			expect(mockReplace).toHaveBeenCalledWith("/search", { scroll: false });
		});

		test("should include all non-default params", () => {
			mockUsePathname.mockReturnValue("/search");

			const { result } = renderHook(() => useURLSearchParams());

			const filters: SearchFilters = {
				authorName: "作者",
				tags: ["タグ"],
				selectedTag: "選択タグ",
				minTextCount: 100,
				maxTextCount: 10000,
				sortBy: "textCount",
				sortOrder: "asc",
				currentPage: 2,
				itemsPerPage: 48,
			};

			result.current.updateURLParams(filters);

			const callUrl = mockReplace.mock.calls[0][0];
			expect(callUrl).toContain("author=");
			expect(callUrl).toContain("tags=");
			expect(callUrl).toContain("selectedTag=");
			expect(callUrl).toContain("minCount=100");
			expect(callUrl).toContain("maxCount=10000");
			expect(callUrl).toContain("sortBy=textCount");
			expect(callUrl).toContain("sortOrder=asc");
			expect(callUrl).toContain("page=2");
			expect(callUrl).toContain("perPage=48");
		});
	});

	describe("isInitialized", () => {
		test("should be true after hook is mounted", async () => {
			const { result } = renderHook(() => useURLSearchParams());

			await waitFor(() => {
				expect(result.current.isInitialized).toBe(true);
			});
		});
	});
});
