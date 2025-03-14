import puppeteer from "puppeteer";

export default async function handler(req, res) {
    const { url, seo, security, mobile, cms } = req.body;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(`
            <h1>Website Analysis Report</h1>
            <p><strong>URL:</strong> ${url}</p>
            <p><strong>CMS Detected:</strong> ${cms}</p>
            <p><strong>SEO Analysis:</strong> ${seo}</p>
            <p><strong>Security Check:</strong> ${security}</p>
            <p><strong>Mobile Friendliness:</strong> ${mobile}</p>
        `);
        const pdfBuffer = await page.pdf();
        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="report.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ error: "Failed to generate report" });
    }
}
