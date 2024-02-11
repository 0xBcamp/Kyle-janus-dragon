// Function to call the checkIfAddressNameExists API
export const checkIfAddressNameExists = async (email: string, newAddressName: string): Promise<boolean> => {
    try {
        const response = await fetch('/api/checkIfAddressNameExists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, newAddressName}),
        });

        if (!response.ok) {
            // Log the error or handle it as per your application's error handling logic
            console.error('Network response was not ok');
            return false; // Assuming false in case of network errors
        }

        // Await the parsing of the JSON response body
        const data = await response.json(); 

        return data.isUsed; // Assuming API returns { isUsed: boolean }

    } catch (error) {
        console.error('Failed to check if address name exists:', error);
        return false; // Assuming false in case of exceptions
    }
}
