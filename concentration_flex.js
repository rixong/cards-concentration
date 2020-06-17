var deck = [];
var imageBank = [];
var numCards = 0;
var boardWidth;

$(document).ready(function() {
  buildBoard();
  buildImagebank();
  buildDeck();
  dealCards();
  gamePlay();
});

function buildBoard() {
  let width = $(window).width();
  let height = $(window).height();
  let columns = Math.floor(width / 130);
  let rows = Math.floor(height / 160);
  numCards = columns * rows;
      ///Adjust card number
  if (numCards > 32) {
    numCards = 32;
  }
  if ((numCards) % 2 != 0) {
    numCards -= 1;
  }
    // console.log(width, ' x ', height, 'num of Cards:', numCards);
  boardWidth = (columns * 120) + 15 + "px";
  $('.board').css('width', boardWidth);
}

function buildImagebank() {
  for (let z = 0; z < 16; z++) {
    imageBank.push(Math.floor(z) + '.png');
  }
}

function buildDeck() {
  let bankCopy = imageBank.slice(0);  /// clone imageBank
  for (let z = 0; z < numCards; z += 2) {
    let pickCard = Math.floor(Math.random() * bankCopy.length);
    deck.push(bankCopy[pickCard]);
    deck.push(bankCopy[pickCard]);
    bankCopy.splice(pickCard, 1);   ///remove chosen card from pool
  }
}

function dealCards() {
  $('.board').empty();
  for (let x = 0; x < numCards; x++) {
    let curCard = Math.floor(Math.random() * deck.length);
    let backNode = "<img class='back' id='back" + x +
      "' src='images/back.png'>";
    let cardNode = "<img class='card' id='card" + x +
      "' src='images/" + deck[curCard] + "' >";
    $('.board').append("<div class='cardBox'></div>");
    $('.cardBox').last().append(cardNode);
    $('.cardBox').last().append(backNode);
    deck.splice(curCard, 1);   /// remove card from deck
  }
}s

function gamePlay() {

  let savedCard = "";
  let flippedCards = 0;
  let increaseCount = true;
  let cardsRemaining = numCards;
  let totalFlips = 0;

  /// turn up cards
  $(document).ready(function() {
    $('.back').click(function() {
      let name = $(this).attr("id");
      let card = name.replace('back', '#card');
      if (increaseCount == true) {
        flippedCards += 1;
        /// the flip
        $(this).animate({
          height: '150px',
          width: '0px',
          left: '50px'
        }, {
          duration: 100,
          complete: function() {
            $(card).animate({
              heigth: '150px',
              width: '100px',
              left: '0px'
            }, {
              duration: 100,
              complete: function() {
                let curImg = $(card).attr('src');
                // console.log('Card:', card, '  Cur image:', curImg);
                if (flippedCards < 2) {
                  savedCard = curImg
                } else {
                  increaseCount = false;
                  checkCards(curImg);
                }
              }
            })
          }
        });
      }
    });
  });

  /// turndown cards
  $(document).ready(function() {
    $('.card').click(function() {
      let name = $(this).attr("id");
      let back = name.replace('card', '#back');
      if (increaseCount == false) {
        flippedCards -= 1;
        if (flippedCards == 0) {
          increaseCount = true;
        }
        /// the flip
        $(this).animate({
          height: '150px',
          width: '0px',
          left: '50px'
        }, {
          duration: 100,
          complete: function() {
            $(back).animate({
              heigth: '150px',
              width: '100px',
              left: '0px'
            }, {
              duration: 100
            })
          }
        });
      }
    });
  });

  ///Check for match
  function checkCards(card) {
    if (card == savedCard) {
      flippedCards = 0;
      increaseCount = true;
      cardsRemaining -= 2;
      let imgTag = "img[src='" + card + "'";
      $(imgTag).fadeOut('slow');
      savedCard = "";
    }
    totalFlips += 1;
    if (cardsRemaining == 0) {
      let signPos = $(window).width()/2 - 120;
      console.log(signPos);
      signPos = signPos + 'px';
      $('.stats,.replay').css('left',signPos);
      $('.stats,.replay').slideDown('slow');
      let message = numCards/2 + ' pairs. It took you ' + totalFlips + ' flips.';
      $('.stats').text(message);
      cardsRemaining = numCards;
    }
  }
}

/// replay button
$(document).ready(function() {
  $('.replay').click(function() {
    $('.replay,.stats').fadeOut('slow', function () {
      buildDeck();
      dealCards();
      gamePlay();
    });
  });
});
