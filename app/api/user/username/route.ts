import { autoCompleteUsernames } from "@/lib/actions/user.actions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import next from "next/types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const searchText = searchParams.get('search')
    if (!searchText || searchText.length < 2)
        return NextResponse.json({ "result": false, message: "you must enter at least 2 characters" }, { status: 400 })
    const res = await autoCompleteUsernames({ input: searchText })
    revalidatePath(request.url)
    return NextResponse.json(JSON.parse(res))
}