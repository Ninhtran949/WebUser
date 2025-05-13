import React, { useState } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import SupportDialog from './SupportDialog';
const SupportButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return <>
      <button onClick={() => setIsDialogOpen(true)} className="fixed bottom-6 right-6 bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-blue-900 transition z-40" aria-label="Get Support">
        <MessageCircleIcon size={24} />
      </button>
      <SupportDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>;
};
export default SupportButton;