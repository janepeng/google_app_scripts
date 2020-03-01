
function getFavAuthors() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('All');
  var data = sheet.getDataRange().getValues();
  var endFav = '不错';
  var authors = [];
  for (var row = 1; row < data.length; row++) {
    if (data[row][1] == endFav) { // 1 b/c 观后感 is in column 1
      break;
    }
    // 4 b/c 作者 is in column 4
    authors.push(data[row][4]);
  }
  Logger.log(authors)
  var uniqueAuthors = [];
  authors.forEach(function(author){
    if (uniqueAuthors.indexOf(author) === -1){
        uniqueAuthors.push(author);
    }                   
  });
  Logger.log(uniqueAuthors);
  return uniqueAuthors;
}

function WriteFavAuthors() {
  var tempSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("temp");
  var authors = getFavAuthors();
  Logger.log(authors.join("','"));
  var authorsInRows = [];
  for (var i = 0; i < authors.length; i++) {
    authorsInRows.push([authors[i]]);
  }
  Logger.log(authorsInRows);
  // tempSheet.getRange(1, 1).setValue(authors.join("', '"));
  tempSheet.getRange(1, 1, authors.length, 1).setValues(authorsInRows);
}
