function apriori(transactions, minSup) {
  if (!Array.isArray(transactions)) {
    console.error('apriori() error: transactions is not an array');
    return [];
  }
  if (typeof minSup !== 'number') {
    console.error('apriori() error: minSup is not a number');
    return [];
  }

  let itemsets = {},
      k = 0;
  itemsets[k] = extractItems(transactions);
  while (itemsets[k].length > 0) {
    if (k === 0) {
      itemsets[k] = countItems(itemsets[k], transactions, minSup);
    } else {
      itemsets[k] = generateItemsets(itemsets[k - 1], k);
      itemsets[k] = countItems(itemsets[k], transactions, minSup);
    }
    k++;
  }

  if (k === 0) {
    console.warn('apriori() warning: no frequent itemsets found');
    return [];
  }

  let frequentItems = [];
  for (let i in itemsets) {
    frequentItems.push(itemsets[i]);
  }
  return frequentItems.reduce((a, b) => a.concat(b));
}


function extractItems(transactions) {
  let items = new Set();
  for (let transaction of transactions) {
    for (let item of transaction) {
      items.add(item);
    }
  }
  return [...items];
}

function generateItemsets(itemset, length) {
  let combinations = [],
      sets = [];
  for (let i = 0; i < itemset.length; i++) {
    for (let j = i + 1; j < itemset.length; j++) {
      let set = new Set([...itemset[i], ...itemset[j]]);
      if (set.size === length) {
        combinations.push(set);
      }
    }
  }
  for (let item of combinations) {
    sets.push([...item]);
  }
  return sets;
}

function countItems(itemset, transactions, minSup) {
  let counts = {},
      frequentItems = [];
  for (let transaction of transactions) {
    for (let item of itemset) {
      if (isSubset(item, transaction)) {
        counts[item] = counts[item] ? counts[item] + 1 : 1;
      }
    }
  }
  for (let item in counts) {
    let support = counts[item] / transactions.length;
    if (support >= minSup) {
      frequentItems.push([item, support]);
    }
  }
  return frequentItems;
}
function isSubset(smallSet, largeSet) {
  if (!(smallSet instanceof Set) || !(largeSet instanceof Set)) {
    return false;
  }
  for (let item of smallSet) {
    if (!largeSet.has(item)) {
      return false;
    }
  }
  return true;
}

