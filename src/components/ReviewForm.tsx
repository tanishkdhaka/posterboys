import React from 'react'

function ReviewForm({isOpen, onClose}:{isOpen:boolean, onClose:()=>void}) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-999999 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Write a Review `temporary needs fixing `</h2>
                <textarea
                className="w-full p-2 border border-gray-300 rounded mb-4"
                rows={4}
                placeholder="Share your experience..."
                />
                <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                    // Handle review submission logic here
                    onClose();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Submit
                </button>
                </div>
            </div>
        </div>
      );
}

export default ReviewForm