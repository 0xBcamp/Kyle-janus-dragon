import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { moon_address, email } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

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
