function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Generate TODO List", functionName: "generateToDo"}, 
                     {name: "Generate Summary Page", functionName: "generateSummary"},
                     {name: "Generate Chart", functionName: "generateChart"},
                     {name: "Increase StartDate", functionName: "increaseStartDate"}];

  ss.addMenu("My Menu", menuEntries);
}
