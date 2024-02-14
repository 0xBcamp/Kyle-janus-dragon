/**
 * ConnectToMoonSection Component
 *
 * Usage: This component renders a UI section that allows users to initiate a connection to the Moon service.
 * It displays a button that users can click to connect.
 *
 * Props:
 *  - onConnect: A callback function that is called when the user clicks the "Connect to Moon" button.
 *    This function should contain or trigger the logic to initialize the connection to the Moon service.
 *
 *  - loading: A boolean value that indicates whether the connection process is currently ongoing.
 *    When `true`, the button text changes to "Connecting..." to inform the user that the connection
 *    process is in progress. Otherwise, the button shows "Initialize & Connect to Moon".
 *
 *  - error: A string or null value that contains the error message if an error occurs during the
 *    connection process. If an error is present (i.e., `error` is not null), it is displayed below
 *    the button to inform the user of the issue.
 *
 * Example usage:
 * ```tsx
 * <ConnectToMoonSection
 *   onConnect={handleConnectToMoon}
 *   loading={isConnecting}
 *   error={connectionError}
 * />
 * ```
 *
 * Where `handleConnectToMoon` is a function that initiates the connection process,
 * `isConnecting` is a boolean state indicating if the connection is in progress,
 * and `connectionError` is the current error message or null.
 *
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */

import { Poppins } from "next/font/google";
import React from "react";
import { cn } from "@/utils/utils";

interface ConnectToMoonSectionProps {
  onConnect: () => void;
  loading: boolean;
  error: string | null;
}

const font = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const font2 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const ConnectToMoonSection: React.FC<ConnectToMoonSectionProps> = ({
  onConnect,
  loading,
  error,
}) => {
  return (
    <React.Fragment>
      <div className="moon-cont">
          <h2
            className={cn(
              "text-4xl font-bold mb-4 text-center moon-title",
              font2.className
            )}
          >
            Initialize & Connect to Moon
          </h2>
          <button
            type="button"
            className={cn("bg-blue-500 text-white p-2 rounded moon-btn", font.className)}
            onClick={onConnect}
          >
            {loading ? "Connecting..." : "Initialize & Connect to Moon"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    </React.Fragment>
  );
};

export default ConnectToMoonSection;
