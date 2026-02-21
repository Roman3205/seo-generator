import { openai } from "~~/server/utils/openai"
import promptData, { SeoMetadata } from '~~/types/seo-prompt'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, promptData.parse)

    const prompt = `
        You are an expert SEO specialist. Generate comprehensive SEO content for a website with the following details:

        Website Title: ${body.title}
        Theme/Industry: ${body.industry}
        Target Audience: ${body.audience || "General"}
        Main Keywords: ${body.keywords || "Not specified"}
        Website Description: ${body.description || "Not provided"}
        Website URL: ${body.url || "example.com"}

        Generate the following SEO elements:
        1. Optimized Meta Title (50-60 characters, compelling and keyword-rich)
        2. Meta Description (150-160 characters, engaging with call-to-action)
        3. Primary Keywords (5-7 most important keywords)
        4. Secondary Keywords (5-7 related long-tail keywords)
        5. Open Graph Title (for social sharing)
        6. Open Graph Description (for social sharing)
        7. Twitter Card Description
        8. H1 Heading suggestion
        9. 3 H2 Heading suggestions
        10. Schema.org type recommendation
        11. 3 SEO tips specific to this website

        Make the content engaging, professional, and optimized for search engines.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{role: "user", content: prompt}],
        temperature: 0.5,
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: "seo",
                schema: {
                    type: "object",
                    additionalProperties: false,
                    required: [
                    "metaTitle",
                    "metaDescription",
                    "primaryKeywords",
                    "secondaryKeywords",
                    "ogTitle",
                    "ogDescription",
                    "twitterDescription",
                    "h1Suggestion",
                    "h2Suggestions",
                    "schemaType",
                    "seoTips"],
                    properties: {
                        metaTitle: { type: "string" },
                        metaDescription: { type: "string" },
                        primaryKeywords: { type: "array", items: { type: "string" } },
                        secondaryKeywords: { type: "array", items: { type: "string" } },
                        ogTitle: { type: "string" },
                        ogDescription: { type: "string" },
                        twitterDescription: { type: "string" },
                        h1Suggestion: { type: "string" },
                        h2Suggestions: { type: "array", items: { type: "string" } },
                        schemaType: { type: "string" },
                        seoTips: { type: "array", items: { type: "string" } }
                    }
                }
            }
        }
    })

    if (!response || !response.choices[0]?.message.content) {
        throw createError({
            statusCode: 400,
            message: "Invalid generating"
        })
    }

    const parsedSeoResult = JSON.parse(response.choices[0].message.content) as SeoMetadata

    const seoResult = await prisma.seoResult.create({data: {title: body.title, url: body.url, ...parsedSeoResult, userId: event.context.userId}})
    return seoResult.id
})