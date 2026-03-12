"use node";

import { performance } from "node:perf_hooks";
globalThis.performance = performance;

import { action } from "./_generated/server";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { HuggingFaceInferenceEmbeddings } 
from "@langchain/community/embeddings/hf";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },

  handler: async (ctx, args) => {

    const hf = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    /* ⭐ Adapter required for ConvexVectorStore */
    const embeddings = {
      embedQuery: async (text) => {
        return await hf.embedQuery(text);
      },

      embedDocuments: async (texts) => {
        const vectors = [];
        for (const t of texts) {
          vectors.push(await hf.embedQuery(t));
        }
        return vectors;
      },
    };

    /* ⭐ create metadata for each chunk */
    const metadatas = args.splitText.map(() => ({
      fileId: args.fileId,
    }));

    /* ⭐ store vectors */
    await ConvexVectorStore.fromTexts(
      args.splitText,
      metadatas,
      embeddings,
      {
        ctx,
        table: "documents",
        indexName: "byEmbedding",
      }
    );

    return "Ingest Completed";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },

  handler: async (ctx, args) => {

    const hf = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    /* ⭐ adapter same as ingest */
    const embeddings = {
      embedQuery: async (text) => {
        return await hf.embedQuery(text);
      },

      embedDocuments: async (texts) => {
        const vectors = [];
        for (const t of texts) {
          vectors.push(await hf.embedQuery(t));
        }
        return vectors;
      },
    };

    const vectorStore = new ConvexVectorStore(
      embeddings,
      {
        ctx,
        table: "documents",
        indexName: "byEmbedding",
      }
    );

    /* ⭐ search top 3 similar chunks */
    const results = await vectorStore.similaritySearch(
      args.query,
      6,
      (doc) => doc.metadata.fileId === args.fileId
    );

    return results.map(r => ({
          pageContent: r.pageContent,
          metadata: r.metadata,
    }));
  },
});