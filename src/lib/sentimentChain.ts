import { ChatGroq } from "@langchain/groq";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import type { Review, AIInsight } from "@/types/movie";

const schema = z.object({
    summary: z.string(),
    sentiment: z.enum(["Positive", "Mixed", "Negative"]),
});

const parser = StructuredOutputParser.fromZodSchema(schema);

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a professional film critic. Analyze the provided movie reviews and return a JSON object with two fields:
- summary: A 2-3 sentence editorial summary of the general critical reception.
- sentiment: One of "Positive", "Mixed", or "Negative" based on overall tone.

{format_instructions}`,
    ],
    ["human", "Movie reviews:\n\n{reviews}"],
]);

export async function analyzeSentiment(reviews: Review[]): Promise<AIInsight> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const model = new ChatGroq({
        apiKey,
        model: "openai/gpt-oss-20b",
        temperature: 0.3,
    });

    const chain = prompt.pipe(model).pipe(parser);

    const reviewText = reviews
        .map((r) => `[${r.author}]: ${r.content}`)
        .join("\n\n");

    const result = await chain.invoke({
        reviews: reviewText,
        format_instructions: parser.getFormatInstructions(),
    });

    return result as AIInsight;
}
