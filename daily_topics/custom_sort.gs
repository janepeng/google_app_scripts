var sortOrder = ["Today","Week","Recent","Favorite","If","Future"];

function sortByPinyin(valA, valB) {
  var valA_in_pinyin = Pinyin.convertToPinyin(valA, null, true);
  var valB_in_pinyin = Pinyin.convertToPinyin(valB, null, true);
  if (valA_in_pinyin < valB_in_pinyin) {
    return -1;
  } else if (valA_in_pinyin > valB_in_pinyin) {
    return 1;
  } else {
    return 0;
  }
}

function sortByOrder(valA, valB) {
  var indexA = -1, indexB = -1;
  for (var index = 0; index < sortOrder.length; ++index) {
    if (valA.indexOf(sortOrder[index]) > -1) {
      indexA = index;
    }
    if (valB.indexOf(sortOrder[index]) > -1) {
      indexB = index;
    }
    if (indexA != -1 && indexB != -1) {
      break;
    }
  }
  if (indexA == -1) {
    indexA = sortOrder.length;
  }
  if (indexB == -1) {
    indexB = sortOrder.length;
  }
  return indexA - indexB;
}

function sort() {
  if (!Pinyin.isSupported()) {
    return;
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All");
  var data = sheet.getDataRange().getValues();
  var header = data.shift(), valA, valB;
  data.sort(function(x, y) {
    return sortByPinyin(x[1], y[1]);
  });
  data.sort(function(x, y) {
    return sortByOrder(x[0], y[0]);
  });
  data.unshift(header);
  sheet.getDataRange().setValues(data);
}