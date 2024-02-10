// Define a type for the response data structure
type Entry = [string, string];

// Function to call the findEntries API
export const getUserAddresses = async (email: string): Promise<Entry[]> => {
    try {
        const response = await fetch('/api/getUserAddresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            console.error('API error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }

        const data: Entry[] = await response.json();
        return data; // This will be the array of tuples [moon_array, address_name]
    } catch (error) {
        console.error('Failed to fetch entries:', error);
        throw error;
    }
}

