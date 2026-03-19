import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const pdfUrl = searchParams.get('pdfUrl');

  console.log("1. PDF loader called");
  console.log("2. PDF URL:", pdfUrl);

  try {
    console.log("3. Fetching PDF...");
    const response = await fetch(pdfUrl);
    console.log("4. Fetch status:", response.status);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("5. Buffer size:", buffer.length);

    console.log("6. Importing pdf-parse...");
    const pdf = (await import('pdf-parse')).default;
    console.log("7. pdf-parse imported");
    
    const pdfData = await pdf(buffer);
    console.log("8. PDF parsed, text length:", pdfData.text.length);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const output = await splitter.createDocuments([pdfData.text]);
    const splitterList = output.map(doc => doc.pageContent);
    console.log("9. Chunks:", splitterList.length);

    return NextResponse.json({ result: splitterList });
  } catch (error) {
    console.error("ERROR at step:", error.message);
    console.error("Stack:", error.stack);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}