const suits = ['spade', 'bastoni', 'denari', 'coppe'];

const cards = {
  1: { points: 11, name: 'asso', value: 1 },
  2: { points: 0, name: 'due', value: 2 },
  3: { points: 10, name: 'tre', value: 3 },
  4: { points: 0, name: 'quattro', value: 4 },
  5: { points: 0, name: 'cinque', value: 5 },
  6: { points: 0, name: 'sei', value: 6 },
  7: { points: 0, name: 'sette', value: 7 },
  8: { points: 2, name: 'donna', value: 8 },
  9: { points: 3, name: 'cavallo', value: 9 },
  10: { points: 4, name: 're', value: 10 },
};

const createSuitDeck = (suit, cards) => {
  return Object.entries(cards).map(([ key, card ]) => {
    const image = `${suit}-${card.name}`;

    return { image, suit, ...card };
  });
};

const createDeck = (suits, cards) => {
  return suits.map(suit => createSuitDeck(suit, cards)).flat();
};

function shuffle(array) {
  var m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

const startGame = () => {
  const currentTurn = 0;
  const deck = shuffle(createDeck(suits, cards));

  const handOne = [
    deck.splice(0, 1),
    deck.splice(2, 1),
    deck.splice(4, 1),
  ];

  const handTwo = [
    deck.splice(1, 1),
    deck.splice(3, 1),
    deck.splice(5, 1),
  ];

  const briscola = deck.splice(0, 1);

  deck.push(briscola);

  console.log(deck.length);
};

startGame()
