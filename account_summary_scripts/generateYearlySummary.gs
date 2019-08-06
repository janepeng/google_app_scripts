
function processSumFormula(sheet, row, col, nonEssentials) {
  var formula = sheet.getRange(row, col).getFormula();
  var cells = formula.split('(')[1];
  cells = cells.split(')')[0];
  cells = cells.split('+');
  for (var i = 0; i < cells.length; i++) {
    var range = sheet.getRange(cells[i]);
    var c = range.getColumn();
    var r = range.getRow();
    var value = sheet.getRange(r, c-1).getValue();
    nonEssentials.push(value);
  }
  Logger.log(nonEssentials.length);
  return nonEssentials;
}

function setValues(sheet, row, col, obj) {
  if (JSON.stringify(obj) === JSON.stringify({})) {
    return;
  }
  var header = [];
  var values = [];
  for (var key in obj) {
    header.push([key]);
    values.push([obj[key]]);
  }
  sheet.getRange(row, col, header.length).setValues(header);
  sheet.getRange(row, col+1, values.length).setValues(values);
}

function writeToSheet(sheet, summaryFields) {
  var green = "#d9e9d4";
  var orange = "#fbe5ce";

  var beginRow = sheet.getLastRow() + 2;
  // put year in
  var yearCell = sheet.getRange(beginRow, 1);
  yearCell.setValue(summaryFields.year);
  yearCell.setHorizontalAlignment("center");
  // deposits
  setValues(sheet, beginRow, 2, summaryFields.deposits);
  // withdraws
  //   essentials
  setValues(sheet, beginRow, 4, summaryFields.withdraws.essentials);
  //   fashion
  setValues(sheet, beginRow, 6, summaryFields.withdraws.fashion);
  //   hobby
  setValues(sheet, beginRow, 8, summaryFields.withdraws.hobby);
  //   travel
  setValues(sheet, beginRow, 10, summaryFields.withdraws.travel);
  //   health
  setValues(sheet, beginRow, 12, summaryFields.withdraws.health);
  //   others
  setValues(sheet, beginRow, 14, summaryFields.withdraws.others);
  // totals
  var totalRow = sheet.getLastRow() + 1;
  // deposits
  var depositTotal = sheet.getRange(totalRow, 2, 1, 2);
  depositTotal.mergeAcross();
  depositTotal.setFormula("=SUM(C"+beginRow.toString()+":C"+(totalRow-1).toString()+")")
  depositTotal.setBackground(green);
  depositTotal.setHorizontalAlignment("center");
  // essentials
  var essentialTotal = sheet.getRange(totalRow, 4, 1, 2);
  essentialTotal.mergeAcross();
  essentialTotal.setFormula("=SUM(E"+beginRow.toString()+":E"+(totalRow-1).toString()+")")
  essentialTotal.setBackground(orange);
  essentialTotal.setHorizontalAlignment("center");
  // fashion
  var fashionTotal = sheet.getRange(totalRow, 6, 1, 2);
  fashionTotal.mergeAcross();
  fashionTotal.setFormula("=SUM(G"+beginRow.toString()+":G"+(totalRow-1).toString()+")")
  fashionTotal.setBackground(orange);
  fashionTotal.setHorizontalAlignment("center");
  // hobby
  var hobbyTotal = sheet.getRange(totalRow, 8, 1, 2);
  hobbyTotal.mergeAcross();
  hobbyTotal.setFormula("=SUM(I"+beginRow.toString()+":I"+(totalRow-1).toString()+")")
  hobbyTotal.setBackground(orange);
  hobbyTotal.setHorizontalAlignment("center");
  // travel
  var travelTotal = sheet.getRange(totalRow, 10, 1, 2);
  travelTotal.mergeAcross();
  travelTotal.setFormula("=SUM(K"+beginRow.toString()+":K"+(totalRow-1).toString()+")")
  travelTotal.setBackground(orange);
  travelTotal.setHorizontalAlignment("center");
  // health
  var healthTotal = sheet.getRange(totalRow, 12, 1, 2);
  healthTotal.mergeAcross();
  healthTotal.setFormula("=SUM(M"+beginRow.toString()+":M"+(totalRow-1).toString()+")")
  healthTotal.setBackground(orange);
  healthTotal.setHorizontalAlignment("center");
  // others
  var othersTotal = sheet.getRange(totalRow, 14, 1, 2);
  othersTotal.mergeAcross();
  othersTotal.setFormula("=SUM(O"+beginRow.toString()+":O"+(totalRow-1).toString()+")")
  othersTotal.setBackground(orange);
  othersTotal.setHorizontalAlignment("center");
  // total total
  var total = sheet.getRange(totalRow, 16);
  total.setFormula("=SUM(D"+totalRow+":N"+totalRow+")");
  total.setHorizontalAlignment("center");
  // essential
  var essentialsTotal = sheet.getRange(totalRow, 17);
  essentialsTotal.setFormula("=D"+totalRow.toString()+"/B"+totalRow.toString())
  essentialsTotal.setHorizontalAlignment("center");
  essentialsTotal.setNumberFormat("#.##%");
  // non-essential
  var nonEssens = ['F', 'H', 'J', 'L'];
  var nominator = "";
  for (var i = 0; i < nonEssens.length; i++) {
    nominator += nonEssens[i] + totalRow.toString() + "+";
  }
  nominator = nominator.substring(0, nominator.length - 1);
  var nonEssentialsTotal = sheet.getRange(totalRow, 18);
  nonEssentialsTotal.setFormula("=("+nominator.toString()+")/B"+totalRow.toString());
  nonEssentialsTotal.setHorizontalAlignment("center");
  nonEssentialsTotal.setNumberFormat("#.##%");
}

function generateYearlySummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheetName = sheet.getSheetName();
  if (isNaN(sheetName)) {
    DocumentApp.getUi().alert("You cannot generate summary on this sheet, please select another one");
    return;
  }
  
  var summaryFields = {
    'year': sheetName,
    'deposits': {},
    'withdraws': {
      'essentials': {},
      'fashion': {},
      'hobby': {},
      'travel': {},
      'health': {},
      'others': {}
    }
  };
  var nonEssentials = [];
  // keywords
  var discards = ['ANYTHING YOU WANNA IGNORE'];
  var essentials = ['DEFINE YOUR ESSENTIALS'];
  var fashion = ['DEFINE YOUR FASHION'];
  var hobby = ['DEFINE YOUR HOBBY'];
  var travel = ['DEFINE YOUR TRAVEL'];
  var health = ['DEFINE YOUR HEALTH'];

  var data = sheet.getDataRange().getValues();
  // start from 1 to skip header
  for (var i = 1; i < data.length; i++) {
    // we can skip date column
    for (var j = 3; j < data[i].length; j+=2) {
      if (j == 3 && data[i][j] && discards.indexOf(data[i][j]) < 0) {
        if (summaryFields['deposits'].hasOwnProperty(data[i][j])) {
          summaryFields['deposits'][data[i][j]] += data[i][j+1];
        } else {
          summaryFields['deposits'][data[i][j]] = data[i][j+1];
        }
      } else if ((j == 5 || j == 8 || j == 10 || j == 12) && data[i][j]) {
        var placeToSave = summaryFields['withdraws']['others'];
        if (discards.indexOf(data[i][j]) < 0) {
          if (essentials.indexOf(data[i][j]) >= 0) {
            placeToSave = summaryFields['withdraws']['essentials'];
          } else if (fashion.indexOf(data[i][j]) >= 0) {
            placeToSave = summaryFields['withdraws']['fashion'];
          } else if (hobby.indexOf(data[i][j]) >= 0) {
            placeToSave = summaryFields['withdraws']['hobby'];
          } else if (travel.indexOf(data[i][j]) >= 0) {
            placeToSave = summaryFields['withdraws']['travel'];
          } else if (health.indexOf(data[i][j]) >= 0) {
            placeToSave = summaryFields['withdraws']['health'];
          }
          if (!isNaN(data[i][j+1])) {
            if (placeToSave.hasOwnProperty(data[i][j])) {
              placeToSave[data[i][j]] += data[i][j+1];
            } else {
              placeToSave[data[i][j]] = data[i][j+1];
            }
          }
        }
      }
    }
  }
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("temp");
  summarySheet.clear();
  writeToSheet(summarySheet, summaryFields);
}
