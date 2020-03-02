var weiboTemplatePrefix = "";

var weiboTemplatePostfix = "";

function generateWeibo() {
  var content = weiboTemplatePrefix;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  
  var data = sheet.getRange(cell.getRow(), cell.getColumn(), 10, 2).getValues();
  var date, month, day, val;
  
  for (var row = 0; row < data.length; row++) {
    date = new Date(data[row][0]);
    month = date.getMonth()+1;
    day = date.getDate();
    val = data[row][1];
    content += month + '月' + day + '日：' + val + '\r\n';
  }
  
  content += weiboTemplatePostfix;

  SpreadsheetApp.getUi().alert(content);
}
