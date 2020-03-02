function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Sort", functionName: "sort"},
                     {name: "Generate Weibo", functionName: "generateWeibo"}];

  ss.addMenu("My Menu", menuEntries);
}