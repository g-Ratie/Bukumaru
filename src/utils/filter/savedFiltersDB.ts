import type { SavedFilter, SavedFilterData } from "@/types/savedFilter";

const DB_NAME = "PixivNovelFilters";
const STORE_NAME = "savedFilters";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};
	});
}

export async function saveFilter(
	name: string,
	filterData: SavedFilterData,
): Promise<SavedFilter> {
	const db = await openDatabase();
	const id = crypto.randomUUID();
	const savedFilter: SavedFilter = {
		id,
		name,
		filterData,
		createdAt: Date.now(),
	};

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.add(savedFilter);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(savedFilter);

		transaction.oncomplete = () => db.close();
	});
}

export async function getAllSavedFilters(): Promise<SavedFilter[]> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readonly");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			const filters = request.result as SavedFilter[];
			resolve(filters.sort((a, b) => b.createdAt - a.createdAt));
		};

		transaction.oncomplete = () => db.close();
	});
}

export async function deleteSavedFilter(id: string): Promise<void> {
	const db = await openDatabase();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], "readwrite");
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(id);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();

		transaction.oncomplete = () => db.close();
	});
}
