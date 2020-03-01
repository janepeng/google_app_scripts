function arrayMoveColumn(data, from, to) {
  if (from >= data[0].length || to >= data[0].length) {
    throw new Error('index out of bounds');
  }
  for (var row=0; row < data.length; row++) {
    var temp = data[row].splice(from, 1);
    data[row].splice(to, 0, temp[0]);
  }
  return data;
}

function moveColumns() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("temp");
  var data = sheet.getDataRange().getValues();
  data = arrayMoveColumn(data, 8, 1);
  data = arrayMoveColumn(data, 8, 2);
  data = arrayMoveColumn(data, 8, 3);
  data = arrayMoveColumn(data, 9, 5);
  sheet.getDataRange().setValues(data);
}