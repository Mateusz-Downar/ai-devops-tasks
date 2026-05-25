/**
 * Znajduje pary z sumą targetSum — wersja zoptymalizowana (hash map).
 * Złożoność czasowa O(n), pamięciowa O(n).
 *
 * @param {number[]} arr
 * @param {number} targetSum
 * @returns {[number, number][]}
 */
function findPairs(arr, targetSum) {
  const pairs = [];
  const seen = new Map();

  for (const value of arr) {
    const complement = targetSum - value;

    if (seen.has(complement)) {
      const count = seen.get(complement);
      for (let i = 0; i < count; i++) {
        pairs.push([complement, value]);
      }
    }

    seen.set(value, (seen.get(value) || 0) + 1);
  }

  return pairs;
}

module.exports = { findPairs };
