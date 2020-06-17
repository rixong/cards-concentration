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
  let bankCopy = imageBank.slice(0); /// clone imageBank
  for (let z = 0; z < numCards; z += 2) {
    let pickCard = Math.floor(Math.random() * bankCopy.length);
    deck.push(bankCopy[pickCard]);
    deck.push(bankCopy[pickCard]);
    bankCopy.splice(pickCard, 1); ///remove chosen card from pool
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
    deck.splice(curCard, 1); /// remove card from deck
  }
}

function gamePlay() {

  let savedCard = "";
  let flippedCards = 0;
  let cardsRemaining = numCards;
  let totalFlips = 0;
  let flipDelay = 750;

  /// turn up cards
  $(document).ready(function() {
    $('.back').click(function() {
      let backID = $(this).attr("id");
      let cardID = backID.replace('back', '#card');
      console.log('flipped:', flippedCards);
      if (flippedCards < 2) {
        flippedCards += 1;
        /// the flip
        $(this).animate({
          height: '150px',
          width: '0px',
          left: '50px'
        }, {
          duration: 100,
          complete: function() {
            $(cardID).animate({
              heigth: '150px',
              width: '100px',
              left: '0px'
            }, {
              duration: 100,
              complete: function() {
                if (flippedCards < 2) {
                  savedCard = cardID
                } else {
                  checkCards(cardID);
                }
              }
            })
          }
        });
      }
    });
  });

  /// turndown cards
  function turnDownCard(card) {
    setTimeout(function() {
      let back = card.replace('#card', '#back');
      $(card).animate({
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
      // }
    }, flipDelay);
  }

  ///Check for match
  function checkCards(card) {
    let img1 = $(card).attr("src");
    let img2 = $(savedCard).attr("src");
    console.log('card:', card, ' img1:', img1, ' img2:', img2);
    if (img1 == img2) {
      cardsRemaining -= 2;
      let imgTag = "img[src='" + img1 + "'";
      console.log('imgTag:', imgTag);
      $(imgTag).fadeOut('slow');
      savedCard = "";
    } else {
      console.log('else');
      turnDownCard(card);
      turnDownCard(savedCard);
    }
    totalFlips += 1;
    flippedCards = 0;
    if (cardsRemaining == 0) {
      let signPos = $(window).width() / 2 - 120;
      console.log(signPos);
      signPos = signPos + 'px';
      setTimeout(function(){
        $('.stats,.replay').css('left', signPos);
        $('.stats,.replay').slideDown('slow');
        let message = numCards / 2 + ' pairs. It took you ' + totalFlips + ' flips.';
        $('.stats').text(message);
        cardsRemaining = numCards;
}, 1000);

    }
  }
}

/// replay button
$(document).ready(function() {
  $('.replay').click(function() {
    $('.replay,.stats').fadeOut('slow', function() {
      buildDeck();
      dealCards();
      gamePlay();
    });
  });
});
