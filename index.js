let blackjackGame = {
    "you": {
        "scoreSpan": "#your-blackjack-result",
        "div": "#your-box",
        "score": 0
    },
    "dealer": {
        "scoreSpan": "#dealer-blackjack-result",
        "div": "#dealer-box",
        "score": 0
    },
    "cards": [
        "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
    ],
    "cardsMap": {
        "2": 2, "3": 3, "4": 4, "5":5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": [1, 11]
    },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "dealerTurn": false,
    "turnsOver": false,
    

};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

const HITSOUND = new Audio("sounds/swish.m4a");
const LOSSSOUND = new Audio("sounds/aww.mp3");
const WINSOUND = new Audio("sounds/cash.mp3");
const TIESOUND = new Audio("sounds/bell.mp3");

let aces = [];

document.querySelector("#blackjack-hit-button").addEventListener("click", blackjackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click", blackjackDeal);

  //display random cards on you and dealer sides
function blackjackHit() {
    if (blackjackGame["dealerTurn"] === false) {
        document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
};

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer["score"] <=21){
        let  cardImage = document.createElement("img");
        cardImage.src = "images/"+ card + ".png";
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
        HITSOUND.play();
    }
}
  //end display random cards on you and dealer sides

  //remove cards on deal
function blackjackDeal() {
    if (blackjackGame["turnsOver"] === true) {
        blackjackGame["dealerTurn"] = false;
        //showResult(computeWinner());
        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
        
        for(let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for(let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }
        
        YOU["score"] = 0;
        DEALER["score"] = 0;

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").textContent = 0;

        document.querySelector("#your-blackjack-result").style.color = "#fff";
        document.querySelector("#dealer-blackjack-result").style.color = "#fff";

        document.querySelector("#blackjack-result").textContent = "Let's Play!";
        document.querySelector("#blackjack-result").style.color = "black";

        blackjackGame["turnsOver"] = false;
    }
}
  //end remove cards on deal

  //add and show score
function updateScore(card, activePlayer) {
    
    if (card === "A") {
        //If adding 11 keeps below 21, add 11. Otherwise, add 1.
        if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
            activePlayer["score"] += blackjackGame["cardsMap"][card][1];
            aces.push("A");
        }
        else {
            activePlayer["score"] += blackjackGame["cardsMap"][card][0];
        } 
    }
    else {
        activePlayer["score"] += blackjackGame["cardsMap"][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer["score"] > 21){
        // if (aces.length > 0) {
        //     activePlayer["score"] = activePlayer["score"] - 10; //makes 11 Ace a 1 Ace
        //     document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
        //     aces = [];
        // }
        //else {
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
        //}
    }
    else {
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    }
}
  //end add and show score

  //bot plays 1 at a time (advanced)
function  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
  //dealer hits
async function dealerLogic() {
    if (YOU['score'] > 0) {
        blackjackGame["dealerTurn"] = true;
        document.querySelector("#blackjack-stand-button").removeEventListener("click", dealerLogic);
        
        while (DEALER['score'] < 18 && blackjackGame["dealerTurn"] === true){
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);
            if (DEALER['score'] < 18 && YOU['score'] > 21){
                break;
            } else if (DEALER['score'] > YOU['score']){
                break;
            } else {
                await sleep(1000);
            }   
        }

        blackjackGame["turnsOver"] = true;
        let winner = computeWinner();
        showResult(winner);
    }
    
}
  //end dealer hits

  //who won
  //update table score
function computeWinner() {
    let winner;

    //conditions: beat dealer, dealer has better non-bust score, tie
    if (YOU["score"] <= 21) {
        if (YOU["score"] > DEALER["score"] || (DEALER["score"] > 21)){
            blackjackGame["wins"]++;
            winner = YOU;
        }
        else if (YOU["score"] < DEALER["score"]) {
            blackjackGame["losses"]++;
            winner = DEALER;
        }
        else if (YOU["score"] === DEALER["score"]) {
            blackjackGame["draws"]++;
        }
    }
    //condition: user busts, dealer doesn't
    else if (YOU["score"] > 21 && DEALER["score"] <= 21){
        blackjackGame["losses"]++;
        winner = DEALER;
    }
    //condition: user and dealer bust
    else if (YOU["score"] > 21 && DEALER["score"] > 21){
        blackjackGame["draws"]++;
    }

    console.log("Winner is", winner);
    console.log(blackjackGame);
    return winner;
}
  //end who won

  //winner
function showResult(winner) {
    let message, messageColor;
    if (blackjackGame["turnsOver"] === true){
        if (winner === YOU) {
            document.querySelector("#wins").textContent = blackjackGame["wins"];
            message = "You won!";
            messageColor = "green";
            WINSOUND.play();
        }
        else if(winner === DEALER) {
            document.querySelector("#losses").textContent = blackjackGame["losses"];
            message = "You lost!";
            messageColor = "red";
            LOSSSOUND.play();
        }
        else {
            document.querySelector("#draws").textContent = blackjackGame["draws"];
            message = "You tied!";
            messageColor = "black";
            TIESOUND.play();
        }

        document.querySelector("#blackjack-result").textContent = message;
        document.querySelector("#blackjack-result").style.color = messageColor;
    }
}
  //end winner
