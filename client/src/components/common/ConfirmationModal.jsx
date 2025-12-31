import React from "react";
import { AlertCircle, X } from "lucide-react";

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.", 
    confirmText = "Delete", 
    cancelText = "Cancel",
    type = "danger"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div 
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    {/* Icon - Changes color based on type */}
                    <div className={`p-4 rounded-2xl mb-4 ${
                        type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                        <AlertCircle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full mt-8">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            className={`flex-1 py-3 text-white rounded-xl font-bold transition-all shadow-lg ${
                                type === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-100' 
                                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;