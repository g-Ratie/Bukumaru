"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavedFilter } from "@/types/savedFilter";

interface SaveFilterDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (name: string) => Promise<void>;
	existingFilters: SavedFilter[];
}

export function SaveFilterDialog({
	isOpen,
	onClose,
	onSave,
	existingFilters,
}: SaveFilterDialogProps) {
	const [filterName, setFilterName] = useState("");
	const [error, setError] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const filterNameId = useId();

	const handleClose = () => {
		setFilterName("");
		setError("");
		onClose();
	};

	const handleSave = async () => {
		const trimmedName = filterName.trim();

		if (!trimmedName) {
			setError("名前を入力してください");
			return;
		}

		if (existingFilters.some((filter) => filter.name === trimmedName)) {
			setError("この名前は既に使用されています");
			return;
		}

		setIsSaving(true);
		try {
			await onSave(trimmedName);
			handleClose();
		} catch (_err) {
			setError("保存に失敗しました");
		} finally {
			setIsSaving(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>検索条件を保存</DialogTitle>
					<DialogDescription>
						現在の検索条件に名前を付けて保存します
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor={filterNameId}>条件名</Label>
						<Input
							id={filterNameId}
							placeholder="例: 短編・R18"
							value={filterName}
							onChange={(e) => {
								setFilterName(e.target.value);
								setError("");
							}}
							onKeyDown={handleKeyDown}
							autoFocus
						/>
						{error && <p className="text-destructive text-sm">{error}</p>}
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={handleClose} disabled={isSaving}>
						キャンセル
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? "保存中..." : "保存"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
