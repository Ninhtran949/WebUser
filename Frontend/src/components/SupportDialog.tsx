import React, { useState, useEffect, useRef } from 'react';
import { 
  XIcon, 
  SendIcon, 
  UserIcon, 
  MessageSquareIcon, 
  CircleCheckIcon 
} from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative flex flex-col h-[600px] sm:h-[500px] shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <MessageSquareIcon size={20} className="text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Customer Support</h2>
              <div className="flex items-center text-sm text-blue-100 gap-1">
                {connected ? (
                  <>
                    <CircleCheckIcon size={14} className="text-green-400" />
                    <span>Connected</span>
                  </>
                ) : (
                  <span>Connecting...</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-5 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {msg.sender !== user?.name && (
                  <div className="flex-shrink-0">
                    {msg.type === 'serverMessage' ? (
                      <div className="bg-gray-300 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                        <MessageSquareIcon
                          size={16}
                          className="text-gray-600"
                        />
                      </div>
                    ) : (
                      <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                        <UserIcon size={16} className="text-blue-600" />
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3 max-w-[80%] ${
                    msg.sender === user?.name 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : msg.type === 'serverMessage' 
                        ? 'bg-gray-200 text-gray-700 rounded-bl-none' 
                        : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.type === 'serverMessage' ? (
                    <p className="text-sm">{msg.message}</p>
                  ) : (
                    <>
                      <p className="text-sm">{msg.message}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          msg.sender === user?.name ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {msg.sender} • {msg.timestamp}
                      </span>
                    </>
                  )}
                </div>
                {msg.sender === user?.name && (
                  <div className="flex-shrink-0">
                    <div className="bg-blue-700 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                      <UserIcon size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit"
              disabled={!connected}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
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