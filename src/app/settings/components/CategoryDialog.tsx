"use client";

import { Plus, Save } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

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

interface CategoryDialogProps {
	mode: "add" | "edit";
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: { name: string; color: string }) => void;
	defaultValues?: {
		name?: string;
		color?: string;
	};
}

export function CategoryDialog({
	mode,
	open,
	onOpenChange,
	onSubmit,
	defaultValues,
}: CategoryDialogProps) {
	const nameInputId = useId();
	const [name, setName] = useState(defaultValues?.name ?? "");
	const [color, setColor] = useState(defaultValues?.color ?? "blue");

	useEffect(() => {
		if (open) {
			setName(defaultValues?.name ?? "");
			setColor(defaultValues?.color ?? "blue");
		}
	}, [defaultValues?.name, defaultValues?.color, open]);

	const { title, submitLabel, SubmitIcon } = useMemo(() => {
		if (mode === "edit") {
			return {
				title: "カテゴリを編集",
				submitLabel: "保存",
				SubmitIcon: Save,
			} as const;
		}

		return {
			title: "新しいカテゴリを追加",
			submitLabel: "追加",
			SubmitIcon: Plus,
		} as const;
	}, [mode]);

	const handleSubmit = () => {
		const trimmedName = name.trim();
		if (!trimmedName) return;
		onSubmit({ name: trimmedName, color });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<Label htmlFor={nameInputId}>カテゴリ名</Label>
						<Input
							id={nameInputId}
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="カテゴリ名を入力"
						/>
					</div>
					<div>
						<Label htmlFor="category-color">色</Label>
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
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						キャンセル
					</Button>
					<Button onClick={handleSubmit} disabled={!name.trim()}>
						<SubmitIcon className="mr-2 h-4 w-4" />
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
