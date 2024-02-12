import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';

// Load environment variables from .env file
dotenv.config();

export default async function renameAddress(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    
    const { address, newAddressName } = req.body;
    
    if (newAddressName.length == 0) {
        res.status(400).json({ error: 'new name cannot be empty' });
        return;
    }
    let connection;
    try {
        // Create a connection to the database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        // Prepare and execute the SQL statement
        const sql = 'UPDATE moon_addresses SET address_name = ? WHERE moon_address = ?;';
        const values = [newAddressName, address];
        const [result] = await connection.execute(sql, values);

        // Check if the update was successful
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Renaming successful!", success: true });
        } else {
            // If no rows were affected, the address was not found or the new name is the same as the old
            res.status(404).json({ error: 'Address not found or new name is the same as the old name', success: false });
        }

    } catch (error) {
        console.error('Failed to rename address:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
