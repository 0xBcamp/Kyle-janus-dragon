import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, newAddressName } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        if (!newAddressName || newAddressName.trim() === '') {
            return res.status(400).json({ message: 'Address name cannot be empty' });
        }

        const checkAddressSql = 'SELECT COUNT(*) as count FROM moon_addresses WHERE address_name = ? AND email = ?';
        const [countResult] = await connection.execute(checkAddressSql, [newAddressName, email]);
        if (Array.isArray(countResult) && countResult.length > 0) {
            const count = countResult[0].count as number;
            if (count > 0) {
                return res.status(200).json({ isUsed: true });
            }
        }
        return res.status(200).json({ isUsed: false });

    } catch (error) {
        console.error('Failed to check if address name is already used:', error);
        res.status(500).json({ message: 'Failed to check address name' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
