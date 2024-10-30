
import { storage } from "../data/Database";


//READ DECKS
//create function to read data from the deck
const getAllDecks = () => {
    // Step 1: Get the total number of decks from the counter
    const totalDecks = storage.getNumber('deck_counter') || 0; // If no counter exists, default to 0
  
    const decks = [];
  
    // Step 2: Loop through the counter to retrieve all decks
    for (let i = 1; i <= totalDecks; i++) {
      // Retrieve each deck's data using dynamic keys
      const deckName = storage.getString(`deck_${i}_name`);
      const bookmarked = storage.getBoolean(`deck_${i}_bookmarked`);
      const words = JSON.parse(storage.getString(`deck_${i}_words`) || "[]");  // Retrieve words or default to an empty array
      const tags = JSON.parse(storage.getString(`deck_${i}_tags`) || "[]");    // Retrieve tags or default to an empty array
  
      // Create a deck object and push it into the array
      decks.push({
        id: i,
        name: deckName,
        bookmarked: bookmarked,
        words: words,
        tags: tags
      });
    }
  
    // Return the array of all decks
    return decks;
  };
  
  
//CREATE DECK
//Function to create a new deck 
export const createNewDeck = (deckName) => {
    // Retrieve the current deck counter or initialize it to 0
    let deckCounter = storage.getNumber('deck_counter') || 0;
  
    // Increment the deck counter for the new deck
    deckCounter += 1;
  
    // Store the new deck
    storage.set(`deck_${deckCounter}_name`, deckName);
    storage.set(`deck_${deckCounter}_bookmarked`, false);
    
    storage.set(`deck_${deckCounter}_words`, JSON.stringify([]));  // Empty words array
    storage.set(`deck_${deckCounter}_tags`, JSON.stringify([]));   // Empty tags array
  
    // Update the deck counter in MMKV
    storage.set('deck_counter', deckCounter);

}
  