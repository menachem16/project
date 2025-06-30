import React, { useState } from 'react';
import { X, Radio, Phone, MessageSquare, Satellite, Wifi, Signal } from 'lucide-react';
import { GameState } from '../types/game';

interface CommunicationsPanelProps {
  onClose: () => void;
  onOperation: (operation: any) => void;
  isDayMode: boolean;
  gameState: GameState;
}

const COMMUNICATION_CHANNELS = [
  {
    id: 'diplomatic',
    name: 'ערוץ דיפלומטי',
    description: 'תקשורת עם שגרירויות',
    icon: '🏛️',
    status: 'active',
    encryption: 'high'
  },
  {
    id: 'military',
    name: 'ערוץ צבאי',
    description: 'תקשורת עם כוחות צה"ל',
    icon: '🎖️',
    status: 'active',
    encryption: 'maximum'
  },
  {
    id: 'intelligence',
    name: 'ערוץ מודיעין',
    description: 'תקשורת עם סוכנויות',
    icon: '🕵️',
    status: 'active',
    encryption: 'maximum'
  },
  {
    id: 'emergency',
    name: 'ערוץ חירום',
    description: 'תקשורת חירום עם אזרחים',
    icon: '🚨',
    status: 'standby',
    encryption: 'medium'
  },
  {
    id: 'international',
    name: 'ערוץ בינלאומי',
    description: 'תקשורת עם ארגונים בינלאומיים',
    icon: '🌍',
    status: 'active',
    encryption: 'high'
  }
];

const COMMUNICATION_OPERATIONS = [
  {
    id: 'broadcast_message',
    name: 'שידור הודעה',
    description: 'שידור הודעה לציבור',
    duration: 2,
    priority: 'medium'
  },
  {
    id: 'secure_call',
    name: 'שיחה מאובטחת',
    description: 'שיחה מוצפנת עם גורם זר',
    duration: 5,
    priority: 'high'
  },
  {
    id: 'emergency_alert',
    name: 'התראת חירום',
    description: 'התראה לכל האוכלוסייה',
    duration: 1,
    priority: 'critical'
  },
  {
    id: 'intelligence_transmission',
    name: 'העברת מודיעין',
    description: 'העברת מידע מודיעיני',
    duration: 3,
    priority: 'high'
  }
];

export const CommunicationsPanel: React.FC<CommunicationsPanelProps> = ({
  onClose,
  onOperation,
  isDayMode,
  gameState
}) => {
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [message, setMessage] = useState('');
  const [activeTransmissions, setActiveTransmissions] = useState<any[]>([]);

  const handleSendMessage = () => {
    if (!selectedChannel || !selectedOperation || !message.trim()) {
      alert('יש למלא את כל השדות');
      return;
    }

    const operation = COMMUNICATION_OPERATIONS.find(op => op.id === selectedOperation);
    const channel = COMMUNICATION_CHANNELS.find(ch => ch.id === selectedChannel);
    
    if (!operation || !channel) return;

    const transmission = {
      id: Date.now(),
      channel: channel.name,
      operation: operation.name,
      message: message.trim(),
      timestamp: new Date(),
      status: 'transmitting'
    };

    setActiveTransmissions(prev => [...prev, transmission]);
    onOperation(transmission);

    // Simulate transmission completion
    setTimeout(() => {
      setActiveTransmissions(prev => 
        prev.map(t => 
          t.id === transmission.id 
            ? { ...t, status: 'completed' }
            : t
        )
      );
    }, operation.duration * 1000);

    setMessage('');
    setSelectedChannel('');
    setSelectedOperation('');
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
        isDayMode ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Header */}
        <div className={`p-4 md:p-6 border-b ${
          isDayMode ? 'border-gray-200' : 'border-gray-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6 md:w-8 md:h-8 text-pink-500" />
              <h2 className={`text-xl md:text-2xl font-bold ${
                isDayMode ? 'text-gray-800' : 'text-white'
              }`}>
                מרכז תקשורת מתקדם
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDayMode 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-gray-700 text-gray-400'
              }`}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Communication Channels */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              ערוצי תקשורת
            </h3>
            <div className="space-y-3">
              {COMMUNICATION_CHANNELS.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedChannel === channel.id
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{channel.icon}</span>
                    <div className="flex-1">
                      <span className={`font-bold block ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {channel.name}
                      </span>
                      <span className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {channel.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        channel.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {channel.status === 'active' ? 'פעיל' : 'המתנה'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        channel.encryption === 'maximum' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        channel.encryption === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {channel.encryption === 'maximum' ? 'הצפנה מקסימלית' :
                         channel.encryption === 'high' ? 'הצפנה גבוהה' : 'הצפנה בינונית'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Operations and Message */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              סוג פעולה
            </h3>
            <div className="space-y-3 mb-6">
              {COMMUNICATION_OPERATIONS.map((operation) => (
                <button
                  key={operation.id}
                  onClick={() => setSelectedOperation(operation.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedOperation === operation.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDayMode
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-medium block ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {operation.name}
                      </span>
                      <span className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {operation.description}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        operation.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        operation.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {operation.priority === 'critical' ? 'קריטי' :
                         operation.priority === 'high' ? 'גבוה' : 'בינוני'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {operation.duration} שניות
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDayMode ? 'text-gray-700' : 'text-gray-300'
              }`}>
                תוכן ההודעה
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="הקלד את תוכן ההודעה כאן..."
                className={`w-full h-32 p-3 rounded-lg border resize-none ${
                  isDayMode 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-700 text-white'
                } focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!selectedChannel || !selectedOperation || !message.trim()}
              className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-all ${
                selectedChannel && selectedOperation && message.trim()
                  ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              📡 שלח הודעה
            </button>
          </div>
        </div>

        {/* Active Transmissions */}
        {activeTransmissions.length > 0 && (
          <div className={`p-4 md:p-6 border-t ${
            isDayMode ? 'border-gray-200' : 'border-gray-700'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDayMode ? 'text-gray-800' : 'text-white'
            }`}>
              שידורים פעילים
            </h3>
            <div className="space-y-3">
              {activeTransmissions.map((transmission) => (
                <div
                  key={transmission.id}
                  className={`p-4 rounded-lg border ${
                    transmission.status === 'transmitting' 
                      ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`font-bold ${
                        isDayMode ? 'text-gray-800' : 'text-white'
                      }`}>
                        {transmission.operation} - {transmission.channel}
                      </span>
                      <div className={`text-sm ${
                        isDayMode ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {transmission.timestamp.toLocaleTimeString('he-IL')}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transmission.status === 'transmitting' 
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-green-500 text-white'
                    }`}>
                      {transmission.status === 'transmitting' ? '📡 משדר' : '✅ הושלם'}
                    </span>
                  </div>
                  <div className={`text-sm p-2 rounded ${
                    isDayMode ? 'bg-gray-100' : 'bg-gray-600'
                  }`}>
                    {transmission.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communication Status */}
        <div className={`p-4 md:p-6 border-t ${
          isDayMode ? 'border-gray-200 bg-gray-50' : 'border-gray-700 bg-gray-700'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDayMode ? 'text-gray-800' : 'text-white'
          }`}>
            סטטוס תקשורת
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-green-600' : 'text-green-400'
              }`}>
                {COMMUNICATION_CHANNELS.filter(ch => ch.status === 'active').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                ערוצים פעילים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {activeTransmissions.filter(t => t.status === 'transmitting').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                שידורים פעילים
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-purple-600' : 'text-purple-400'
              }`}>
                {activeTransmissions.filter(t => t.status === 'completed').length}
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                הודעות נשלחו
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${
                isDayMode ? 'text-orange-600' : 'text-orange-400'
              }`}>
                100%
              </div>
              <div className={`text-sm ${
                isDayMode ? 'text-gray-600' : 'text-gray-400'
              }`}>
                איכות אות
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};