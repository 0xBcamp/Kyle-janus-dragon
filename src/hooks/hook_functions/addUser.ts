export const addUser = async (email: string, addresses: string[]): Promise<void> => {
    const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, addresses }), // Include both email and addresses in the body
    });

    if (!response.ok) {
        throw new Error('Failed to add user');
    }

    const data = await response.json();
    console.log(data.message);
};
