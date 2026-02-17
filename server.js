const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Interface GPT v2.3 (Final Fix - Template Literals)
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>AIOS GPT Brainstormer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #212121; color: #ececec; font-family: sans-serif; margin: 0; }
        .chat-container { height: calc(100vh - 160px); overflow-y: auto; scroll-behavior: smooth; }
        .message { max-width: 85%; margin-bottom: 20px; padding: 15px; border-radius: 12px; line-height: 1.5; }
        .user-message { background-color: #343541; margin-left: auto; border-bottom-right-radius: 2px; }
        .ai-message { background-color: #444654; margin-right: auto; border-bottom-left-radius: 2px; }
        .sidebar { background-color: #202123; width: 260px; height: 100vh; }
        .agent-badge { font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; display: inline-block; background: #1a7f37; }
    </style>
</head>
<body class="flex h-screen">
    <div class="sidebar hidden md:flex flex-col p-3">
        <div class="text-xs text-gray-500 font-bold p-2 uppercase">Squad Alpha</div>
        <div class="p-2 text-sm bg-gray-800 rounded-md flex items-center gap-3">
            <i class="fa fa-robot text-green-500"></i> @aios-master
        </div>
    </div>
    <div class="flex-1 flex flex-col relative">
        <header class="h-14 flex items-center justify-between px-6 border-b border-white/10">
            <div class="font-bold">AIOS <span class="text-green-500">FACTORY</span></div>
            <div class="text-xs text-green-500">● ONLINE</div>
        </header>
        <div id="chat-box" class="chat-container p-4">
            <div class="ai-message message">
                <span class="agent-badge">@aios-master</span>
                <p>Conexão DeepSeek 100% ativa. O que vamos construir?</p>
            </div>
        </div>
        <div class="absolute bottom-0 w-full p-6">
            <div class="max-w-3xl mx-auto relative">
                <textarea id="user-input" rows="1" class="w-full bg-[#40414f] border border-white/10 rounded-xl p-4 pr-12 outline-none" placeholder="Sua ideia aqui..."></textarea>
                <button id="send-btn" class="absolute right-3 bottom-3 text-white/30 hover:text-white">
                    <i class="fa fa-paper-plane text-xl"></i>
                </button>
            </div>
        </div>
    </div>
    <script>
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        async function handleSend() {
            const text = userInput.value.trim();
            if (!text) return;
            userInput.value = '';
            const uDiv = document.createElement('div');
            uDiv.className = 'message user-message';
            uDiv.textContent = text;
            chatBox.appendChild(uDiv);
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();
                const aDiv = document.createElement('div');
                aDiv.className = 'message ai-message';
                aDiv.innerHTML = '<span class="agent-badge">@aios-master</span><p>' + data.reply + '</p>';
                chatBox.appendChild(aDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            } catch (err) { alert('Erro de conexão'); }
        }
        document.getElementById('send-btn').onclick = handleSend;
        userInput.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
    </script>
</body>
</html>
  `;
  res.send(html);
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;

    if (message.startsWith('.')) {
        exec(message.substring(1).trim(), (e, stdout, stderr) => {
            res.json({ reply: (stdout || '') + (stderr || '') });
        });
        return;
    }

    try {
        const response = await axios.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: [{ role: "user", content: message }]
        }, {
            headers: { 'Authorization': 'Bearer ' + DEEPSEEK_KEY }
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (err) {
        res.json({ reply: "Erro: " + err.message });
    }
});

app.listen(port, () => console.log('Server running on ' + port));
