# google_app_scripts
scripts for google apps such as google sheets

## Account Summary Scripts

### Usage

In Google Sheet, create a new spreadsheet, setup the spreadsheet with 3 sheets

- one for your account summary to input your spendings, it doesn't matter what you name it but the current year is preferred as it will show up in the generated yearly summary.

Format as follows:
![sample](https://github.com/janepeng/google_app_scripts/account_summary_scripts/setup.png)

- one named 'temp' since the script requires that sheet to exist to dump data to, this sheet is cleared whenever the script is executed

- one of your actual yearly summary so that you can copy the generated summary to your sheet to store.

- once you have the above setup, click Tools and then <> Script editor

- copy onOpen.gs and generateYearlySummary.gs into your script editor project, reload your sheet, you should see My Menu.

- Navigate to your current year's account statements sheet, click My Menu and run it, you will see the result in temp sheet.

Sample output:
![sample output](https://github.com/janepeng/google_app_scripts/account_summary_scripts/output.png)

### onOpen.gs

- creates a menu item called My Menu and link script to a button so that you can trigger the script on a button click.

### generateYearlySummary.gs

- fill in the keywords section, so that items will be categoried as you wish.