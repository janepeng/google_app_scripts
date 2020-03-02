
function increaseStartDate() {
  var startDate, numCols, numRows, newStartDateCell;
  var templateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var data = templateSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0].toLowerCase() == "start date") {
      startDate = new Date([data[i][1]]);
      newStartDateCell = templateSheet.getRange(i+1, 3);
    } else if (data[i][0] == "Number of List Horizontally") {
      numCols = parseInt(data[i][1], 10);
    } else if (data[i][0] == "Number of List Vertically") {
      numRows = parseInt(data[i][1], 10);
    }  else if (data[i][0].toLowerCase() == "summary start date") {
      var summaryDate = new Date(data[i][1]);
      // increase by a month
      summaryDate.setMonth(summaryDate.getMonth()+1);
      var summaryDateCell = templateSheet.getRange(i+1, 3);
      summaryDateCell.setNumberFormat("text");
      summaryDateCell.setValue(Utilities.formatDate(summaryDate, "GMT", "MMMM d, YYYY"));
    }
  }
  var numDaysToIncrease = numCols * numRows;
  startDate.setDate(startDate.getDate() + numDaysToIncrease);
  newStartDateCell.setNumberFormat("text");
  newStartDateCell.setValue(Utilities.formatDate(startDate, "GMT", "MMMM d, YYYY"));
}
