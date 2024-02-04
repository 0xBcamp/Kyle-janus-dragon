// pages/api/addUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, addresses } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        // First, check if the user already exists
        const checkSql = 'SELECT email FROM moon_users WHERE email = ? LIMIT 1';
        const [users] = await connection.query(checkSql, [email]);
        if (users.length > 0) {
            // User already exists, do nothing
            return res.status(200).json({ message: 'User already exists' });
        }

        // Start a transaction
        await connection.beginTransaction();
        // Insert the new user
        const insertUserSql = 'INSERT INTO moon_users (email) VALUES (?)';
        await connection.execute(insertUserSql, [email]);
        // Insert each address associated with the email
        if (addresses && addresses.length) {
            const insertAddressSql = 'INSERT INTO moon_addresses (email, moon_address) VALUES (?, ?)';
            for (const address of addresses) {
                await connection.execute(insertAddressSql, [email, address]);
            }
        }

        // Commit the transaction
        await connection.commit();

        res.status(200).json({ message: 'User and addresses added successfully' });
    } catch (error) {
        // If an error occurs, roll back any changes made during the transaction
        if (connection) {
            await connection.rollback();
        }

        console.error('Failed to add user and addresses:', error);
        res.status(500).json({ message: 'Failed to add user and addresses' });
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.end();
        }
    }
}
