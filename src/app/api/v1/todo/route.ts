import { connectToDatabase } from "@/app/lib/mongodb";
import Todo from "@/app/models/todo";
import { NextRequest, NextResponse } from "next/server";

// READ data
// url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});
    return NextResponse.json({ data: todoResult }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch todos." }, { status: 500 });
  }
}

// Create new record
// req => { name: "", description: "", status: Boolean, duedate: String }
// url => api/v1/todo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Todo.create(body);
    return NextResponse.json({ data: res }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo." }, { status: 400 });
  }
}

// Update
// url => api/v1/todo
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body; // ดึง _id และข้อมูลอื่นที่ต้องการอัปเดต
    
    if (!_id) {
      return NextResponse.json({ error: "ID is required for updating a Todo." }, { status: 400 });
    }

    const res = await Todo.findByIdAndUpdate(_id, updateData, { new: true });

    if (!res) {
      return NextResponse.json({ error: "Todo not found." }, { status: 404 });
    }

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo." }, { status: 500 });
  }
}

// Delete
// url => api/v1/todo
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id } = body; // รับ _id ที่ต้องการลบ

    if (!_id) {
      return NextResponse.json({ error: "ID is required for deleting a Todo." }, { status: 400 });
    }

    const res = await Todo.findByIdAndDelete(_id);

    if (!res) {
      return NextResponse.json({ error: "Todo not found." }, { status: 404 });
    }

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo." }, { status: 500 });
  }
}