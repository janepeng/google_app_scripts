function addToAll() {
  // get fav authors
  var favAuthors = getFavAuthors();
  // check missing titles
  var currentYear = (new Date()).getYear();
  var titles = [];
  var map = {};
  var results;
  var startYear = 2020;
  for (var year = startYear; year <= currentYear; year++) {
    results = _getTitles(year.toString(), titles, map);
    titles = results.titles;
    map = results.map;
  }
  var allTitles = _getTitles("All", []);
  var diffs = titles.filter(function(i) {return allTitles.indexOf(i) < 0;});

  Logger.log(diffs)
  // put missing title lines in temp sheet
  var tempSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("temp");
  if (diffs.length) {
    var info, sheetName, row, sheet;
    var data = [];
    var maxCol = 1;
    for (var i = 0; i < diffs.length; i++) {
      info = map[diffs[i]].split(':');
      sheetName = info[0];
      row = parseInt(info[1], 10) + 2; // +1 for offset, +1 for header row
      
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      data.push(sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0]);
      maxCol = Math.max(sheet.getLastColumn(), maxCol);
      Logger.log(data)
    }
    tempSheet.getRange(1, 1, data.length, maxCol).setValues(data); 
    // move column on temp sheet
    moveColumns();
    // copy temp sheet to all
    var orderedData = tempSheet.getRange(1, 1, data.length, maxCol).getValues(); 
    var allSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All");
    var lastRow = allSheet.getLastRow();
    if (lastRow + data.length + 10 >= allSheet.getMaxRows()) {
      allSheet.insertRows(data.length);
    }
    allSheet.getRange(lastRow+2, 1, data.length, maxCol).setValues(orderedData);
    // sort all
    sortSheet();
    // clear temp
    tempSheet.clear();
    // get fav authors
    var newFavAuthors = getFavAuthors();
    if (favAuthors.length < newFavAuthors.length) {
      var newAuthors = newFavAuthors.filter(function(i) {return favAuthors.indexOf(i) < 0;});
      // tempSheet.getRange(1, 1).setValue(newAuthors.join("', '"));
      var authorsInRows = [];
      for (var i = 0; i < newAuthors.length; i++) {
        authorsInRows.push([newAuthors[i]]);
      }
      tempSheet.getRange(1, 1, newAuthors.length, 1).setValues(authorsInRows);
    } else {
      showAlert("No change in authors");
    }
  } else {
    if (allTitles.length != titles.length) {
      showAlert("There might be duplicate titles");
    } else {
      showAlert("No missing titles found");
    }
  }
}

function showAlert(message) {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(message, ui.ButtonSet.OK);
}






