export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await fetch(url, { method: "HEAD" });
        const headers = response.headers;

        const securityHeaders = {
            xssProtection: headers.get("x-xss-protection") || "❌ Missing",
            contentSecurityPolicy: headers.get("content-security-policy") || "❌ Missing",
            hsts: headers.get("strict-transport-security") || "❌ Missing",
        };

        res.status(200).json({ securityHeaders });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch security data" });
    }
}
