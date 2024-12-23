
//import all the data files
import ArabicWords from '@/assets/data/vocabulary/Arabic_Words.json'
import DutchWords from '@/assets/data/vocabulary/Dutch_Words.json'
import FrenchWords from '@/assets/data/vocabulary/French_Words.json'
import GermanWords from '@/assets/data/vocabulary/German_Words.json'
import GreekWords from '@/assets/data/vocabulary/Greek_Words.json'
import HebrewWords from '@/assets/data/vocabulary/Hebrew_Words.json'
import HindiWords from '@/assets/data/vocabulary/Hindi_Words.json'
import ItalianWords from '@/assets/data/vocabulary/Italian_Words.json'
import KoreanWords from '@/assets/data/vocabulary/Korean_Words.json'
import PortugueseWords from '@/assets/data/vocabulary/Portuguese_Words.json'
import RussianWords from '@/assets/data/vocabulary/Russian_Words.json'
import SpanishWords from '@/assets/data/vocabulary/Spanish_Words.json'
import SwedishWords from '@/assets/data/vocabulary/Swedish_Words.json'
import TurkishWords from '@/assets/data/vocabulary/Turkish_Words.json'

import ArabicStories from '@/assets/data/stories/Arabic/Arabic_stories.json'
import DutchStories from'@/assets/data/stories/Dutch/Dutch_stories.json'
import FrenchStories from '@/assets/data/stories/French/French_stories.json'
import GermanStories from '@/assets/data/stories/German/German_stories.json'
import GreekStories from '@/assets/data/stories/Greek/Greek_stories.json'
import HebrewStories from '@/assets/data/stories/Hebrew/Hebrew_stories.json'
import HindiStories from '@/assets/data/stories/Hindi/Hindi_stories.json'
import ItalianStories from '@/assets/data/stories/Italian/Italian_stories.json'
import KoreanStories from '@/assets/data/stories/Korean/Korean_stories.json'
import PortugueseStories from '@/assets/data/stories/Portuguese/Portuguese_stories.json'
import RussianStories from '@/assets/data/stories/Russian/Russian_stories.json'
import SpanishStories from '@/assets/data/stories/Spanish/Spanish_stories.json'
import SwedishStories from '@/assets/data/stories/Swedish/Swedish_stories.json'
import TurkishStories from '@/assets/data/stories/Turkish/Turkish_stories.json'

import ArabicStoryData from '@/assets/data/stories/Arabic/Arabic_words.json'
import DutchStoryData from'@/assets/data/stories/Dutch/Dutch_words.json'
import FrenchStoryData from '@/assets/data/stories/French/French_words.json'
import GermanStoryData from '@/assets/data/stories/German/German_words.json'
import GreekStoryData from '@/assets/data/stories/Greek/Greek_words.json'
import HebrewStoryData from '@/assets/data/stories/Hebrew/Hebrew_words.json'
import HindiStoryData from '@/assets/data/stories/Hindi/Hindi_words.json'
import ItalianStoryData from '@/assets/data/stories/Italian/Italian_words.json'
import KoreanStoryData from '@/assets/data/stories/Korean/Korean_words.json'
import PortugueseStoryData from '@/assets/data/stories/Portuguese/Portuguese_words.json'
import RussianStoryData from '@/assets/data/stories/Russian/Russian_words.json'
import SpanishStoryData from '@/assets/data/stories/Spanish/Spanish_words.json'
import SwedishStoryData from '@/assets/data/stories/Swedish/Swedish_words.json'
import TurkishStoryData from '@/assets/data/stories/Turkish/Turkish_words.json'



//Create an object that maps each language to a data file
export const wordFiles = {
    Arabic: ArabicWords,
    Dutch: DutchWords,
    French: FrenchWords,
    German: GermanWords,
    Greek: GreekWords,
    Hebrew: HebrewWords,
    Hindi: HindiWords,
    Italian: ItalianWords,
    Korean: KoreanWords,
    Portuguese: PortugueseWords,
    Russian: RussianWords,
    Spanish: SpanishWords,
    Swedish: SwedishWords,
    Turkish: TurkishWords,
};

export const storyFiles = {
    Arabic: ArabicStories,
    Dutch: DutchStories,
    French: FrenchStories,
    German: GermanStories,
    Greek: GreekStories,
    Hebrew: HebrewStories,
    Hindi: HindiStories,
    Italian: ItalianStories,
    Korean: KoreanStories,
    Portuguese: PortugueseStories,
    Russian: RussianStories,
    Spanish: SpanishStories,
    Swedish: SwedishStories,
    Turkish: TurkishStories,
};

export const wordStoryData = {
    Arabic: ArabicStoryData,
    Dutch: DutchStoryData,
    French: FrenchStoryData,
    German: GermanStoryData,
    Greek: GreekStoryData,
    Hebrew: HebrewStoryData,
    Hindi: HindiStoryData,
    Italian: ItalianStoryData,
    Korean: KoreanStoryData,
    Portuguese: PortugueseStoryData,
    Russian: RussianStoryData,
    Spanish: SpanishStoryData,
    Swedish: SwedishStoryData,
    Turkish: TurkishStoryData,
};


//database functions
import { db } from '@/app/data/Database'


//Create instance for that story whenever user opens it first
export const createStoryInstance = (storyName, currentLang) => {
    try {
        let exists = false;

        db.withTransactionSync(() => {
            // Check if the story instance already exists
            const result = db.getFirstSync(
                `SELECT id FROM explorer WHERE story_name = ? AND language_id = ?;`,
                [storyName, currentLang]
            );

            // If a result is found, set exists to true
            if (result) {
                exists = true;
            }
        });

        if (exists) {
            return true;
        }

        // If the story does not exist, create a new instance
        db.withTransactionSync(() => {
            db.runSync(
                `INSERT INTO explorer (story_name, highlighted_words, bookmarked, language_id) VALUES (?, ?, ?, ?);`,
                [storyName, JSON.stringify([]), false, currentLang]
            );
        });

        return true;

    } catch (error) {
        console.error("Error creating story instance:", error.message);
        return false;
    }
};


export const toggleHighlightedWord = (word, storyName, currentLang) => {
    try {
        let highlightedWords = [];

        db.withTransactionSync(() => {
            // Step 1: Retrieve the current highlighted_words for the story
            const result = db.getFirstSync(
                `SELECT highlighted_words FROM explorer WHERE story_name = ? AND language_id = ?;`,
                [storyName, currentLang]
            );

            // Parse highlighted_words if it exists
            if (result && result.highlighted_words) {
                highlightedWords = JSON.parse(result.highlighted_words);
            }

            // Step 2: Toggle the word in the highlightedWords array
            const wordIndex = highlightedWords.indexOf(word);

            if (wordIndex > -1) {
                // Remove the word if it exists
                highlightedWords.splice(wordIndex, 1);
            } else {
                // Add the word if it does not exist
                highlightedWords.push(word);
            }

            // Step 3: Update the highlighted_words in the database
            db.runSync(
                `UPDATE explorer SET highlighted_words = ? WHERE story_name = ? AND language_id = ?;`,
                [JSON.stringify(highlightedWords), storyName, currentLang]
            );
        });

        return true; // Operation successful
    } catch (error) {
        console.error("Error toggling highlighted word:", error.message);
        return false; // Operation failed
    }
};

export const getHighlightedWords = (storyName, currentLang) => {
    try {
        let highlightedWords = [];

        db.withTransactionSync(() => {
            // Fetch the highlighted words for the story
            const result = db.getFirstSync(
                `SELECT highlighted_words FROM explorer WHERE story_name = ? AND language_id = ?;`,
                [storyName, currentLang]
            );

            // Parse highlighted_words if it exists
            if (result && result.highlighted_words) {
                highlightedWords = JSON.parse(result.highlighted_words);
            }
        });

        return highlightedWords; // Return the array of highlighted words
    } catch (error) {
        console.error("Error fetching highlighted words:", error.message);
        return []; // Return an empty array on failure
    }
};

//Get bookmark status function for the story
export const getBookmarkedStatus = (storyName, currentLang) => {
    try {
        let bookmarkedStatus = false;

        db.withTransactionSync(() => {
            // Retrieve the bookmarked status
            const result = db.getFirstSync(
                `SELECT bookmarked FROM explorer WHERE story_name = ? AND language_id = ?;`,
                [storyName, currentLang]
            );

            // If the story is found, set the status
            if (result) {
                bookmarkedStatus = result.bookmarked === 1; // Convert 1/0 to true/false
            } else {
                throw new Error(`Story "${storyName}" not found for language ID ${currentLang}.`);
            }
        });

        return bookmarkedStatus; // Return true/false
    } catch (error) {
        console.error("Error retrieving bookmark status:", error.message);
        return false; // Return false in case of an error
    }
};



//Toggle bookmark status for the story
export const toggleBookmarkStory = (storyName, currentLang) => {
    try {
        let newBookmarkedStatus = false;

        db.withTransactionSync(() => {
            // Step 1: Retrieve the current bookmark status
            const result = db.getFirstSync(
                `SELECT bookmarked FROM explorer WHERE story_name = ? AND language_id = ?;`,
                [storyName, currentLang]
            );

            // Step 2: If no result, handle the case where the story instance does not exist
            if (!result) {
                throw new Error(`Story "${storyName}" not found for language ID ${currentLang}.`);
            }

            // Step 3: Toggle the bookmark status
            const currentStatus = result.bookmarked;
            const updatedStatus = currentStatus === 1 ? 0 : 1;

            // Step 4: Update the database with the new bookmark status
            db.runSync(
                `UPDATE explorer SET bookmarked = ? WHERE story_name = ? AND language_id = ?;`,
                [updatedStatus, storyName, currentLang]
            );

            // Step 5: Set the new status for return
            newBookmarkedStatus = updatedStatus === 1;
        });

        return newBookmarkedStatus; // Return the new bookmark status (true/false)
    } catch (error) {
        console.error("Error toggling bookmark for the ExplorerStory:", error.message);
        return false; // Return false in case of an error
    }
};
