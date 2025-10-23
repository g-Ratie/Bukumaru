"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
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
	savedFilters: SavedFilter[];
	onApplyFilter: (filter: SavedFilter) => void;
	onDeleteFilter: (id: string) => void;
}

export function SavedFiltersSection({
	savedFilters,
	onApplyFilter,
	onDeleteFilter,
}: SavedFiltersSectionProps) {
	const [selectedFilterId, setSelectedFilterId] = useState<string>("");
	const selectId = useId();

	if (savedFilters.length === 0) {
		return null;
	}

	const handleApply = () => {
		const filter = savedFilters.find((f) => f.id === selectedFilterId);
		if (filter) {
			onApplyFilter(filter);
			setSelectedFilterId("");
		}
	};

	return (
		<div className="space-y-3 border-t pt-6">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Bookmark size={16} />
				<span className="font-medium">保存済み条件</span>
			</div>

			<div className="flex gap-2">
				<div className="flex-1">
					<Label htmlFor={selectId} className="sr-only">
						保存済み条件を選択
					</Label>
					<Select value={selectedFilterId} onValueChange={setSelectedFilterId}>
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

			<div className="space-y-2">
				{savedFilters.map((filter) => (
					<div
						key={filter.id}
						className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
					>
						<button
							type="button"
							className="flex-1 cursor-pointer text-left text-sm hover:text-primary"
							onClick={() => onApplyFilter(filter)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onApplyFilter(filter);
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
	);
}
