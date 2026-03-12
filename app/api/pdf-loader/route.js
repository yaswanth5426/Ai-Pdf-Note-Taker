import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//const pdfUrl = "https://tidy-gecko-730.convex.cloud/api/storage/90cb0c1f-e3c8-4cde-bef6-2c6fd327b7af"

export async function GET(req) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    console.log("PDF URL:", pdfUrl);
    //1. Load the PDF file from the URL
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

     let pdfTextContent = '';

     docs.forEach((doc) => {
        pdfTextContent += doc.pageContent + pdfTextContent;
    })
    
    //2. Split the text content into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([pdfTextContent]);

    let splitterList = [];

    output.forEach(doc=>{
        splitterList.push(doc.pageContent);
    })
    
    return NextResponse.json({ result: splitterList });
}