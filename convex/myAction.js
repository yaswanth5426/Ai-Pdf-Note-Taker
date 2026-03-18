"use node";
import { performance } from "node:perf_hooks";
globalThis.performance = performance;
import { action } from "./_generated/server";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { v } from "convex/values";

// ✅ Direct Google API call — no LangChain wrapper needed
async function getEmbedding(text) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    //                          ^^^^^^                  ^^^^^^^^^^^^^^^^^^^^^^^^^
    //                          v1beta not v1           must match model name
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini embed failed: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.embedding.values;
}
function makeEmbeddings() {
  return {
    embedQuery: (text) => getEmbedding(text),
    embedDocuments: async (texts) => {
      const vectors = [];
      for (const t of texts) {
        vectors.push(await getEmbedding(t));
      }
      return vectors;
    },
  };
}

export const ingest = action({
  args: { splitText: v.any(), fileId: v.string() },
  handler: async (ctx, args) => {
    const embeddings = makeEmbeddings();
    const metadatas = args.splitText.map(() => ({ fileId: args.fileId }));

    await ConvexVectorStore.fromTexts(
      args.splitText,
      metadatas,
      embeddings,
      { ctx, table: "documents", indexName: "byEmbedding" }
    );

    return "Ingest Completed";
  },
});

export const search = action({
  args: { query: v.string(), fileId: v.string() },
  handler: async (ctx, args) => {
    const embeddings = makeEmbeddings();

    const vectorStore = new ConvexVectorStore(embeddings, {
      ctx,
      table: "documents",
      indexName: "byEmbedding",
    });

    const results = await vectorStore.similaritySearch(args.query, 20);

    const filtered = results
      .filter(r => r.metadata.fileId === args.fileId)
      .slice(0, 6);

    return filtered.map(r => ({
      pageContent: r.pageContent,
      metadata: r.metadata,
    }));
  },
});