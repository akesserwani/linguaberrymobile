
//import all the data files
import ArabicWords from '@/assets/data/vocabulary/Arabic_Words.json'
import ChineseWords from '@/assets/data/vocabulary/Chinese_Words.json'
import DutchWords from '@/assets/data/vocabulary/Dutch_Words.json'
import FrenchWords from '@/assets/data/vocabulary/French_Words.json'
import GermanWords from '@/assets/data/vocabulary/German_Words.json'
import GreekWords from '@/assets/data/vocabulary/Greek_Words.json'
import HebrewWords from '@/assets/data/vocabulary/Hebrew_Words.json'
import HindiWords from '@/assets/data/vocabulary/Hindi_Words.json'
import ItalianWords from '@/assets/data/vocabulary/Italian_Words.json'
import JapaneseWords from '@/assets/data/vocabulary/Japanese_Words.json'
import KoreanWords from '@/assets/data/vocabulary/Korean_Words.json'
import PortugueseWords from '@/assets/data/vocabulary/Portuguese_Words.json'
import RussianWords from '@/assets/data/vocabulary/Russian_Words.json'
import SpanishWords from '@/assets/data/vocabulary/Spanish_Words.json'
import SwedishWords from '@/assets/data/vocabulary/Swedish_Words.json'
import TurkishWords from '@/assets/data/vocabulary/Turkish_Words.json'

import ArabicStories from '@/assets/data/stories/Arabic/Arabic_stories.json'
// import ChineseStories from '@/assets/data/stories/Chinese/Chinese_stories.json'
import DutchStories from '@/assets/data/vocabulary/Dutch_Words.json'
import FrenchStories from '@/assets/data/stories/French/French_stories.json'
import GermanStories from '@/assets/data/vocabulary/German_Words.json'
import GreekStories from '@/assets/data/vocabulary/Greek_Words.json'
import HebrewStories from '@/assets/data/vocabulary/Hebrew_Words.json'
import HindiStories from '@/assets/data/vocabulary/Hindi_Words.json'
import ItalianStories from '@/assets/data/vocabulary/Italian_Words.json'
import JapaneseStories from '@/assets/data/vocabulary/Japanese_Words.json'
import KoreanStories from '@/assets/data/vocabulary/Korean_Words.json'
import PortugueseStories from '@/assets/data/vocabulary/Portuguese_Words.json'
import RussianStories from '@/assets/data/vocabulary/Russian_Words.json'
import SpanishStories from '@/assets/data/stories/Spanish/Spanish_stories.json'
import SwedishStories from '@/assets/data/vocabulary/Swedish_Words.json'
import TurkishStories from '@/assets/data/vocabulary/Turkish_Words.json'

import ArabicStoryData from '@/assets/data/stories/Arabic/Arabic_words.json'
import FrenchStoryData from '@/assets/data/stories/French/French_words.json'
import SpanishStoryData from '@/assets/data/stories/Spanish/Spanish_words.json'


//Create an object that maps each language to a data file
export const wordFiles = {
    Arabic: ArabicWords,
    Chinese: ChineseWords,
    Dutch: DutchWords,
    French: FrenchWords,
    German: GermanWords,
    Greek: GreekWords,
    Hebrew: HebrewWords,
    Hindi: HindiWords,
    Italian: ItalianWords,
    Japanese: JapaneseWords,
    Korean: KoreanWords,
    Portuguese: PortugueseWords,
    Russian: RussianWords,
    Spanish: SpanishWords,
    Swedish: SwedishWords,
    Turkish: TurkishWords,
};

export const storyFiles = {
    Arabic: ArabicStories,
    French: FrenchStories,
    Spanish: SpanishStories
};

export const wordStoryData = {
    Arabic: ArabicStoryData,
    French: FrenchStoryData,
    Spanish: SpanishStoryData
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
