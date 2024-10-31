//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";

export const runtime = "nodejs";

interface SharedFile {
  fileUuid: string;
  sharedBy: string;
  sharedWith: string;
  sharedAt: Date;
}

export async function POST(req: NextRequest, res: Response) {
  const data = await req.formData();

  console.log(data,"data")
  const sharedBy = data.get("sharedBy");
  const sharedWith = data.get("sharedWith");
  const fileUuid = data.get("fileUuid");

  const sharedFile: SharedFile = {
    fileUuid: fileUuid,
    sharedBy: sharedBy,
    sharedWith: sharedWith,
    sharedAt: new Date(),
  };

  console.log(sharedFile);

  try {
    const result = await prisma.SharedFiles.create({
      data: sharedFile as SharedFile,
    });
    return NextResponse.json(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
