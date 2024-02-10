// pages/api/addUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import { RowDataPacket, FieldPacket } from 'mysql2';

export default async function addUser(req: NextApiRequest, res: NextApiResponse) {
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
        // if the user doesn't yet exist...
        if (users.length == 0) {
            console.log('new user of this UI:', email, '...');
            //...add the user!
            const addUserSQL = 'INSERT INTO moon_users (email, unnamed_num) VALUES (?, ?)';
            let unnamed_num = 1;
            await connection.query(addUserSQL, [email, unnamed_num]);
            // ...update their addresses in the database (if they have any!)...
            if (addresses && addresses.length) {
                const insertAddressSql = 'INSERT INTO moon_addresses (email, moon_address, address_name) VALUES (?, ?, ?)'; // Corrected the number of placeholders to 3
                for (const address of addresses) {
                    // Correctly interpolate unnamed_num in the address name
                    await connection.execute(insertAddressSql, [email, address, `Unnamed Address ${unnamed_num}`]);
                    unnamed_num += 1;
                    console.log('existing address added', address);
                    console.log('unnamed_num increased to', unnamed_num);
                }
                // After inserting addresses, update the user's unnamed_num value with the final count
                const updateUnnamedNumSQL = 'UPDATE moon_users SET unnamed_num = ? WHERE email = ?';
                // Note the reversed order of parameters compared to the INSERT query
                await connection.query(updateUnnamedNumSQL, [unnamed_num, email]);

            }
            console.log('new user unnamed num:', unnamed_num);
            //...then, update the user's unnamed_num value!
            return res.status(200).json({ message: 'new User added!' });
        }
        //if the user does exist already...
        else{
            console.log('welcoming back', users[0].email, '...');
            //check if the user has changed their addresses when not using our interface
            //if the user deleted all of their addresses when gone, remove from our database
            if (addresses.length == 0) {
                //delete all user addresses associated with the user's email
                const removeUserAddresses = 'DELETE FROM moon_addresses WHERE email = ?';
                await connection.execute(removeUserAddresses, [email]);
            }
            else {
                //get all previous user addresses
                const getPreviousUserAddresses = 'SELECT moon_address FROM moon_addresses WHERE email = ?';
                const [previousUserAddressesResults] = await connection.query(getPreviousUserAddresses, [email]) as [RowDataPacket[], FieldPacket[]]; // Type assertion here
                const previousUserAddresses = previousUserAddressesResults.map((result) => result.moon_address);
                const previousUserAddressesDict = previousUserAddresses.reduce((acc: {[key: string]: boolean}, address: string) => {
                    acc[address] = false; // Initialize all as not found (false)
                    return acc;
                }, {});
                console.log('got previously stored user addresses (automatically set to false):', previousUserAddressesDict);
                console.log('will set an address to true if the address has not been deleted...');

                // Get the current unnamed_num for the user
                const getUnnamedNum = 'SELECT unnamed_num FROM moon_users WHERE email = ?';
                const [[{ unnamed_num: unnamedNumResult }]] = await connection.query(getUnnamedNum, [email]) as [RowDataPacket[], FieldPacket[]]; // Type assertion here
                let unnamedNum = unnamedNumResult;
                let newUnnamedNum = unnamedNum;
                
                console.log('adding new addresses if needed!');
                for (const address of addresses){
                    //1. check if the address is still in the previous user addresses:
                    //if the address is not in the previous...
                    if (!(address in previousUserAddressesDict)){
                        //add it!
                        console.log('address not in previous!:', address);
                        const addNewOutsideUserAddress = 'INSERT INTO moon_addresses (email, moon_address, address_name) VALUES (?, ?, ?)';
                        await connection.execute(addNewOutsideUserAddress, [email, address, `Unnamed Address ${newUnnamedNum}` ]);
                        newUnnamedNum += 1;
                        console.log('address', address, "added");
                    }
                    //if the address is in the previous addresses, set its dictionary value to true
                    else{
                        previousUserAddressesDict[address] = true;
                        console.log(address, 'set to true');
                    }
                }
                // At the end of all of this, update your unnamed_num if necessary:
                console.log('unnamedNum: ', unnamedNum);
                if (newUnnamedNum > unnamedNum){
                    const updateUnnamedNumSQL = 'UPDATE moon_users SET unnamed_num = ? WHERE email = ?';
                    await connection.query(updateUnnamedNumSQL, [newUnnamedNum, email]);
                    console.log('updated unnamed_num to', newUnnamedNum);
                }
                //...and loop through the dictionary, deleting all addresses from the database that are still set to false
                console.log('deleting addresses deleted outside of this UI...');
                for (const address in previousUserAddressesDict){
                    if (previousUserAddressesDict[address] == false ){
                        const deleteUserAddress = 'DELETE FROM moon_addresses WHERE email = ? AND moon_address = ?';
                        await connection.execute(deleteUserAddress, [email]);
                        console.log('deleted', address)
                    }
                }
            }
            res.status(200).json({ message: 'welcomed back user!' });
        }

        // Start a transaction
        await connection.beginTransaction();

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
