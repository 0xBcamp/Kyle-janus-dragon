/**
 * Component File: AddAddressComponent
 * Description: This component provides a user interface for adding new addresses associated with a user's account.
 * It allows users to enter a name for a new address and handles the creation and association of this address with
 * the user's account via the MoonSDK.
 *
 * Props:
 *   - onAddressAdded: Callback function to be called upon successful addition of an address.
 *   - onBack: Callback function to handle the user's request to go back or cancel the operation.
 *   - moon: An instance of MoonSDK to interact with blockchain accounts.
 *   - email: The email of the user, used for associating the new address.
 *
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */

import React, { useState, useEffect } from "react";
import { addUserAddress } from "@/services/addUserAddress"; // Import service to add user address to backend/database
import { MoonSDK } from "@moonup/moon-sdk"; // Import MoonSDK for blockchain interactions
import { checkIfAddressNameExists } from "@/services/checkIfAddressNameExists"; // Service to check for address name uniqueness
import { IoCloseOutline } from "react-icons/io5";

interface AddAddressComponentProps {
  onAddressAdded: () => void;
  onBack: () => void;
  moon: MoonSDK;
  email: string;
}

const AddAddressComponent: React.FC<AddAddressComponentProps> = ({
  onAddressAdded,
  onBack,
  moon,
  email,
}) => {
  const [newAddressName, setNewAddressName] = useState(""); // State for storing the input value of the new address name
  const [loading, setLoading] = useState(false); // State to manage loading indicator/behavior
  const [error, setError] = useState<string | null>(null); // State to capture and display any error messages

  /*** handleSubmit() ***/
  // Function to handle the submission of the new address name
  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!moon) {
        // Ensure MoonSDK instance is available
        throw new Error("Moon SDK is not initialized");
      }

      // Check if the address name already exists to avoid duplicates
      const addressNameExists = await checkIfAddressNameExists(
        email,
        newAddressName
      );
      if (!addressNameExists) {
        // If unique, create a new account/address with MoonSDK
        const newAccount = await moon.getAccountsSDK().createAccount({});
        const newAddress = newAccount.data.data.address;

        // Add the new address to the user's account
        await addUserAddress(newAddress, newAddressName, email);
        onAddressAdded(); // Call the callback
      } else {
        setError("Address name already used! Use a different name!");
      }
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="moon-cont">
        <input
          className="input2"
          type="text"
          placeholder="Name of new address"
          value={newAddressName}
          onChange={(e) => setNewAddressName(e.target.value)}
          disabled={loading} // Disable input during loading
        />
        <div className="moon-cont2"> 
          <button
            className="moon-btn4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Address"}
          </button>
          <button className="moon-btn5" onClick={onBack} disabled={loading}>
            <IoCloseOutline size={32} />
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </React.Fragment>
  );
};

export default AddAddressComponent;
