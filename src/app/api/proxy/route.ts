import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const url = request.nextUrl.searchParams.get("url");

		if (!url) {
			return NextResponse.json(
				{ error: "URLパラメータが必要です" },
				{ status: 400 },
			);
		}

		// URLのバリデーション
		try {
			const parsedUrl = new URL(url);
			// HTTPSまたはHTTPのみ許可
			if (!["https:", "http:"].includes(parsedUrl.protocol)) {
				return NextResponse.json(
					{ error: "HTTPまたはHTTPSのURLのみ許可されています" },
					{ status: 400 },
				);
			}
		} catch {
			return NextResponse.json({ error: "無効なURLです" }, { status: 400 });
		}

		// 外部URLからデータを取得
		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
				"User-Agent": "pixiv-bookmark-viewer/1.0",
			},
			// タイムアウト設定
			signal: AbortSignal.timeout(30000), // 30秒
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: `リモートサーバーエラー: ${response.status}` },
				{ status: response.status },
			);
		}

		// Content-Typeをチェック
		const contentType = response.headers.get("content-type");
		if (!contentType?.includes("application/json")) {
			return NextResponse.json(
				{ error: "JSONレスポンスではありません" },
				{ status: 400 },
			);
		}

		// レスポンスサイズをチェック
		const contentLength = response.headers.get("content-length");
		const sizeInMB = contentLength
			? parseInt(contentLength, 10) / (1024 * 1024)
			: 0;

		if (sizeInMB > 10) {
			return NextResponse.json(
				{
					error: `ファイルサイズが大きすぎます (${sizeInMB.toFixed(2)}MB)`,
				},
				{ status: 413 },
			);
		}

		// JSONデータを取得
		const data = await response.json();

		// CORSヘッダーを設定してレスポンスを返す
		return NextResponse.json(data, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "Content-Type",
				"Cache-Control": "public, max-age=3600", // 1時間キャッシュ
			},
		});
	} catch (error) {
		console.error("Proxy error:", error);

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				return NextResponse.json(
					{ error: "リクエストがタイムアウトしました" },
					{ status: 408 },
				);
			}
		}

		return NextResponse.json(
			{ error: "プロキシエラーが発生しました" },
			{ status: 500 },
		);
	}
}

// OPTIONS リクエストの処理（CORS プリフライト）
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
