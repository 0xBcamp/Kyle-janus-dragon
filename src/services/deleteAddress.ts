// Function to call the addChosenUserAddress API
export const deleteAddress = async (moon_address: string, email: string) => {
    try {
        const response = await fetch('/api/addUserAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moon_address, email }),
        });
        const statusCode = response.status;

        // Await the parsing of the JSON response body
        const data = await response.json(); 

        if (!response.ok) {
            // Use the message from the server if available, otherwise use a generic error message
            const errorMessage = data.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        return { statusCode, message: data.message };

    } catch (error) {
        console.error('Failed to add user address as chosen:', error);
        throw error;
    }
}