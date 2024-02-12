import React from 'react';

// Define the props interface
interface ConnectToMoonSectionProps {
  onConnect: () => void; // Assuming onConnect is a function that takes no arguments and returns void
  loading: boolean;
  error: string | null; // Assuming error could be a string or null
}

// Correctly define the component with TypeScript
const ConnectToMoonSection: React.FC<ConnectToMoonSectionProps> = ({ onConnect, loading, error }) => {
    return(
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Initialize & Connect to Moon</h2>
            <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded"
                onClick={onConnect}
            >
                {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ConnectToMoonSection;
