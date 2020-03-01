var startYear = 2014;

function _getTitles(sheetName, titles, titleToRowCol) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet) {
    var titleColumn = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
    for (var i in titleColumn) {
      for (var j in titleColumn[i]) {
        titles.push(titleColumn[i][j]);
        if (titleToRowCol) {
          titleToRowCol[titleColumn[i][j]] = sheetName + ':' + i.toString();
        }
      }
    }
  }
  if (titleToRowCol) {
    return {'map': titleToRowCol, 'titles': titles}
  }
  return titles;
} 

function checkMissingTitles() {
  var currentYear = (new Date()).getYear();
  var titles = [];
  for (var year = startYear; year <= currentYear; year++) {
    titles = _getTitles(year.toString(), titles);
  }
  Logger.log(titles.length);
  var allTitles = _getTitles("All", []);
  Logger.log(allTitles.length);
  
  var diffs = titles.filter(function(i) {return allTitles.indexOf(i) < 0;});
  var tempSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("temp");
  if (diffs.length) {
    tempSheet.getRange(1, 1).setValue("Out of sync data found:");
    tempSheet.getRange(2, 1, 1, diffs.length).setValues([diffs]);
  } else {
    tempSheet.getRange(1, 1).setValue("No missing titles found");
  }
}
