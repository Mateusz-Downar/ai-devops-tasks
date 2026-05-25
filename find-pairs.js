/**
 * Znajduje wszystkie pary elementów w tablicy, których suma równa się targetSum.
 * Algorytm oryginalny — złożoność czasowa O(n²).
 *
 * @param {number[]} arr
 * @param {number} targetSum
 * @returns {[number, number][]}
 */
function findPairs(arr, targetSum) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === targetSum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }
  return pairs;
}

module.exports = { findPairs };
