// deck class to create multiple decks of cards

class Deck {
  constructor() {
    this.deck = [];
    const suits = ['s', 'd', 'h', 'c'];
    const ranks = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'T',
      'J',
      'Q',
      'K',
      'A',
    ];
    for (let i = 0; i < ranks.length; i++) {
      for (let j = 0; j < suits.length; j++) {
        this.deck.push(`${ranks[i]}${suits[j]}`);
      }
    }
  }

  // shuffle method
  shuffle() {
    this.deck = shuffleArray(this.deck);

    return this.deck;
  }
}

// fisher-yates shuffle algorithm
const shuffleArray = (originalArray) => {
  const array = originalArray.slice(0);

  for (let i = array.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
};

// generate X number of hands for testing
const generateHands = numberOfHands => {
  const hands = [];
  for (let i = 0; i < numberOfHands; i++) {
    let deck = new Deck();
    deck.shuffle();
    deck.deck = deck.deck.slice(0, Math.floor(Math.random() * (41 - 5) + 5))
    hands.push(deck.deck);
  }

  return hands;
}

module.exports = generateHands;