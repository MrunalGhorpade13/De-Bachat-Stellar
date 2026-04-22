import fs from 'fs';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/export?format=csv';
const FEEDBACK_FILE = "./user_feedback.md";
const README_FILE = "./README.md";

async function syncFeedback() {
  console.log("Fetching latest responses from Google Sheets...");
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const csvData = await response.text();
    const rows = csvData.split("\n").map(r => r.split(","));
    
    // Skip header row
    const users = rows.slice(1).filter(r => r.length > 3 && r[1].trim() !== "");
    
    console.log(`Found ${users.length} total users in spreadsheet.`);
    
    // We update the User Feedback Markdown with the total count and latest entries.
    // For this automation MVP, we will print the exact Markdown rows you can paste!
    
    let participantMd = "";
    let feedbackSummaryMd = "";
    
    users.forEach((user, idx) => {
      // Assuming CSV columns: Timestamp, Name, Email, Wallet, Rating, Feedback
      const [timestamp, name, email, wallet, rating, ...feedbackArr] = user;
      const cleanName = name?.replace(/"/g, '').trim() || "Anonymous";
      const cleanWallet = wallet?.replace(/"/g, '').trim() || "";
      const cleanRating = rating?.replace(/"/g, '').trim() || "5";
      const feedback = feedbackArr.join(",").replace(/"/g, '').trim() || "No additional feedback";
      
      const num = idx + 1;
      participantMd += `| ${num} | ${cleanName} | \`${cleanWallet}\` | ✅ Joined | [Verify](https://stellar.expert/explorer/testnet/account/${cleanWallet}) |\n`;
      feedbackSummaryMd += `| ${cleanName} | ${cleanRating} ⭐ | General | ${feedback} |\n`;
    });
    
    console.log("\n✅ SUCCESSFULLY EXTRACTED DATA. Here are the newly generated Markdown tables:\n");
    console.log("--- PARTICIPANTS TABLE ---");
    console.log(participantMd.slice(0, 1000) + "... (truncated)");
    console.log("\n--- FEEDBACK TABLE ---");
    console.log(feedbackSummaryMd.slice(0, 1000) + "... (truncated)");
    
    console.log("\n🚀 Automation Script Complete. To instantly inject this into your markdown files, we recommend copying the output directly, or expanding this script with `fs.writeFileSync` to overwrite the target tables automatically.");
  } catch(e) {
    console.error("Failed to sync Google Sheets:", e);
  }
}

syncFeedback();
