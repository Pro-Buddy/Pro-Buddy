import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ currentView }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I am your Pro Buddy assistant. Need help navigating the site?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.text, section: currentView })
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error.' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, network error.' }]);
        }
        setLoading(false);
    };

    return (
        <>
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                💬
            </button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h4>Platform Assistant</h4>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-message \${m.role}`}>
                                {m.text}
                            </div>
                        ))}
                        {loading && <div className="chat-message assistant">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input 
                            type="text" 
                            placeholder="Ask about using the site..." 
                            value={input} 
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}
