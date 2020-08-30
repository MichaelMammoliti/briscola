const suits = ['spade', 'bastoni', 'denari', 'coppe'];

const cards = {
  1: { points: 11, name: 'asso', value: 1, strongScore: 10, },
  2: { points: 0, name: 'due', value: 2, strongScore: 1, },
  3: { points: 10, name: 'tre', value: 3, strongScore: 9 },
  4: { points: 0, name: 'quattro', value: 4, strongScore: 2 },
  5: { points: 0, name: 'cinque', value: 5, strongScore: 3 },
  6: { points: 0, name: 'sei', value: 6, strongScore: 4 },
  7: { points: 0, name: 'sette', value: 7, strongScore: 5 },
  8: { points: 2, name: 'donna', value: 8, strongScore: 6 },
  9: { points: 3, name: 'cavallo', value: 9, strongScore: 7 },
  10: { points: 4, name: 're', value: 10, strongScore: 8 },
};

const p1Cards = [...document.querySelectorAll('.player-one .cards .card')];
const p2Cards = [...document.querySelectorAll('.player-two .cards .card')];
const briscolaCard = document.querySelector('.briscola .card');
const allPlayerCards = [...p1Cards, ...p2Cards];
const tableCards = [...document.querySelectorAll('.table .cards .card')];
const playerOneScore = document.querySelector('.player-one .score');
const playerTwoScore = document.querySelector('.player-two .score');
const playerSides = document.querySelectorAll('.player');

let deck = [];
let winnerIndex = 0;
let currentTurn = 0;
let currentSuit;
let table = [];
let briscola;
const players = [
  { hand: [], collectedCards: [], score: 0 },
  { hand: [], collectedCards: [], score: 0 }
];

const shuffle = (array) => {
  var m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

const createSingleSuitDeck = (suit, cards) => {
  return Object.entries(cards).map(([ key, card ]) => {
    const image = `${suit}-${card.value}.png`;

    return { image, suit, ...card };
  });
};

const createEntireDeck = (suits, cards) => {
  return suits.map(suit => createSingleSuitDeck(suit, cards)).flat();
};

const getCardFromDeck = () => deck.splice(0, 1)[0];

const getFirstHand = () => {
  const hands = [[], []];

  for(let i = 0; i < 6; i++) {
    const index = (i % 2 === 0) ? 0 : 1;
    const card = getCardFromDeck();

    hands[index].push(card);
  }

  return hands;
};

const changeTurn = () => {
  currentTurn = (currentTurn === 1) ? 0 : 1;
}

const getBackgroundImage = obj => {
  if (obj && obj.image) {
    return `background-image: url(images/${obj.image})`;
  }

  return '';
}

const setStyles = () => {
  p1Cards.forEach((card, index) => {
    card.style = getBackgroundImage(players[0].hand[index]);
  });

  p2Cards.forEach((card, index) => {
    card.style = getBackgroundImage(players[1].hand[index]);
  });

  tableCards.forEach((card, index) => {
    card.style = getBackgroundImage(table[index]);
  });

  playerSides.forEach((item, index) => {
    item.classList.remove('player--active');

    if (currentTurn === index) {
      item.classList.add('player--active');
    }
  });


  briscolaCard.style = `background-image: url(images/${briscola.image})`;
}

const getWinnerPlayerIndex = () => {
  const strongestCardIndex = getStrongerCardIndex(table[0], table[1]);

  if (strongestCardIndex === 0) {
    return winnerIndex;
  }

  return getOppositeWinnerIndex();
}

const getOppositeWinnerIndex = () => {
  return (winnerIndex === 1) ? 0 : 1;
};

const giveNewCards = () => {
  const loserPlayerTurn = getOppositeWinnerIndex();

  const winnerPlayer = players[winnerIndex];
  const loserPlayer = players[loserPlayerTurn];

  const winnerPlayerEmptyCardIndex = winnerPlayer.hand.findIndex(i => !i);
  const loserPlayerEmptyCardIndex = loserPlayer.hand.findIndex(i => !i);

  winnerPlayer.hand[winnerPlayerEmptyCardIndex] = getCardFromDeck();
  loserPlayer.hand[loserPlayerEmptyCardIndex] = getCardFromDeck();
};

const calculatePlayerScore = (player) => {
  player.collectedCards.reduce((acc, card) => {
    acc += card.points;

    return acc;
  }, 0);
}

const renderScore = () => {
  playerOneScore.innerHTML = players[0].score;
  playerTwoScore.innerHTML = players[1].score;
};

const updateWinnerScore = () => {
  const cardScoreSum = table[0].points + table[1].points;
  players[winnerIndex].score = players[winnerIndex].score + cardScoreSum;
};

const clearTable = () => {
  table = [];
};

const nextHand = () => {
  toggleEvents();

  window.setTimeout(() => {
    updateWinnerScore();
    clearTable();
    giveNewCards();
    render();
    toggleEvents();
  }, 2000);
};

const render = () => {

  if (table.length === 1) {
    changeTurn();
  }

  if (table.length === 2) {
    winnerIndex = getWinnerPlayerIndex();
    currentTurn = winnerIndex;

    nextHand();
  }

  renderScore();
  setStyles();
};

const getStrongerCardIndex = (card1, card2) => {
  const briscolaCardIndex = [card1, card2].findIndex(card => card.suit === briscola.suit);

  if (briscolaCardIndex !== -1) {
    return briscolaCardIndex;
  }

  if (card1.suit === card2.suit) {
    return (card1.strongScore > card2.strongScore) ? 0 : 1;
  }

  return 0;
};

const putCardOnTable = (cardIndex, playerIndex) => {
  const selectedCard = players[playerIndex].hand[cardIndex];

  players[playerIndex].hand[cardIndex] = undefined;

  table.push(selectedCard);

  render();
};

const handleCardClick = event => {
  if (disabledEvents) {
    return;
  }

  const { index, player } = event.target.dataset;

  if (parseInt(currentTurn) === parseInt(player)) {
    putCardOnTable(index, player);
  }
};

const addEvents = () => {
  allPlayerCards.forEach(cardItem => {
    cardItem.addEventListener('click', handleCardClick);
  })
};

const shuffleDeck = () => {
  deck = shuffle(createEntireDeck(suits, cards));
};

const giveFirstHand = () => {
  const hands = getFirstHand();

  briscola = deck.splice(0, 1)[0];

  deck.push(briscola);

  players[0].hand = hands[0];
  players[1].hand = hands[1];
}

const toggleEvents = () => {
  disabledEvents = !disabledEvents;
};

const enableEvents = () => {
  disabledEvents = false;
};

const disableEvents = () => {
  disabledEvents = true;
};

const startGame = () => {
  shuffleDeck();
  giveFirstHand();
  enableEvents();
  addEvents();
  console.log(winnerIndex);
  render();
};

startGame();
