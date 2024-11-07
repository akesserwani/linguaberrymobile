
export const ObjectToCSV = (data) => {
    if (!data || !data.length) {
        return '';
    }

    // Exclude 'starred' from the headers
    const headers = Object.keys(data[0]).filter(key => key !== 'starred');
    const headerRow = headers.join(',');

    // Map each row to CSV format, excluding 'starred'
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
}


export const CSVToObject = (data) => {
    // Split the CSV data into rows
    const rows = data.trim().split('\n');
    
    // Extract the headers from the first row, excluding 'starred'
    const headers = rows[0].split(',').filter(header => header !== 'starred');

    // Map the remaining rows to objects, ignoring 'starred' if present
    const result = rows.slice(1).map(row => {
        const values = row.split(',');

        // Create an object for each row
        const object = {};
        headers.forEach((header, index) => {
            object[header] = values[index].replace(/^"|"$/g, '').replace(/""/g, '"'); // Remove surrounding quotes and unescape quotes
        });

        return object;
    });

    return result;
};
