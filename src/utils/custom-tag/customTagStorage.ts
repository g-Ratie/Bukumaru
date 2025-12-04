"use client";

import { db } from "@/lib/indexedDb";
import type { CustomTag } from "@/types/customTag";

function normalizeTags(tags: string[]): string[] {
	const seen = new Set<string>();

	return tags
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0)
		.filter((tag) => {
			const key = tag.toLowerCase();
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
}

export async function getCustomTags(): Promise<CustomTag[]> {
	if (typeof window === "undefined") {
		return [];
	}

	await db.open();
	return db.customTags.toArray();
}

export async function addCustomTag(
	customTag: Omit<CustomTag, "id">,
): Promise<CustomTag> {
	await db.open();
	const newCustomTag: CustomTag = {
		...customTag,
		id: crypto.randomUUID(),
		tags: normalizeTags(customTag.tags),
	};

	await db.customTags.put(newCustomTag);
	return newCustomTag;
}

export async function updateCustomTag(
	id: string,
	updates: Partial<Omit<CustomTag, "id">>,
): Promise<CustomTag | null> {
	await db.open();
	const existing = await db.customTags.get(id);
	if (!existing) return null;

	const normalizedUpdates = updates.tags
		? { ...updates, tags: normalizeTags(updates.tags) }
		: updates;
	const updatedCustomTag: CustomTag = {
		...existing,
		...normalizedUpdates,
	};

	await db.customTags.put(updatedCustomTag);
	return updatedCustomTag;
}

export async function deleteCustomTag(id: string): Promise<void> {
	await db.open();
	await db.customTags.delete(id);
}

export async function saveCustomTags(customTags: CustomTag[]): Promise<void> {
	if (typeof window === "undefined") {
		return;
	}

	await db.open();
	await db.transaction("rw", db.customTags, async () => {
		await db.customTags.clear();
		if (customTags.length > 0) {
			const normalized = customTags.map((customTag) => ({
				...customTag,
				tags: normalizeTags(customTag.tags),
			}));
			await db.customTags.bulkPut(normalized);
		}
	});
}

export function ensureNormalizedTags(tags: string[]): string[] {
	return normalizeTags(tags);
}
