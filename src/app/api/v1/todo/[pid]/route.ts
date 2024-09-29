import { connectToDatabase } from "@/app/lib/mongodb";
import Todo from "@/app/models/todo";
import {NextResponse } from "next/server";

//url => api/v1/todo/pid
export async function GET(
    req: Request,
    {params}: {params: {pid:string}}) {
    try {
        const pid = params.pid;
        await connectToDatabase();
        const todoResult = await Todo.find({ _id:pid});
        return NextResponse.json({ data: todoResult });
    } catch (err) {
        return NextResponse.json({
            error: err,
        });
    }
  } 