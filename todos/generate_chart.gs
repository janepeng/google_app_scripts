var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var specialExpectations = {
  "Item": []
};
var backgroundColor = "#d9e9d4";

function makeSummaryPrettier(sheet) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    for (var j = 3; j < data[i].length; j++) {
      if (data[i][j] || sheet.getRange(i+1, j+1).getBackground() != "#ffffff") {
        // add background color
        sheet.getRange(i+1, j+1).setBackground(backgroundColor);
      }
    }
  }
  // remove data
  sheet.getRange(2, 4, sheet.getLastRow(), sheet.getLastColumn()).setValue("");
}

function caculateYearlySum(sheet, currentDate) {
  var data = sheet.getDataRange().getValues();
  var summary = {};  // maps todo: completion count
  var todos = [];
  var numDays = {'total': 0};  // maps dayOfWeek: number of days

  for (var i = 0; i < data.length; i++) {
    var monthYear = new Date(data[i][0]);
    if (monthYear.getTime() > 0) {
      numDays['total'] += days[monthYear.getMonth()];
      for (var j = 1; j <= days[monthYear.getMonth()]; j++) {
        var date = new Date(monthYear.getYear(), monthYear.getMonth(), j);
        if (numDays.hasOwnProperty(date.getDay())) {
          numDays[date.getDay()] += 1;
        } else {
          numDays[date.getDay()] = 1;
        }
      }
    }
    if (data[i][1] != "") {
      if (summary.hasOwnProperty(data[i][0])) {
        summary[data[i][0]] += data[i][1];
      } else {
        summary[data[i][0]] = data[i][1];
      }
      if (todos.indexOf(data[i][0]) == -1) {
        todos.push(data[i][0]);
      }
    }
  }

  // generate a separate summary table at the end of the sheet
  var beginRow = sheet.getLastRow() + 2;
  // make sure there's enough rows to put data
  if (sheet.getMaxRows() < sheet.getLastRow() + todos.length) {
    sheet.insertRows(sheet.getLastRow()+1, todos.length);
  }

  var headers = [[currentDate.getYear()]];
  for (var i = 0; i < todos.length; i++) {
    headers.push([todos[i]]);
  }
  var headerCells = sheet.getRange(beginRow, 1, headers.length);
  headerCells.setHorizontalAlignment("right");
  sheet.getRange(beginRow, 1).setHorizontalAlignment("center");
  headerCells.setValues(headers);

  var summaryCounts = [];
  for (var i = 0; i < todos.length; i++) {
    summaryCounts.push([summary[todos[i]]]);
  }
  var summaryCells = sheet.getRange(beginRow + 1, 2, summaryCounts.length);
  summaryCells.setValues(summaryCounts);

  var completions = [];
  for (var i = 0; i < todos.length; i++) {
    var expectedDays = numDays['total'];
    if (specialExpectations.hasOwnProperty(todos[i])) {
      expectedDays = 0;
      for (var j = 0; j < specialExpectations[todos[i]].length; j++) {
        expectedDays += numDays[specialExpectations[todos[i]][j]-1];
      }
    }
    completions.push([summaryCounts[i][0]*100/expectedDays]);
  }

  var completionsCells = sheet.getRange(beginRow + 1, 3, completions.length);
  completionsCells.setNumberFormat("0");
  completionsCells.setValues(completions);
  
  return [beginRow + 1, beginRow + todos.length];
}

function calculateSum(sheet, currentDate) {
  if (sheet.getLastColumn() <= 32) {
    // add two columns, sum and completion
    sheet.insertColumns(2, 2);
  }
  var data = sheet.getDataRange().getValues();
  var sum = [];
  var todos = [];
  var numDays = {};
  
  for (var i = 1; i < data.length; i++) {
    var subSum = 0;
    todos.push(data[i][0]);
    for (var j = 3; j < data[i].length; j++) {
      var date = new Date(currentDate.getYear(), currentDate.getMonth(), j-2);
      // putting i == 1 here b/c we only want to process for one row. one row should cover a month of days.
      if (i == 1 && numDays.hasOwnProperty(date.getDay())) {
        numDays[date.getDay()] += 1;
      } else if (i == 1) {
        numDays[date.getDay()] = 1;
      }
      if (data[i][j] || sheet.getRange(i+1, j+1).getBackground() != "#ffffff") {
        subSum += 1;
      }
    }
    sum.push([subSum]);
  }
  Logger.log(sum)
  Logger.log("test")
  var sumCells = sheet.getRange(2, 2, sheet.getLastRow()-1);
  sumCells.setValues(sum);
  var completions = [];
  for (var i = 0; i < todos.length; i++) {
    var expectedDays = days[currentDate.getMonth()];
    if (specialExpectations.hasOwnProperty(todos[i])) {
      expectedDays = 0;
      for (var j = 0; j < specialExpectations[todos[i]].length; j++) {
        expectedDays += numDays[specialExpectations[todos[i]][j]-1];
      }
    }
    Logger.log("expectedDays")
    Logger.log(expectedDays);
    Logger.log(sum[i][0])
    completions.push([sum[i][0]*100/expectedDays]);
  }
  Logger.log(completions)
  return;
  var completionsCells = sheet.getRange(2, 3, sheet.getLastRow()-1);
  completionsCells.setNumberFormat("0");
  completionsCells.setValues(completions);
}

function generateChart() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var sheetName = sheet.getSheetName();
  if (sheetName == "Settings") {
    DocumentApp.getUi().alert("You cannot generate chart on this sheet, please select another one");
    return;
  }
  var generatingYearlySummary = false;
  var monthCell = sheet.getRange(1, 1);
  var currentDate = new Date(monthCell.getValue());
  var range, title;
  if (/^(\d{4})$/.test(sheetName)) {
    generatingYearlySummary = true;
    var rows = caculateYearlySum(sheet, currentDate);
    range = sheet.getRange("A" + rows[0].toString() + ":" + "C" + rows[1].toString());
  } else {
    calculateSum(sheet, currentDate);
  }
  
  if (generatingYearlySummary) {
    title = currentDate.getYear().toString() + ' Summary';
  } else {
    range = sheet.getRange("A2:" + "C" + sheet.getLastRow().toString());
    // this will return "April 1, 2017 12:00:00 AM PDT"
    var formatedDate = monthCell.getValue().toLocaleString('en-US', {year: 'numeric', month: 'long'}).split(' ');
    title = formatedDate[0] + ' ' + formatedDate[2] + ' Summary';
  }
  var charts = sheet.getCharts();
  if (charts.length) {
    var chart = charts[0].modify()
                        .addRange(range)
                        .setOption('title', title)
                        .setPosition(7, 3, 1, 1)
                        .build();
    sheet.updateChart(chart);
  } else {
    var chartBuilder = sheet.newChart();
    chartBuilder.addRange(range)
                .setChartType(Charts.ChartType.BAR)
                .setPosition(7, 3, 1, 1)
                .setOption('title', title);
    sheet.insertChart(chartBuilder.build());
  }
  if (!generatingYearlySummary) {
    makeSummaryPrettier(sheet);
  }
}





