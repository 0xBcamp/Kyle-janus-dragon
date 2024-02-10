import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { moon_address, newAddressName } = req.body;
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
        const checkAddressSql = 'SELECT COUNT(*) as count FROM moon_addresses WHERE address_name = ?';
        const [countResult] = await connection.execute(checkAddressSql, [newAddressName]);

        // Type narrowing to check if countResult is of type RowDataPacket[]
        if (Array.isArray(countResult) && countResult.length > 0) {
            const count = countResult[0].count as number;
            if (count > 0) {
                return res.status(400).json({ message: 'Address name is already in use' });
            }
        }

        const updateAddressSql = 'UPDATE moon_addresses SET address_name = ? WHERE moon_address = ?';
        const [result] = await connection.execute(updateAddressSql, [newAddressName, moon_address]);

        // Type narrowing to check if result is of type ResultSetHeader
        if ('affectedRows' in result) {
            const updateResult = result as mysql.ResultSetHeader;
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Address not found' });
            }

            res.status(200).json({ message: 'Address name updated successfully' });
        } else {
            throw new Error('Unexpected result type');
        }
    } catch (error) {
        console.error('Failed to update address name:', error);
        res.status(500).json({ message: 'Failed to update address name' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
