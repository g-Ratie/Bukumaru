import { describe, expect, test } from "vitest";
import { getCategoryColorClasses } from "../../utils/category/categoryColors";

describe("getCategoryColorClasses", () => {
	test("should return correct classes for blue color", () => {
		const actual = getCategoryColorClasses("blue");

		const expected = {
			bgClass: "bg-blue-100 dark:bg-blue-900",
			textClass: "text-blue-800 dark:text-blue-200",
		};
		expect(actual).toEqual(expected);
	});

	test("should return correct classes for green color", () => {
		const actual = getCategoryColorClasses("green");

		const expected = {
			bgClass: "bg-green-100 dark:bg-green-900",
			textClass: "text-green-800 dark:text-green-200",
		};
		expect(actual).toEqual(expected);
	});

	test("should return default gray classes for unknown color", () => {
		const actual = getCategoryColorClasses("unknown-color");

		const expected = {
			bgClass: "bg-gray-100 dark:bg-gray-800",
			textClass: "text-gray-800 dark:text-gray-200",
		};
		expect(actual).toEqual(expected);
	});

	test("should return default gray classes for empty string", () => {
		const actual = getCategoryColorClasses("");

		const expected = {
			bgClass: "bg-gray-100 dark:bg-gray-800",
			textClass: "text-gray-800 dark:text-gray-200",
		};
		expect(actual).toEqual(expected);
	});
});
