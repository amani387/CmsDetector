import { JSDOM } from "jsdom";

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const title = document.querySelector("title")?.textContent || "No Title";
        const description = document.querySelector("meta[name='description']")?.content || "No Meta Description";
        const keywords = document.querySelector("meta[name='keywords']")?.content || "No Keywords Found";

        res.status(200).json({ title, description, keywords });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch SEO data" });
    }
}
