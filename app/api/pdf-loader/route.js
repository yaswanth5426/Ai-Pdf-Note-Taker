import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get('pdfUrl');

  try {
    // ✅ Fetch PDF as buffer
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Use pdf-parse directly instead of WebPDFLoader
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const pdfData = await pdfParse(buffer);
    const pdfTextContent = pdfData.text;

    // ✅ Split text
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([pdfTextContent]);
    const splitterList = output.map(doc => doc.pageContent);

    return NextResponse.json({ result: splitterList });
  } catch (error) {
    console.error("PDF loader error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}