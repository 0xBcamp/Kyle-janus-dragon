import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Function to find entries by email and return an array of tuples (moon_array, address_name)
export const findEntriesByEmail = async (email: string): Promise<[string, string][]> => {
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
        const sql = 'SELECT moon_array, address_name FROM moon_addresses WHERE email = ?';
        const values = [email];

        // Execute the query
        const [rows] = await connection.execute(sql, values);

        // Map the result to an array of tuples
        const results: [string, string][] = rows.map((row: any) => [row.moon_array, row.address_name]);
        return results;

    } catch (error) {
        // Handle any errors
        console.error('Failed to find entries:', error);
        throw error; // Rethrow to allow caller to handle
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.end();
        }
    }
};
