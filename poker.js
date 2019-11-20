const generateHands = require('./generateHands.js');

// Map of the possible poker hands to return
const handMap = {
  0: 'High Card',
  1: 'Pair',
  2: 'Two Pair',
  3: 'Three Of A Kind',
  4: 'Straight',
  5: 'Flush',
  6: 'Full House',
  7: 'Four Of A Kind',
  8: 'Straight Flush',
  9: 'Royal Flush'
}

/**
 * containsStraight will check if a straight is possible in an array of cards
 * @param cards - array of 5-40 cards 
 * 
 * @return Boolean indicating whether or not a straight can be made
 */
const containsStraight = cards => {

  const ranks = cards.map(card => card[0]);
  const possibleStraights = [
    ['A', '2', '3', '4', '5'],
    ['2', '3', '4', '5', '6'],
    ['3', '4', '5', '6', '7'],
    ['4', '5', '6', '7', '8'],
    ['5', '6', '7', '8', '9'],
    ['6', '7', '8', '9', 'T'],
    ['7', '8', '9', 'T', 'J'],
    ['8', '9', 'T', 'J', 'Q'],
    ['9', 'T', 'J', 'Q', 'K'],
    ['T', 'J', 'Q', 'K', 'A'],
  ];

  // check if each any of the possibleStraights are all included in cards
  for (let straight of possibleStraights) {
    if (straight.every(val => ranks.includes(val))) {
      return true;
    }
  }

  return false;
}

/**
 * findBestHand will return the best possible poker rank that can be made from an array of cards
 * 
 * @param cards - array of 5-40 cards represented by a 2 character string denoting rank/suit, coming from a single 52 card deck.  10's will be denoted by the string 'T'. 
 *  example: ['As', 'Ks', 'Qs', 'Js', 'Ts', '2s', '2h', '2c', '2d'], return 'Royal Flush'.
 * 
 * @return - Highest value poker hand that can be made taking a selection of 5 cards from the input.
 */

const findBestHand = cards => {
  // extracting each combination of 5 cards hands from a potential 40 card input would be expensive as there are up to 658,008 combinations (40C5)

  // we'll eventually use handValue in the return using the handMap defined above.  Start at the highest value and decrement handValue 
  // if we find that handValue is not present.
  let handValue = 9;

  // map of all cards by suit to check for Royal Flush, Straight Flush, Flush
  const suitMap = {
    's': [],
    'h': [],
    'd': [],
    'c': []
  }

  // map of all cards by count to check for the rest of the handValues
  const ranksCount = {
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    'T': 0,
    'J': 0,
    'Q': 0,
    'K': 0,
    'A': 0 
  }

  
  // push all of the cards into suitMap and ranksCount
  cards.forEach(card => {
    suitMap[card[1]].push(card[0])
    ranksCount[card[0]]++
  })
  // console.log(suitMap);
  // console.log(ranksCount);
  
  // check for Royal Flush
  for (let suit in suitMap) {
    // if 5 cards in the suit greater than 9
    if (suitMap[suit].filter(card => card > ['9']).length === 5) {
      return handMap[handValue]
    }
  }

  // if we get here, no Royal Flush present, move on to Straight Flush
  handValue--;

  for (let suit in suitMap) {
    // if a straight is present within a suit, then a Straight Flush is present (must have at least 5 cards to check for straights)
    if (suitMap[suit].length >= 5) {
      if (containsStraight(suitMap[suit])) {
        return handMap[handValue]
      }
    }
  }

  // if we get here, no Straight Flush present, move on to 4-of-a-kind
  handValue--;

  for (let rank in ranksCount) {
    if (ranksCount[rank] === 4) {
      return handMap[handValue];
    }
  }

  // if we get here, no 4 of a kind present, move on to Full House
  handValue--;


  let trips = false;
  // copy ranksCounts since we're going to mutate it if we find 3 of a kind
  let cloneRanks = {...ranksCount}

  for (let rank in ranksCount) {
    if (ranksCount[rank] === 3) {
      trips = true
      cloneRanks[rank] = 0;
      // exit the loop if we find trips
      break;
    }
  }

  if (trips) {
    for (let rank in cloneRanks) {
      if (cloneRanks[rank] > 1) {
        return handMap[handValue];
      }
    }
  }

  // if we get here, no Full House present, move on to Flush
  handValue--;


  for (let suit in suitMap) {
    if (suitMap[suit].length > 4) {
      return handMap[handValue];
    }
  }

  // if we get here, no Flush present, move on to Straight
  handValue--;

  if (containsStraight(cards)) {
    return handMap[handValue];
  }

  // if we get here, no Straight present, move on to Trips
  handValue--;

  for (let rank in ranksCount) {
    if (ranksCount[rank] === 3) {
      return handMap[handValue];
    }
  }

  // if we get here, no Trips present, move on to Two Pair
  handValue--;

  let firstPair = false;
  let anotherClone = {...ranksCount};

  for (let rank in ranksCount) {
    if (ranksCount[rank] === 2) {
      firstPair = true;
      anotherClone[rank] = 0;
      // exit the loop if we find a pair
      break;
    }
  }

  if (firstPair) {
    for (let rank in anotherClone) {
      if (anotherClone[rank] === 2) {
        return handMap[handValue];
      }
    }
  }

  // if we get here, no Two Pair present, move on to Pair
  handValue--;

  for (let rank in ranksCount) {
    if (ranksCount[rank] === 2) {
      return handMap[handValue];
    }
  }

  // if we get here, no Pair is present, return lowest value hand
  handValue--;

  return handMap[handValue];
};

const test10000 = generateHands(10000);
test10000.forEach(hand => console.log(findBestHand(hand)));

