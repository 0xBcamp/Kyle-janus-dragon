// pages/api/addUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;
        try {
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            });

            const sql = 'INSERT INTO moon_users (email) VALUES (?)';
            const values = [email];

            const [result] = await connection.execute(sql, values);
            await connection.end();

            res.status(200).json({ message: 'User added successfully', result });
        } catch (error) {
            console.error('Failed to add user:', error);
            res.status(500).json({ message: 'Failed to add user' });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
