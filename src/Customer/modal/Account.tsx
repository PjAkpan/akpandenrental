import React, { useState, useEffect } from "react";

const AccountModal = ({ closeModal }: { closeModal: () => void }) => {
  const [accountDetails, setAccountDetails] = useState<
    { bankName: string; accountNumber: string; accountHolder: string }[]
  >([]);

  // Simulate fetching account details with a delay
  useEffect(() => {
    setTimeout(() => {
      setAccountDetails([
        {
          bankName: "Union Bank",
          accountNumber: "0032022628",
          accountHolder: "Akpan Akpan J",
        },
        {
          bankName: "UBA Bank",
          accountNumber: "2001018695",
          accountHolder: "Akpan Johnson Akpan",
        },
      ]);
    }, 1000); // Simulate delay for fetching account details
  }, []);

  // Copy account number to clipboard
  const handleCopy = (text: string) => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not available");
      alert("Unable to copy, Clipboard API not supported.");
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform scale-90 transition-transform duration-500 ease-in-out">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Account Details
        </h2>

        {/* Display account details */}
        {accountDetails.length === 0 ? (
          <p className="text-gray-600 text-center">Loading account details...</p>
        ) : (
          accountDetails.map((account, index) => (
            <div
              key={index}
              className="mb-6 p-4 bg-gray-100 rounded-lg shadow-lg transform transition-all hover:scale-105"
            >
              <p className="text-gray-800 font-bold">
                Bank Name: <span className="font-normal">{account.bankName}</span>
              </p>
              <p className="text-gray-800 font-bold flex items-center justify-between">
                Account Number:{" "}
                <span className="font-normal">{account.accountNumber}</span>
                <button
                  className="ml-2 text-orange-500 hover:text-orange-600 transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleCopy(account.accountNumber)}
                >
                  Copy
                </button>
              </p>
              <p className="text-gray-800 font-bold">
                Account Holder: <span className="font-normal">{account.accountHolder}</span>
              </p>
            </div>
          ))
        )}

        {/* Close Modal Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal} // Close the modal
            className="mt-4 bg-orange-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-orange-600 transform transition-all hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
