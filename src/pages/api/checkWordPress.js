import axios from "axios";
import * as cheerio from "cheerio";

// Helper function for URL validation
const isValidURL = (url) => {
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/.*)?$/;
  return pattern.test(url);
};

// Function to clean the URL and detect unnecessary characters
const cleanUrl = (url) => {
  let cleanedUrl = url.trim();

  // Check for unnecessary special characters at the start
  if (/^[^a-zA-Z0-9]/.test(cleanedUrl)) {
    return { error: "You entered an unnecessary character at the beginning of the URL." };
  }

  // If the URL starts with 'www.', remove it and prepend 'https://'
  if (cleanedUrl.startsWith("www.")) {
    cleanedUrl = "https://" + cleanedUrl.slice(4);
  }

  // If the URL doesn't start with http:// or https://, prepend 'https://'
  if (!cleanedUrl.startsWith("http://") && !cleanedUrl.startsWith("https://")) {
    cleanedUrl = "https://" + cleanedUrl;
  }

  return { cleanedUrl };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { url } = req.body;

  // Clean the URL and check for unnecessary characters
  const { cleanedUrl, error } = cleanUrl(url);

  if (error) {
    return res.status(400).json({ message: error });
  }

  // Validate the URL format after cleaning
  if (!cleanedUrl || !isValidURL(cleanedUrl)) {
    return res.status(400).json({ message: "Invalid URL format. Please provide a valid URL." });
  }

  try {
    // Use the cleaned URL for making the request
    const response = await axios.get(cleanedUrl, { timeout: 5000 });

    // Load HTML into Cheerio for parsing
    const $ = cheerio.load(response.data);

    // Check for WordPress meta tag
    const metaTag = $('meta[name="generator"]').attr("content") || "";
    if (metaTag.includes("WordPress")) {
      return res.json({ isWordPress: true, reason: "Meta tag detected" });
    }

    // Check for "wp-content" and "wp-includes" in the page's HTML
    if (response.data.includes("wp-content") || response.data.includes("wp-includes")) {
      return res.json({ isWordPress: true, reason: "Found 'wp-content' or 'wp-includes'" });
    }

    // Check if "/wp-admin/" page exists
    try {
      await axios.get(`${cleanedUrl}/wp-admin`, { timeout: 3000 });
      return res.json({ isWordPress: true, reason: "wp-admin page exists" });
    } catch (error) {
      // If wp-admin is not accessible, we ignore this failure
    }

    return res.json({ isWordPress: false, reason: "No WordPress signature found" });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: "Error checking site", error: error.response.statusText });
    } else if (error.request) {
      return res.status(500).json({ message: "No response received from site", error: error.message });
    } else {
      return res.status(500).json({ message: "Error checking site", error: error.message });
    }
  }
}
//https://github.com/amani387/cms_detector.git