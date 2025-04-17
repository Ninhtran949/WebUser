import React from 'react';
import { XIcon, SendIcon } from 'lucide-react';
interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
const SupportDialog = ({
  isOpen,
  onClose
}: SupportDialogProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative flex flex-col h-[600px] sm:h-[500px]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Customer Support</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">Hello! How can we help you today?</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  Support Team • Just now
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Type your message..." className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
            <button type="submit" className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition">
              <SendIcon size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export default SupportDialog;