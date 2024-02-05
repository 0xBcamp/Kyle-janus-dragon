// Define a type for the response data structure
type Entry = string;

// Function to call the findEntries API
export const getUnchosenUserAddresses = async (email: string): Promise<Entry[]> => {
    try {
        const response = await fetch('/api/getUnchosenUserAddresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data: Entry[] = await response.json();
        return data; // This will be the array of tuples [moon_array, address_name]
    } catch (error) {
        console.error('Failed to fetch entries:', error);
        throw error;
    }
}

