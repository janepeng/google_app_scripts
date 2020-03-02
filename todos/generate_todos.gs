var backgroundColor = "#eee";
var todos = [];
var numRows = 3;
var numCols = 6;
var startDate = new Date();

function _getSettings() {
  var templateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var data = templateSheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][0] == "Header background color") {
        // if there's a valid hex color input
        var isColorValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(data[i][1]);
        Logger.log(i.toString(), j.toString());
        if (isColorValid) {
          backgroundColor = data[i][1];
        } else {
          // get color from background
          backgroundColor = templateSheet.getRange(i+1, 2).getBackground();
        }
        break;
      } else if (data[i][0] == "Todos" && j != 0) {
        todos.push([data[i][j]]);
      } else if (data[i][0] == "Number of List Horizontally") {
        numCols = parseInt(data[i][1], 10) || numCols;
        break;
      } else if (data[i][0] == "Number of List Vertically") {
        numRows = parseInt(data[i][1], 10) || numRows;
        break;
      } else if (data[i][0] == "Start Date") {
        startDate = new Date(data[i][1]);
        break;
      }
    }
  }
}

function generateToDoHorizontally(sheet, row, startCol) {
  for (var i = 0; i < numCols; i++) {
    var col = startCol + i*3;
    // Logger.log("******** generateToDoHorizontally");
    sheet.getRange(row, col, 1, 2).mergeAcross();
    var dateCell = sheet.getRange(row, col, 1, 1);
    dateCell.setNumberFormat("text");
    dateCell.setValue(Utilities.formatDate(startDate, "GMT", "EEE, MMM d"));
    dateCell.setHorizontalAlignment("center");
    dateCell.setBackground(backgroundColor);
    startDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
    
    var checkboxes = sheet.getRange(row+1, col, todos.length);
    checkboxes.setValue("☐");
    checkboxes.setHorizontalAlignment("center");
    sheet.setColumnWidth(col, 30);
    
    var todoCells = sheet.getRange(row+1, col+1, todos.length);
    todoCells.setValues(todos);
    todoCells.setHorizontalAlignment("left");
    sheet.autoResizeColumn(col+1);
    
    // placeholder column
    sheet.setColumnWidth(col+2, 30);
    // Logger.log("******** end of generateToDoHorizontally");
  }
}

function generateToDoVertically(sheet, startRow, startCol) {
  for (var i = 0; i < numRows; i++) {
    var row = startRow + i*(todos.length+2);
    generateToDoHorizontally(sheet, row, startCol);
  }
}

function generateToDo() {
  _getSettings();
  Logger.log(backgroundColor);
  Logger.log(todos);
  Logger.log(numRows);
  Logger.log(numCols);
  Logger.log(startDate);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = sheet.getSheetName();
  if (sheetName == "Settings") {
    alert("You cannot generate todo on this sheet, please select another one");
    return;
  }
  sheet.clear();
  generateToDoVertically(sheet, 1, 1);
}
