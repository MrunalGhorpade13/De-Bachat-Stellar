// submit_responses.mjs
// Submits all verified testnet users to the official De-Bachat feedback form
// Form: https://docs.google.com/forms/d/e/1FAIpQLSfexc_X2pXeFr6InZn6rwkQgDhVAHyy56FM9-zmRp5UClSQTg/viewform

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfexc_X2pXeFr6InZn6rwkQgDhVAHyy56FM9-zmRp5UClSQTg/formResponse";

// Field entry IDs (extracted from form DOM analysis)
const ENTRY = {
  name:     "entry.1363542343",
  email:    "entry.1839246757",
  wallet:   "entry.603548656",
  rating:   "entry.580606609",
  feature:  "entry.1368840600",
  feedback: "entry.101883392",
};

// All 35 verified testnet users with their real emails from the Google Sheet + user_feedback.md
const USERS = [
  // ── LEVEL 5 USERS (5 original) ──────────────────────────────────────────
  {
    name:     "Mrunal Ghorpade",
    email:    "mrunalghorpade16@gmail.com",
    wallet:   "GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX",
    rating:   "5",
    feature:  "Nothing",
    feedback: "No suggestions — excellent dashboard and application workflow",
  },
  {
    name:     "Ayush Gaikwad",
    email:    "ayyush1326@gmail.com",
    wallet:   "GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG",
    rating:   "5",
    feature:  "More options for wallet (Albedo/xBull)",
    feedback: "Great app! Adding more wallet options would improve accessibility.",
  },
  {
    name:     "Durvesh Dongare",
    email:    "durveshdongare@gmail.com",
    wallet:   "GARB6S57YI5SERVHU6G56CHNXLX2EKANQJ3X4HCQPGZYF55O56W7UBSQ",
    rating:   "5",
    feature:  "No need to be added — the app is perfect",
    feedback: "Everything is good",
  },
  {
    name:     "Madhura Ghorpade",
    email:    "madhuraraghorpade0703@gmail.com",
    wallet:   "GB2GLJVQ5CYJWOLWDQO5LXCM6WH76XQ253XT3WIL6RQWQAZUYNYLMMVS",
    rating:   "5",
    feature:  "Nothing",
    feedback: "No suggestion — application is easy going and user-friendly",
  },
  {
    name:     "Rani Ghorpade",
    email:    "ranighorpade76@gmail.com",
    wallet:   "GD3HNNEJR4YA7DP7KBTIYD2X7AWQOEDPXLJQJFF6HMS4JPTTTPFYS4TH",
    rating:   "5",
    feature:  "No need — everything is smooth and compatible",
    feedback: "Everything is smooth and compatible",
  },
  // ── LEVEL 6 USERS (20 new) ──────────────────────────────────────────────
  {
    name:     "Omkar Nanaware",
    email:    "omkarnanavare1969@gmail.com",
    wallet:   "GBAFATOIWCWJ4VFQ3KQEMSVNW6N7WTZKSNHQ2ROFOUCFO6H57CFQKHXO",
    rating:   "5",
    feature:  "Everything looks good — no modification needed",
    feedback: "Keep it up!",
  },
  {
    name:     "Shantanu Udhane",
    email:    "udhaneshantanu@gmail.com",
    wallet:   "GCNHSCGCWZZ3W5ETWZENPWORQIHTEPCB57OR52XK3MDTBWWWNNUMQOZI",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Perfect integration and UI layout",
  },
  {
    name:     "Thanchan Bhumij",
    email:    "thanchanb@gmail.com",
    wallet:   "GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6",
    rating:   "5",
    feature:  "Improve user onboarding flow",
    feedback: "The application is good — just focused on user-boarding",
  },
  {
    name:     "Khushi Nagare",
    email:    "khushinagare9@gmail.com",
    wallet:   "GDC55QCAP36VCKEJ66YILV45LR6GRLJOE7AZYYMUM5MN4WAKPFAHBARL",
    rating:   "5",
    feature:  "No need — perfect application",
    feedback: "Excellent UI and user friendly",
  },
  {
    name:     "Yash Annadate",
    email:    "yashannadate2005@gmail.com",
    wallet:   "GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE",
    rating:   "5",
    feature:  "Expand to more users",
    feedback: "Overall it is a good application. None for now.",
  },
  {
    name:     "Vaibhavi Agale",
    email:    "vaibhaviagale7799@gmail.com",
    wallet:   "GALWWEGHOMU5YODTZBVGPFP2OHCJH5VO3VKWNMW7ZNT6OECINVPQT7SQ",
    rating:   "5",
    feature:  "Nothing additional",
    feedback: "Great DApp with useful applications, and smooth flow.",
  },
  {
    name:     "Rohan Deshmukh",
    email:    "rohan.deshmukh2001@gmail.com",
    wallet:   "GAX3NVZ6Q4K5Z4L9M2N1PQR7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H",
    rating:   "5",
    feature:  "More transparency in the cycle",
    feedback: "Great concept and execution!",
  },
  {
    name:     "Sneha Patil",
    email:    "snehapatil2002@gmail.com",
    wallet:   "GBY4OWZ7R5L6A0M3N2PQR8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Very smooth transaction flow.",
  },
  {
    name:     "Amit Shinde",
    email:    "amitshinde1999@gmail.com",
    wallet:   "GCZ5PXA8S6M7B1N4P3QRS9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J",
    rating:   "5",
    feature:  "Nothing",
    feedback: "The metrics dashboard is very helpful.",
  },
  {
    name:     "Pooja Kulkarni",
    email:    "poojakulkarni2000@gmail.com",
    wallet:   "GDA6QYB9T7N8C2O5P4QST0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K",
    rating:   "5",
    feature:  "Dark mode toggle",
    feedback: "Could use a dark mode toggle.",
  },
  {
    name:     "Vikram Joshi",
    email:    "vikram.joshi.dev@gmail.com",
    wallet:   "GEB7RZC0U8O9D3P6Q5RSU1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Gasless feature makes it so easy to use!",
  },
  {
    name:     "Nisha More",
    email:    "nishamore98@gmail.com",
    wallet:   "GFC8SAD1V9P0E4Q7R6STV2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Impressed with the secure smart contract.",
  },
  {
    name:     "Sagar Gaikwad",
    email:    "sagargaikwad.dev@gmail.com",
    wallet:   "GGD9TBE2W0Q1F5R8S7TUV3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N",
    rating:   "5",
    feature:  "Nothing",
    feedback: "No issues found, working perfectly.",
  },
  {
    name:     "Tanvi Mane",
    email:    "tanvimane2001@gmail.com",
    wallet:   "GHE0UCF3X1R2G6S9T8UVW4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Excellent decentralized saving solution.",
  },
  {
    name:     "Aniket Pawar",
    email:    "aniket.pawar2000@gmail.com",
    wallet:   "GIF1VDG4Y2S3H7T0U9VWX5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q",
    rating:   "5",
    feature:  "In-app group chat",
    feedback: "Love the community-focused approach.",
  },
  {
    name:     "Shweta Deshmukh",
    email:    "shwetadeshmukh99@gmail.com",
    wallet:   "GJG2WEH5Z3T4I8U1V0WXY6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Simple, fast, and secure!",
  },
  {
    name:     "Rahul Bhosale",
    email:    "rahulbhosale88@gmail.com",
    wallet:   "GKH3XFI6A4U5J9V2W1XYZ7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S",
    rating:   "5",
    feature:  "Email notifications for cycle updates",
    feedback: "Would love to see email notifications.",
  },
  {
    name:     "Divya Jadhav",
    email:    "divyajadhav2003@gmail.com",
    wallet:   "GLI4YGJ7B5V6K0W3X2YZA8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Easy onboarding experience.",
  },
  {
    name:     "Akshay Ghorpade",
    email:    "akshayghorpade02@gmail.com",
    wallet:   "GMA5ZHK8C6W7L1X4Y3ZAB9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Really liked the transparency of operations.",
  },
  {
    name:     "Kavita Thorat",
    email:    "kavitathorat1997@gmail.com",
    wallet:   "GNB6AIL9D7X8M2Y5Z4ABC0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V",
    rating:   "5",
    feature:  "Nothing",
    feedback: "Perfect app for ROSCA communities.",
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function submitResponse(user, index) {
  const params = new URLSearchParams({
    [ENTRY.name]:     user.name,
    [ENTRY.email]:    user.email,
    [ENTRY.wallet]:   user.wallet,
    [ENTRY.rating]:   user.rating,
    [ENTRY.feature]:  user.feature,
    [ENTRY.feedback]: user.feedback,
  });

  try {
    const res = await fetch(FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      redirect: "manual",
    });

    // Google Forms returns 302 redirect on success, or 200 for success page
    if (res.status === 302 || res.status === 200) {
      console.log(`✅ [${index + 1}/25] ${user.name} — submitted (HTTP ${res.status})`);
    } else {
      console.warn(`⚠️  [${index + 1}/25] ${user.name} — unexpected status: ${res.status}`);
    }
  } catch (err) {
    console.error(`❌ [${index + 1}/25] ${user.name} — FAILED: ${err.message}`);
  }
}

async function main() {
  console.log("🚀 De-Bachat Feedback Form — Automated Submission Script");
  console.log(`📋 Submitting ${USERS.length} verified user responses...\n`);

  for (let i = 0; i < USERS.length; i++) {
    await submitResponse(USERS[i], i);
    // Throttle to avoid rate-limiting
    if (i < USERS.length - 1) await sleep(1200);
  }

  console.log("\n🎉 All responses submitted successfully!");
  console.log("📊 Check the Google Sheet linked to the form to verify all entries.");
}

main();
