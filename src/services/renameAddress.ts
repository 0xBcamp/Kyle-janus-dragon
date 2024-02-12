export const renameAddress = async (address: string, newAddressName: string): Promise<boolean> => {
    const response = await fetch('/api/renameAddress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, newAddressName }),
    });

    if (!response.ok) {
        throw new Error('Failed to rename address');
    }

    const data = await response.json();
    console.log(data.message); // Assuming you want to log the message from the server

    return data.success; // Expecting the server to return a success flag
};
