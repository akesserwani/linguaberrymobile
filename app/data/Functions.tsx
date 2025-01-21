


//Function to clean input and check if item is correct
export const  checkCorrect = (input, correct) => {
    // Function to remove punctuation and normalize accents
    const normalizeText = (text) => {
        return text
            .normalize("NFD") // Decompose accents (e.g., é -> e +  ́)
            .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
            .replace(/[.,!?;:'"-]/g, "") // Remove punctuation
            .toLowerCase() // Make lowercase for case-insensitive comparison
            .trim(); // Remove leading and trailing whitespace
    };


    // Function to calculate Levenshtein Distance
    const levenshteinDistance = (a, b) => {
        const matrix = [];
        const lenA = a.length;
        const lenB = b.length;

        // Initialize the matrix
        for (let i = 0; i <= lenA; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= lenB; j++) {
            matrix[0][j] = j;
        }

        // Fill the matrix
        for (let i = 1; i <= lenA; i++) {
            for (let j = 1; j <= lenB; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1, // Deletion
                        matrix[i][j - 1] + 1, // Insertion
                        matrix[i - 1][j - 1] + 1 // Substitution
                    );
                }
            }
        }

        return matrix[lenA][lenB];
    };
    
    
    // Normalize both strings
    const normalizedInput = normalizeText(input);
    const normalizedCorrect = normalizeText(correct);

    // Calculate similarity
    const percentSimilar = 98;

    const distance = levenshteinDistance(normalizedInput, normalizedCorrect);
    const maxLength = Math.max(normalizedInput.length, normalizedCorrect.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    // Return true if similarity is at least 98%
    return similarity >= percentSimilar;

}

//Function to match senteneces
export const matchSentences = (mainText, translationText) => {
    // Regex to split sentences on `.`, `?`, or `!` while avoiding splits on abbreviations and ellipses
    const sentenceRegex = /(?<!\b(?:Mr|Ms|Mrs|Dr|Jr|Sr|St|etc|e\.g|i\.e|vs)\.)(?<!\.\.\.)([.!?])\s+/;

    // Split and clean mainText sentences
    const mainSentences = mainText
        .split(sentenceRegex)
        .reduce((acc, curr, idx) => {
            if (/[.!?]/.test(curr) && idx > 0) {
                acc[acc.length - 1] += curr; // Append punctuation to the last sentence
            } else if (curr.trim()) {
                acc.push(curr.trim());
            }
            return acc;
        }, [])
        .map(sentence => sentence.replace(/[.!?]/g, '').trim()); // Remove punctuation

    // Split and clean translationText sentences
    const translationSentences = translationText
        .split(sentenceRegex)
        .reduce((acc, curr, idx) => {
            if (/[.!?]/.test(curr) && idx > 0) {
                acc[acc.length - 1] += curr; // Append punctuation to the last sentence
            } else if (curr.trim()) {
                acc.push(curr.trim());
            }
            return acc;
        }, [])
        .map(sentence => sentence.replace(/[.!?]/g, '').trim()); // Remove punctuation

    // Match sentences dynamically
    const sentencePairs = mainSentences.map((mainSentence, index) => {
        const translationSentence = translationSentences[index] || ''; // Handle cases where translations may be fewer
        return { mainSentence, translationSentence };
    });

    return sentencePairs;
}


//This function will convert the JSON data in the language files and make it compatible with ViewWordModal
export const convertLangFiletoJSON = (data) => {
    return Object.entries(data).map(([key, value]) => ({
        notes: "none", // Add a default value for notes
        term: value.toLowerCase(),
        translation: key.toLowerCase(),
    }));
};

//Fisher Yates Shuffle Algorithm
export const shuffleArray = (array) => {
    const shuffledArray = [...array]; // Copy the array to avoid mutating the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}


//FUNCTION TO SHORTEN WORD BASED ON SPECIFIED NUMBER OF CHARACTERS
export const limitLength = (word, max_char)=>{
    if (word.length > max_char){
        return `${word.slice(0, max_char)}...`;
    } else{
        return word;
    }   
}

//Function to format the date
export const formatDate = (dbDate) => {
    const date = new Date(dbDate);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Get last two digits

    return `${month}/${day}/${year}`;
};

//CSV FUNCTIONS
export const ObjectToCSV = (data) => {
    // Define the headers we want to include
    const headers = ['term', 'translation', 'notes'];

    // If data is empty or undefined, return just the header row
    if (!data || !data.length) {
        return '';
    }
    console.log(data);
    // Filter out rows that are empty or have no valid term and translation
    const filteredData = data.filter(row => row.term && row.translation);
    
    if (!filteredData.length) {
        return ''; // Return an empty string if no valid rows exist
    }

    // Map each row to CSV format, including only term, translation, notes
    const rows = filteredData.map(row => {
        return headers.map(header => {
            const value = row[header];
            // Escape double quotes by doubling them, and wrap values containing commas or quotes in double quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value || ''; // Ensure empty fields are represented as empty strings
        }).join(',');
    });

    // Join rows with newlines
    return rows.join('\n');
};


export const CSVToObject = (data) => {
    // Split the CSV data into rows
    const rows = data.trim().split('\n');

    // Define the default headers in the expected order
    const defaultHeaders = ['term', 'translation', 'notes'];

    // Map the rows to objects using the default header order
    const result = rows.map(row => {
        const values = row.split(',');

        // Create an object for each row
        const object = {};
        defaultHeaders.forEach((header, index) => {
            const value = values[index] ? values[index].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            object[header] = header === 'notes' && !value ? 'none' : value; // Set "none" if notes is empty
        });

        return object;
    }).filter(obj => obj.term && obj.translation); // Filter out rows without a valid term or translation

    return result;
};


// Function to validate the CSV
export const validateCSVFormat = (csvData) => {
    const rows = csvData.trim().split('\n');

    if (rows.length < 1) {
        return { valid: false, error: "CSV file must contain data." };
    }


    // Track terms to check for duplicates
    const terms = new Set();

    // Validate each data row
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',').map(col => col.trim());

        // Check for 2 or 3 columns, allowing notes to be optional
        if (columns.length < 2 || columns.length > 3) {
            return { valid: false, error: `Row ${i} has an incorrect number of columns. Expected 2 or 3, found ${columns.length}.` };
        }

        const [term, translation, notes = "none"] = columns;

        // Validate term and translation: check for empty or whitespace-only strings
        if (!term || term.trim() === "" || !translation || translation.trim() === "") {
            return { valid: false, error: `Row ${i} has empty or whitespace-only values in required columns 'term' or 'translation'.` };
        }

        // Check character limits for term and translation
        if (term.length > 100) {
            return { valid: false, error: `Row ${i}: 'term' exceeds the maximum length of 100 characters.` };
        }
        if (translation.length > 100) {
            return { valid: false, error: `Row ${i}: 'translation' exceeds the maximum length of 100 characters.` };
        }

        // Check character limit for notes
        if (notes.length > 1000) {
            return { valid: false, error: `Row ${i}: 'notes' exceeds the maximum length of 1000 characters.` };
        }
        

        // Check for duplicates in the term column
        if (terms.has(term.toLowerCase())) {
            return { valid: false, error: `Duplicate term '${term}' found in row ${i}. Each term must be unique.` };
        }
        terms.add(term.toLowerCase());

        // Optionally validate the notes column for length or content if needed
    }

    return { valid: true };
};
  