var colorSelections = [];
var todos = [];
var summaryDate = new Date();
var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function leapYear(year) {
  if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
    days[1] = 29;
  } else {
    days[1] = 28;
  }
}
leapYear((new Date()).getYear());

function getSettings() {
  var templateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var data = templateSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][0].toLowerCase() == "color selections" && j != 0) {
        var color = data[i][j];
        // if there's a valid hex color input
        var isColorValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
        if (!isColorValid) {
          // get color from background
          color = templateSheet.getRange(i, j).getBackground();
        }
        colorSelections.push(color);
      } else if (data[i][0].toLowerCase() == "todos" && j != 0) {
        todos.push([data[i][j]]);
      } else if (data[i][0].toLowerCase() == "summary start date") {
        summaryDate = new Date(data[i][1]);
        leapYear(summaryDate.getYear());
        break;
      }
    }
  }
}

function generateHeader(sheet) {
  var daysArray = [];
  for (var i = 1; i <= days[summaryDate.getMonth()]; i++) {
    daysArray.push(i);
  }
  // Logger.log(daysArray);
  for (var i = 2; i <= daysArray.length+1; i++) {
    sheet.setColumnWidth(i, 20);
  }

  var headerCells = sheet.getRange(1, 2, 1, daysArray.length);
  headerCells.setValues([daysArray]);
  headerCells.setHorizontalAlignment("center");
  headerCells.setNumberFormat("0");
  
  var monthCell = sheet.getRange(1, 1);
  monthCell.setNumberFormat("text");
  monthCell.setValue(Utilities.formatDate(summaryDate, "GMT", "MMMM, YYY"));
  monthCell.setHorizontalAlignment("center");
  
  var todoCells = sheet.getRange(2, 1, todos.length);
  todoCells.setValues(todos);
  todoCells.setHorizontalAlignment("right");
  sheet.autoResizeColumn(1);
}

function generateSummary() {
  getSettings();
  // Logger.log(colorSelections);
  // Logger.log(summaryDate);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = sheet.getSheetName();
  if (sheetName == "Settings") {
    DocumentApp.getUi().alert("You cannot generate summary on this sheet, please select another one");
    return;
  }
  sheet.clear();
  Logger.log(sheet.getMaxColumns())
  if (sheet.getMaxColumns() <= 35) {
    sheet.insertColumns(1, 5);
  }
  generateHeader(sheet);
}
