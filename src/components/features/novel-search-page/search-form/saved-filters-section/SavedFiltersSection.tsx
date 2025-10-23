"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { SavedFilter } from "@/types/savedFilter";

interface SavedFiltersSectionProps {
	isOpen: boolean;
	onClose: () => void;
	savedFilters: SavedFilter[];
	onApplyFilter: (filter: SavedFilter) => void;
	onDeleteFilter: (id: string) => void;
}

export function SavedFiltersSection({
	isOpen,
	onClose,
	savedFilters,
	onApplyFilter,
	onDeleteFilter,
}: SavedFiltersSectionProps) {
	const [selectedFilterId, setSelectedFilterId] = useState<string>("");
	const selectId = useId();

	const handleApply = () => {
		const filter = savedFilters.find((f) => f.id === selectedFilterId);
		if (filter) {
			onApplyFilter(filter);
			setSelectedFilterId("");
			onClose();
		}
	};

	const handleFilterClick = (filter: SavedFilter) => {
		onApplyFilter(filter);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Bookmark size={20} />
						保存済み検索条件
					</DialogTitle>
					<DialogDescription>
						保存した検索条件を選択して適用できます
					</DialogDescription>
				</DialogHeader>

				{savedFilters.length === 0 ? (
					<div className="py-8 text-center text-muted-foreground text-sm">
						保存された検索条件がありません
					</div>
				) : (
					<div className="space-y-4 py-4">
						<div className="flex gap-2">
							<div className="flex-1">
								<Label htmlFor={selectId} className="sr-only">
									保存済み条件を選択
								</Label>
								<Select
									value={selectedFilterId}
									onValueChange={setSelectedFilterId}
								>
									<SelectTrigger id={selectId}>
										<SelectValue placeholder="条件を選択..." />
									</SelectTrigger>
									<SelectContent>
										{savedFilters.map((filter) => (
											<SelectItem key={filter.id} value={filter.id}>
												{filter.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button onClick={handleApply} disabled={!selectedFilterId}>
								適用
							</Button>
						</div>

						<div className="max-h-80 space-y-2 overflow-y-auto">
							{savedFilters.map((filter) => (
								<div
									key={filter.id}
									className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
								>
									<button
										type="button"
										className="flex-1 cursor-pointer text-left text-sm hover:text-primary"
										onClick={() => handleFilterClick(filter)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												handleFilterClick(filter);
											}
										}}
									>
										{filter.name}
									</button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-1.5 text-muted-foreground hover:text-destructive"
										onClick={() => onDeleteFilter(filter.id)}
										aria-label={`${filter.name}を削除`}
									>
										<Trash2 size={14} />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
