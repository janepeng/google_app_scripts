var ratingOrdering = ["非常好","很好","蛮好","不错","还好","一般"];

function countScore(rating) {
  var sum = 0;
  for (var i = 0; i < rating.length; i++) {
    if (rating[i] == '+') {
      sum -= 1;
    } else if (rating[i] == '-') {
      sum += 1;
    }
  }
  return sum;
}

function sortFunction(ratingA, ratingB) {
  var indexA = -1, indexB = -1;
  for (var index = 0; index < ratingOrdering.length; ++index) {
    if (ratingA.indexOf(ratingOrdering[index]) > -1) {
      indexA = index;
    }
    if (ratingB.indexOf(ratingOrdering[index]) > -1) {
      indexB = index;
    }
    if (indexA != -1 && indexB != -1) {
      break;
    }
  }
  if (indexA == -1) {
    indexA = ratingOrdering.length;
  }
  if (indexB == -1) {
    indexB = ratingOrdering.length;
  }
  if (indexA == indexB) {
    return countScore(ratingA) - countScore(ratingB);
  }
  return indexA - indexB;
}

function sortSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("All");
  var range = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn());
  range.sort([{column:5, ascending:true}]);

  var data = sheet.getDataRange().getValues();
  var header = data.shift(), ratingA, ratingB;
  data.sort(function(x, y) {
    return sortFunction(x[1], y[1]);
  });
  data.unshift(header);
  sheet.getDataRange().setValues(data);
}
