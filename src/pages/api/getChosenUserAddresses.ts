import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';

// Load environment variables from .env file
dotenv.config();

// Function to find entries by email and return an array of tuples (moon_array, address_name)
export default async function getChosenUserAddresses(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    
    const { email } = req.body;
    
    if (typeof email !== 'string') {
        res.status(400).json({ error: 'Email must be a string' });
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

        // Prepare the SQL statement to select the required columns
        const sql = 'SELECT moon_address, address_name FROM moon_addresses WHERE email = ? AND address_name IS NOT NULL';
        const values = [email];

        // Execute the query
        const [rows] = await connection.execute(sql, values);

        // Map the result to an array of tuples
        const results: [string, string][] = rows.map((row: any) => [row.moon_address, row.address_name]);
        res.status(200).json(results);

    } catch (error) {
        // Handle any errors
        console.error('Failed to find entries:', error);
        res.status(500).json({ error: 'Failed to find entries' });
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.end();
        }
    }
};
