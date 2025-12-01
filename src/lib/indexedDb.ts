"use client";

import Dexie, { type Table } from "dexie";

interface KeyValueRecord<T = unknown> {
	id: string;
	value: T;
}

class AppDatabase extends Dexie {
	keyValues!: Table<KeyValueRecord<unknown>, string>;

	constructor() {
		super("bukumaru");
		this.version(1).stores({
			keyValues: "&id",
		});
	}
}

export const db = new AppDatabase();

export async function getValue<T>(id: string): Promise<T | undefined> {
	const record = await db.keyValues.get(id);
	return record?.value as T | undefined;
}

export async function setValue<T>(id: string, value: T): Promise<void> {
	await db.keyValues.put({ id, value });
}

export async function deleteValue(id: string): Promise<void> {
	await db.keyValues.delete(id);
}
