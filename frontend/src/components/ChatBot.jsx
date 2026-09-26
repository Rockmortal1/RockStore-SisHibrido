import { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy Rocky 🤖. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Agregamos el mensaje del usuario a la pantalla
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    try {
      // 2. Le hablamos a Python
      const response = await axios.post(`${import.meta.env.VITE_CORE_API_URL}/api/chat`, {
        message: userMsg
      });

      // 3. Mostramos la respuesta de Rocky
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error("Error en el chat:", error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Mmm, parece que mis servidores están desconectados. Intenta más tarde.' 
      }]);
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          backgroundColor: '#ee4419', color: '#fff', border: 'none',
          borderRadius: '50%', width: '60px', height: '60px',
          fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
      >
        💬
      </button>

      {/* VENTANA DE CHAT */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '320px', height: '450px', backgroundColor: '#111827',
          border: '1px solid #374151', borderRadius: '12px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 10px 15px rgba(0,0,0,0.5)', zIndex: 1000
        }}>
          {/* Cabecera */}
          <div style={{ backgroundColor: '#1F2937', padding: '15px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#F9FAFB', fontSize: '1.1rem' }}>Rocky - Soporte IA</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>✖</button>
          </div>

          {/* Historial de Mensajes */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#ee4419' : '#374151',
                color: '#F9FAFB', padding: '10px 15px', borderRadius: '8px',
                maxWidth: '80%', fontSize: '0.9rem', lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Caja de Texto */}
          <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', backgroundColor: '#1F2937', borderTop: '1px solid #374151' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..." 
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#374151', color: '#F9FAFB', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: '#ee4419', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 15px', marginLeft: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              ▶
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;