
import { db } from "../data/Database";



//READ DECKS
//create function to read data from the deck


export const getAllDecks = (currentLang) => {

  //define variable to hold array
  let deckNames = [];

  db.withTransactionSync(() => {

    const results = db.getAllSync(`SELECT * FROM deck WHERE language_id = ?;`, [currentLang]);
    deckNames = results.map(deck => deck.name);
  
  });

  return deckNames;

};
  
  
//CREATE DECK
//Function to create a new deck 
export const createNewDeck = (deckName, currentLang) => {

    db.withTransactionSync(() => {
      db.runSync(`INSERT INTO deck (name, bookmarked, language_id) VALUES (?, ?, ?);`, [deckName, 0, currentLang]);
    });

}
  