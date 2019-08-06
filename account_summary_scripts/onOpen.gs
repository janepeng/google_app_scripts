function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Generate Yearly Summary", functionName: "generateYearlySummary"}];

  ss.addMenu("My Menu", menuEntries);
}
