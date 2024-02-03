export const addUser = async (email: string): Promise<void> => {
    const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Failed to add user');
    }

    const data = await response.json();
    console.log(data.message);
};
