export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();

        let detectedCMS = "Unknown";
        if (html.includes("wp-content") || html.includes("wp-admin")) {
            detectedCMS = "WordPress";
        } else if (html.includes("Joomla") || html.includes("joomla.css")) {
            detectedCMS = "Joomla";
        } else if (html.includes("sites/default") || html.includes("drupal.js")) {
            detectedCMS = "Drupal";
        } else if (html.includes("Magento") || html.includes("static/version")) {
            detectedCMS = "Magento";
        }

        res.status(200).json({ detectedCMS });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}
