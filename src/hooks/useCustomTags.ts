"use client";

import { useCallback, useEffect, useState } from "react";

import type { CustomTag } from "@/types/customTag";
import {
	addCustomTag as addCustomTagToStorage,
	deleteCustomTag as deleteCustomTagFromStorage,
	ensureNormalizedTags,
	getCustomTags as getCustomTagsFromStorage,
	updateCustomTag as updateCustomTagInStorage,
} from "@/utils/custom-tag/customTagStorage";

export function useCustomTags() {
	const [customTags, setCustomTags] = useState<CustomTag[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		let isMounted = true;
		const load = async () => {
			const storedCustomTags = await getCustomTagsFromStorage();
			if (!isMounted) return;
			setCustomTags(storedCustomTags);
			setIsLoaded(true);
		};

		void load();
		return () => {
			isMounted = false;
		};
	}, []);

	const addCustomTag = useCallback(async (customTag: Omit<CustomTag, "id">) => {
		const created = await addCustomTagToStorage(customTag);
		setCustomTags((prev) => [...prev, created]);
		return created;
	}, []);

	const updateCustomTag = useCallback(
		async (
			id: string,
			updates: Partial<Omit<CustomTag, "id">>,
		): Promise<CustomTag | null> => {
			const updated = await updateCustomTagInStorage(id, updates);
			if (!updated) return null;

			setCustomTags((prev) =>
				prev.map((customTag) => (customTag.id === id ? updated : customTag)),
			);

			return updated;
		},
		[],
	);

	const deleteCustomTag = useCallback(async (id: string) => {
		await deleteCustomTagFromStorage(id);
		setCustomTags((prev) => prev.filter((customTag) => customTag.id !== id));
	}, []);

	const addTagToCustomTag = useCallback(
		async (customTagId: string, tag: string) => {
			const customTag = customTags.find((item) => item.id === customTagId);
			if (!customTag) return null;

			const normalizedTags = ensureNormalizedTags([...customTag.tags, tag]);

			return updateCustomTag(customTagId, {
				tags: normalizedTags,
			});
		},
		[customTags, updateCustomTag],
	);

	const removeTagFromCustomTag = useCallback(
		async (customTagId: string, tag: string) => {
			const customTag = customTags.find((item) => item.id === customTagId);
			if (!customTag) return null;

			const updatedTags = customTag.tags.filter(
				(existingTag) => existingTag !== tag,
			);

			return updateCustomTag(customTagId, {
				tags: updatedTags,
			});
		},
		[customTags, updateCustomTag],
	);

	return {
		customTags,
		isLoaded,
		addCustomTag,
		updateCustomTag,
		deleteCustomTag,
		addTagToCustomTag,
		removeTagFromCustomTag,
	};
}
