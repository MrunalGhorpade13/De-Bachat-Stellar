/**
 * De-Bachat Survey Automator
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Click "New Project"
 * 3. Paste this code and click "Run" (the play icon)
 * 4. Your form is created instantly!
 */

function createDeBachatForm() {
  const formName = "De-Bachat User Onboarding & Feedback";
  const form = FormApp.create(formName);
  
  form.setTitle(formName)
      .setDescription("Help us validate the De-Bachat ROSCA MVP! Your feedback helps us build the future of decentralized savings.\n\nLIVE APP LINK: https://de-bachat-stellar.vercel.app/");

  // Question 1: Name
  form.addTextItem()
      .setTitle("Full Name")
      .setRequired(true);

  // Question 2: Email
  form.addTextItem()
      .setTitle("Email Address")
      .setRequired(true);

  // Question 3: Stellar Wallet Address
  form.addTextItem()
      .setTitle("Stellar Testnet Wallet Address")
      .setHelpText("The address you used to join the ROSCA group.")
      .setRequired(true);

  // Question 4: Application Rating
  form.addScaleItem()
      .setTitle("How would you rate the De-Bachat Dashboard experience?")
      .setBounds(1, 5)
      .setLabels("Poor", "Excellent")
      .setRequired(true);

  // Question 5: Feedback
  form.addParagraphTextItem()
      .setTitle("What was the hardest part about joining or contributing?")
      .setRequired(false);

  // Question 6: Feature Suggestion
  form.addParagraphTextItem()
      .setTitle("What one feature should we add next?")
      .setRequired(true);

  console.log('Form URL: ' + form.getEditUrl());
  console.log('Published URL: ' + form.getPublishedUrl());
  
  const ui = SpreadsheetApp.getUi ? SpreadsheetApp.getUi() : null;
  if (ui) {
    ui.alert('Form Created Successfully! URL: ' + form.getPublishedUrl());
  }
}
