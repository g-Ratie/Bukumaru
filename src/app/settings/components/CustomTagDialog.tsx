"use client";

import { Plus, Save, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CATEGORY_COLORS } from "@/types/category";
import { ensureNormalizedTags } from "@/utils/custom-tag/customTagStorage";

interface CustomTagDialogProps {
	mode: "add" | "edit";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: { name: string; color: string; tags: string[] }) => void;
	defaultValues?: {
		name?: string;
		color?: string;
		tags?: string[];
	};
	tagSuggestions: Array<{ tag: string; count: number }>;
}

export function CustomTagDialog({
	mode,
	open,
	onOpenChange,
	onSubmit,
	defaultValues,
	tagSuggestions,
}: CustomTagDialogProps) {
	const nameInputId = useId();
	const [name, setName] = useState(defaultValues?.name ?? "");
	const [color, setColor] = useState(defaultValues?.color ?? "blue");
	const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
	const [tagInput, setTagInput] = useState("");
	const [isTagInputFocused, setIsTagInputFocused] = useState(false);

	useEffect(() => {
		if (open) {
			setName(defaultValues?.name ?? "");
			setColor(defaultValues?.color ?? "blue");
			setTags(defaultValues?.tags ?? []);
			setTagInput("");
		}
	}, [defaultValues?.name, defaultValues?.color, defaultValues?.tags, open]);

	const { title, submitLabel, SubmitIcon } = useMemo(() => {
		if (mode === "edit") {
			return {
				title: "カスタムタグを編集",
				submitLabel: "保存",
				SubmitIcon: Save,
			} as const;
		}

		return {
			title: "新しいカスタムタグを追加",
			submitLabel: "追加",
			SubmitIcon: Plus,
		} as const;
	}, [mode]);

	const filteredSuggestions = useMemo(() => {
		const keyword = tagInput.trim().toLowerCase();
		if (!keyword) return [];

		return tagSuggestions
			.filter(
				(suggestion) =>
					suggestion.tag.toLowerCase().includes(keyword) &&
					!tags.some(
						(existingTag) =>
							existingTag.toLowerCase() === suggestion.tag.toLowerCase(),
					),
			)
			.slice(0, 10);
	}, [tagInput, tagSuggestions, tags]);

	const handleAddTag = (tagValue?: string) => {
		const newTag = (tagValue ?? tagInput).trim();
		if (!newTag) return;

		setTags((prev) => ensureNormalizedTags([...prev, newTag]));
		setTagInput("");
		setIsTagInputFocused(false);
	};

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((existing) => existing !== tag));
	};

	const handleSubmit = () => {
		const trimmedName = name.trim();
		if (!trimmedName || tags.length === 0) return;

		onSubmit({
			name: trimmedName,
			color,
			tags: ensureNormalizedTags(tags),
		});
	};

	const handleTagInputBlur = () => {
		setTimeout(() => setIsTagInputFocused(false), 150);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<Label htmlFor={nameInputId}>カスタムタグ名</Label>
						<Input
							id={nameInputId}
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="カスタムタグ名を入力"
						/>
					</div>

					<div>
						<Label htmlFor="custom-tag-color">色</Label>
						<Select value={color} onValueChange={setColor}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CATEGORY_COLORS.map((categoryColor) => (
									<SelectItem
										key={categoryColor.value}
										value={categoryColor.value}
									>
										<div className="flex items-center gap-2">
											<div
												className={`h-3 w-3 rounded-full ${categoryColor.bgClass}`}
											/>
											{categoryColor.name}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>構成タグ</Label>
							<span className="text-muted-foreground text-sm">
								選択中: {tags.length}件
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{tags.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									まだタグが選択されていません
								</p>
							) : (
								tags.map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="flex items-center gap-1"
									>
										{tag}
										<button
											type="button"
											className="text-muted-foreground hover:text-foreground"
											onClick={() => handleRemoveTag(tag)}
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))
							)}
						</div>
						<div className="relative">
							<Input
								placeholder="タグ名を入力"
								value={tagInput}
								onChange={(event) => setTagInput(event.target.value)}
								onFocus={() => setIsTagInputFocused(true)}
								onBlur={handleTagInputBlur}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault();
										handleAddTag();
									}
								}}
							/>
							{isTagInputFocused &&
								tagInput.trim() &&
								filteredSuggestions.length > 0 && (
									<div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-md border bg-white shadow-lg dark:border-border dark:bg-popover">
										{filteredSuggestions.map((suggestion) => (
											<button
												key={suggestion.tag}
												type="button"
												className="block w-full cursor-pointer rounded p-2 text-left text-muted-foreground text-sm hover:bg-gray-100 dark:hover:bg-accent"
												onMouseDown={(event) => {
													event.preventDefault();
													handleAddTag(suggestion.tag);
												}}
											>
												{suggestion.tag} ({suggestion.count})
											</button>
										))}
									</div>
								)}
							<Button
								onClick={() => handleAddTag()}
								className="mt-2"
								disabled={!tagInput.trim()}
							>
								タグを追加
							</Button>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						キャンセル
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!name.trim() || tags.length === 0}
					>
						<SubmitIcon className="mr-2 h-4 w-4" />
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
