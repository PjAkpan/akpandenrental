import React from "react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <button
          onClick={onClose}
          className="text-red-600 font-bold float-right hover:text-red-800"
        >
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">Payment Receipt</h2>
        {receiptUrl ? (
          <iframe
            src={receiptUrl}
            title="Payment Receipt"
            className="w-full h-96 border"
          />
        ) : (
          <p>Loading receipt...</p>
        )}
      </div>
    </div>
  );
};

export default ReceiptModal;
