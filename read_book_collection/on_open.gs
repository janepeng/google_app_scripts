function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Sort", functionName: "sortSheet"}, 
                     {name: "Move Columns", functionName: "moveColumns"},
                     {name: "Check Missing Titles", functionName: "checkMissingTitles"},
                     {name: "Get Fav Authors", functionName: "WriteFavAuthors"},
                     {name: "Add to All", functionName: "addToAll"}];

  ss.addMenu("My Menu", menuEntries);
}