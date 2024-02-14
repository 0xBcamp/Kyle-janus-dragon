import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { moon_address, newAddressName, email } = req.body;
    console.log(moon_address);
    console.log(newAddressName);
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        // Check if the newAddressName is empty or has been used before
        if (!newAddressName || newAddressName.trim() === '') {
            return res.status(400).json({ message: 'Address name cannot be empty' });
        }

        // Check if the newAddressName is already in use
        const checkAddressSql = 'SELECT COUNT(*) as count FROM moon_addresses WHERE address_name = ? AND email = ?';
        const [countResult] = await connection.execute(checkAddressSql, [newAddressName, email]);

        // Type narrowing to check if countResult is of type RowDataPacket[]
        if (Array.isArray(countResult) && countResult.length > 0) {
            const count = countResult[0].count as number;
            if (count > 0) {
                return res.status(400).json({ message: 'Address name is already in use' });
            }
        }

        const addAddressSql = 'INSERT INTO moon_addresses (email, moon_address, address_name) VALUES (?, ?, ?)';
        const addedAddress = await connection.execute(addAddressSql, [email, moon_address, newAddressName]);
        res.status(200).json({ message: 'Address name updated successfully' });

    } catch (error) {
        console.error('Failed to update address name:', error);
        res.status(500).json({ message: 'Failed to update address name' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}