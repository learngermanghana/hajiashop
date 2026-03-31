import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";

type InquiryPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  productName?: string;
  quantity?: number;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as InquiryPayload;

    if (!payload.fullName || !payload.phone || !payload.productName || !payload.message || !payload.quantity || payload.quantity < 1) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await firestore.collection("inquiries").add({
      ...payload,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to save inquiry", error);
    return NextResponse.json({ error: "Unable to save inquiry at this time." }, { status: 500 });
  }
}
