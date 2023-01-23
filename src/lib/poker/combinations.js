export function getCombinations(arr, k) {
  var results = [],
    temp = [],
    n = arr.length;
  for (var i = 0; i < 1 << n; i++) {
    for (var j = 0; j < n; j++) {
      if (i & (1 << j)) {
        temp.push(arr[j]);
      }
    }
    if (temp.length === k) {
      results.push(temp.slice());
    }
    temp = [];
  }
  return results;
}
