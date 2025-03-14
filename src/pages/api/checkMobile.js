export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        const hasViewportTag = html.includes('<meta name="viewport"');
        const message = hasViewportTag
            ? "✅ The site is mobile-friendly!"
            : "❌ The site lacks a viewport meta tag, making it non-mobile-friendly.";

        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch mobile data" });
    }
}
