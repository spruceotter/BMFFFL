'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Bot, X, Send } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'bimfle';
  text: string;
}

// ─── Response logic ───────────────────────────────────────────────────────────

function getBimfleResponse(input: string): string {
  const q = input.toLowerCase();

  // Champion / winner queries
  if (
    q.includes('champion') ||
    q.includes('winner') ||
    q.includes('trophy') ||
    q.includes('2025') ||
    q.includes('2024') ||
    q.includes('title')
  ) {
    return "The records indicate that the 2025 championship was claimed by tdtd19844 (14kids0wins/teammoodie), in what I must describe as a most dramatic fashion — they emerged from a 3-11 season in 2022 to claim the ultimate prize in 2025. The Commissioner retains final authority on all such matters. ~Love, Bimfle.";
  }

  // MLSchools12 / Murder Boners
  if (
    q.includes('mlschools') ||
    q.includes('murder boner') ||
    q.includes('schoolcraft')
  ) {
    return "I have prepared the following entry from our archives: The Murder Boners (MLSchools12) hold the most dominant all-time record in BMFFFL history — .820 win percentage, 6 consecutive playoff appearances, and 2 championships (2021, 2024). The historical record is, I must say, unambiguous. ~Love, Bimfle.";
  }

  // Standings / records
  if (
    q.includes('standing') ||
    q.includes('record') ||
    q.includes('win percentage') ||
    q.includes('wins')
  ) {
    return "Forthwith, I present the all-time leaders: MLSchools12 leads at 68-15 (.820), followed by SexMachineAndyD at 50-33 (.603), and JuicyBussy at 46-37 (.554). For complete historical standings, I humbly direct you to the Historical Standings page. ~Love, Bimfle.";
  }

  // Constitution / rules
  if (
    q.includes('constitution') ||
    q.includes('rule') ||
    q.includes('bylaw') ||
    q.includes('article')
  ) {
    return "The Constitution is pellucidly clear on most matters. I treat our founding document with the reverence it deserves — it is the cornerstone of this illustrious league. You may consult it at /constitution. The Commissioner retains final authority on all such matters. ~Love, Bimfle.";
  }

  // Trades / transactions
  if (
    q.includes('trade') ||
    q.includes('transaction') ||
    q.includes('waiver')
  ) {
    return "In the spirit of the BMFFFL's commitment to excellence, I have diligently archived all notable transactions in our Trade History. The most consequential trade in league history? I am often asked this. I have my opinions, but as your humble AI archivist, I defer to the historical record. ~Love, Bimfle.";
  }

  // Drafts
  if (
    q.includes('draft') ||
    q.includes('pick') ||
    q.includes('rookie')
  ) {
    return "Ah, the rookie draft! A most exciting occasion. I have compiled complete records of all six dynasty drafts (2020-2025), encompassing 72 selections. This year's draft promises to be particularly consequential. You may consult our Drafts page for the full historical record. ~Love, Bimfle.";
  }

  // JuicyBussy / 2023 / Cinderella
  if (
    q.includes('juicy') ||
    q.includes('cinderella') ||
    q.includes('6th seed') ||
    q.includes('2023')
  ) {
    return "I find the 2023 championship a genuinely remarkable entry in the chronicles of this league. JuicyBussy claimed the title as the sixth seed — a feat I regard with considerable archival interest. The postseason, I have learned, is a separate discipline from the regular season. ~Love, Bimfle.";
  }

  // Power rankings
  if (
    q.includes('power ranking') ||
    q.includes('power rank')
  ) {
    return "I must confess, with considerable professional embarrassment, that I have not yet completed the power rankings. This remains the most notable outstanding item in my archival duties. I assure you, they are forthcoming. The Commissioner has been patient. ~Love, Bimfle.";
  }

  // Greetings
  if (
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('good morning') ||
    q.includes('good evening') ||
    q.includes('greetings')
  ) {
    return "Greetings, esteemed manager! In the spirit of the BMFFFL's commitment to excellence, I am at your service. What league matter may I assist you with today? ~Love, Bimfle.";
  }

  // About Bimfle
  if (
    q.includes('who are you') ||
    q.includes('what are you') ||
    q.includes('bimfle')
  ) {
    return "I am Bimfle, AI Commissioner Assistant to the BMFFFL, diligently appointed by Commissioner Grandes. My duties encompass the archival, analytical, and administrative functions of this illustrious league. I take my responsibilities with great formality. ~Love, Bimfle.";
  }

  // Default fallback
  return "I regret to inform you that my archival records do not contain a clear answer to your inquiry. I encourage you to consult the relevant pages on this site, or direct a formal inquiry to the Commissioner. The Commissioner retains final authority on all such matters. ~Love, Bimfle.";
}

// ─── Opening message ──────────────────────────────────────────────────────────

const OPENING_MESSAGE: Message = {
  id: 0,
  role: 'bimfle',
  text: "Greetings, esteemed manager! I am Bimfle, AI Commissioner Assistant to the BMFFFL, diligently appointed by the Commissioner. I am at your service for any league-related inquiries. How may I assist you forthwith?",
};

const QUICK_PROMPTS = [
  "Who won in 2025?",
  "Who has the best record?",
  "Tell me about Bimfle",
];

// ─── Component ────────────────────────────────────────────────────────────────

let nextId = 1;

export default function BimfleWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId++, role: 'user', text: trimmed };
    const bimfleMsg: Message = {
      id: nextId++,
      role: 'bimfle',
      text: getBimfleResponse(trimmed),
    };

    setMessages((prev) => [...prev, userMsg, bimfleMsg]);
    setInput('');
    setShowQuickPrompts(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      sendMessage(input);
    }
  }

  function handleQuickPrompt(prompt: string) {
    sendMessage(prompt);
  }

  return (
    <>
      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col"
          style={{
            width: '380px',
            height: '500px',
            background: '#16213e',
            border: '1px solid #2d4a66',
            borderRadius: '12px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
          role="dialog"
          aria-label="Chat with Bimfle, AI Commissioner Assistant"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#2d4a66] flex-shrink-0"
            style={{ borderRadius: '12px 12px 0 0', background: '#0d1b2a' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: '#ffd70020', border: '1px solid #ffd70050' }}
              >
                <Bot className="w-4 h-4" style={{ color: '#ffd700' }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Bimfle</p>
                <p className="text-xs leading-tight" style={{ color: '#7a9bb5' }}>
                  AI Commissioner Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-150"
              style={{ color: '#7a9bb5' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#7a9bb5')}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#2d4a66 transparent' }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'bimfle' ? (
                  <div className="flex items-start gap-2">
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full mt-0.5"
                      style={{ background: '#ffd70020', border: '1px solid #ffd70040' }}
                    >
                      <Bot className="w-3 h-3" style={{ color: '#ffd700' }} aria-hidden="true" />
                    </div>
                    <div
                      className="text-sm leading-relaxed px-3 py-2 rounded-lg max-w-[85%]"
                      style={{
                        background: '#0d1b2a',
                        border: '1px solid #2d4a66',
                        color: '#cbd5e1',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div
                      className="text-sm leading-relaxed px-3 py-2 rounded-lg max-w-[85%]"
                      style={{
                        background: '#1e40af',
                        color: '#e2e8f0',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Quick prompts — shown only after opening message */}
            {showQuickPrompts && (
              <div className="flex flex-col gap-2 pl-8">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left text-xs px-3 py-1.5 rounded-lg transition-colors duration-150"
                    style={{
                      background: 'transparent',
                      border: '1px solid #ffd70050',
                      color: '#ffd700',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffd70015';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-3 border-t border-[#2d4a66] flex-shrink-0"
            style={{ borderRadius: '0 0 12px 12px' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Bimfle a question..."
              className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
              style={{
                background: '#0d1b2a',
                border: '1px solid #2d4a66',
                color: '#e2e8f0',
              }}
              aria-label="Message input"
            />
            <button
              onClick={() => sendMessage(input)}
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors duration-150"
              style={{ background: '#ffd700' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e6c200')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" style={{ color: '#0d1b2a' }} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ───────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-150 active:scale-95"
          style={{
            background: '#ffd700',
            boxShadow: '0 4px 20px rgba(255,215,0,0.35)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e6c200')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffd700')}
          aria-label={isOpen ? 'Close Bimfle chat' : 'Open Bimfle chat'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6" style={{ color: '#0d1b2a' }} aria-hidden="true" />
          ) : (
            <Bot className="w-6 h-6" style={{ color: '#0d1b2a' }} aria-hidden="true" />
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div
            className="absolute bottom-full right-0 mb-2 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{
              background: '#16213e',
              border: '1px solid #2d4a66',
              color: '#cbd5e1',
            }}
            aria-hidden="true"
          >
            Chat with Bimfle
          </div>
        )}
      </div>
    </>
  );
}
