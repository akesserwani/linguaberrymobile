

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
// CSV FUNCTIONS
export const ObjectToCSV = (data) => {
    // Define the headers we want to include
    const headers = ['term', 'translation', 'notes'];
    const headerRow = headers.join(',');

    // If data is empty or undefined, return just the header row
    if (!data || !data.length) {
        return headerRow;
    }

    // Map each row to CSV format, including only term, translation, notes
    const rows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            // Escape double quotes by doubling them, and wrap values containing commas or quotes in double quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',');
    });

    // Join headers and rows with newlines
    return [headerRow, ...rows].join('\n');
};


export const CSVToObject = (data) => {
    // Split the CSV data into rows
    const rows = data.trim().split('\n');
    
    // Define the headers we want to extract
    const headers = rows[0].split(',').filter(header => 
        ['term', 'translation', 'notes'].includes(header)
    );

    // Map the remaining rows to objects, including only term, translation, notes
    const result = rows.slice(1).map(row => {
        const values = row.split(',');

        // Create an object for each row
        const object = {};
        headers.forEach((header, index) => {
            const value = values[index] ? values[index].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            object[header] = header === 'notes' && !value ? 'none' : value; // Set "none" if notes is empty
        });

        return object;
    });

    return result;
};


// Function to validate the CSV
export const validateCSVFormat = (csvData) => {
    const rows = csvData.trim().split('\n');

    if (rows.length < 1) {
        return { valid: false, error: "CSV file must contain headers." };
    }

    // Validate headers
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    const expectedHeaders = ['term', 'translation', 'notes'];
    if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
        return { valid: false, error: `CSV headers must be: ${expectedHeaders.join(', ')}` };
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
  