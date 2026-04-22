/**
 * De-Bachat Fresh Start: Clean Feedback Form Creator
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Click "New Project"
 * 3. Delete any code there and PASTE THIS CODE.
 * 4. Click the "Save" icon (rename to "De-Bachat Form Creator")
 * 5. Click the "Run" button (the play icon).
 * 6. Click "Review Permissions" and allow (it might show a warning, click Advanced -> Go to ...).
 * 
 * Your 100% clean 5-question form will be created instantly!
 */

function createCleanFeedbackForm() {
  const formName = "De-Bachat User Feedback (Verified Participants)";
  const form = FormApp.create(formName);
  
  form.setTitle(formName)
      .setDescription("Help us validate the De-Bachat ROSCA dApp! Your feedback helps us improve the decentralized savings experience.\n\nLIVE DApp: https://de-bachat-stellar.vercel.app/");

  // Question 1: Name
  form.addTextItem()
      .setTitle("Full Name")
      .setRequired(true);

  // Question 2: Email
  form.addTextItem()
      .setTitle("Email Address")
      .setRequired(true);

  // Question 3: Wallet
  form.addTextItem()
      .setTitle("Stellar Testnet Wallet Address")
      .setRequired(true);

  // Question 4: Rating
  form.addScaleItem()
      .setTitle("How would you rate the experience?")
      .setBounds(1, 5)
      .setLabels("Poor", "Excellent")
      .setRequired(true);

  // Question 5: Feedback
  form.addParagraphTextItem()
      .setTitle("Any feedback or suggestions for improvement?")
      .setRequired(true);

  const editUrl = form.getEditUrl();
  const publishedUrl = form.getPublishedUrl();

  console.log('✅ CLEAN FORM CREATED SUCCESSFULLY!');
  console.log('🔗 FORM EDIT LINK (For you): ' + editUrl);
  console.log('🔗 PUBLIC LINK (For users): ' + publishedUrl);
  
  // Create a linked spreadsheet for responses
  const ss = SpreadsheetApp.create(formName + " (Responses)");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  console.log('📊 LINKED SHEET CREATED: ' + ss.getUrl());
}
