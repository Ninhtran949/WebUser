import React, { useState, useEffect, useRef } from 'react';
import { XIcon, SendIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  type: 'chat' | 'serverMessage';
  sender?: string;
  message: string;
  timestamp?: string;
}

interface SupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportDialog = ({
  isOpen,
  onClose
}: SupportDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Kết nối WebSocket khi component mount và dialog mở
  useEffect(() => {
    if (isOpen && user) {
      const wss = new WebSocket('wss://book-store-api-ewcr.onrender.com');
      wsRef.current = wss;

      wss.onopen = () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        // Gửi tên người dùng để đăng ký
        wss.send(JSON.stringify({
          type: 'setName',
          name: user.name
        }));
      };

      wss.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessage: Message = {
          type: data.type,
          sender: data.sender || 'System',
          message: data.message,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, newMessage]);
      };

      wss.onclose = () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [isOpen, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      text: inputMessage
    }));

    setInputMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative flex flex-col h-[600px] sm:h-[500px]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Customer Support</h2>
            <p className="text-sm text-gray-500">
              {connected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-3 max-w-[80%] ${
                  msg.sender === user?.name 
                    ? 'bg-blue-800 text-white' 
                    : 'bg-gray-100'
                }`}>
                  {msg.type === 'serverMessage' ? (
                    <p className="text-sm italic">{msg.message}</p>
                  ) : (
                    <>
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {msg.sender} • {msg.timestamp}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              disabled={!connected}
              className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition disabled:opacity-50"
            >
              <SendIcon size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportDialog;