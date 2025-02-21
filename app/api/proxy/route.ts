import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

// ✅ Handles both GET and POST requests properly
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams.toString();
        const endpoint = req.nextUrl.pathname.replace("/api/proxy", ""); // Fix path handling

        if (!endpoint) {
            return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}?${searchParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch ${endpoint}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const endpoint = req.nextUrl.pathname.replace("/api/proxy", "");

        if (!endpoint) {
            return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch ${endpoint}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
