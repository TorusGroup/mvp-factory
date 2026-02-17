const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// HTML da Interface GPT v2.1 (Correção de Roteamento)
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIOS GPT Brainstormer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #212121; color: #ececec; font-family: sans-serif; }
        .chat-container { height: calc(100vh - 160px); overflow-y: auto; scroll-behavior: smooth; }
        .message { max-width: 85%; margin-bottom: 20px; padding: 15px; border-radius: 12px; line-height: 1.5; }
        .user-message { background-color: #343541; margin-left: auto; border-bottom-right-radius: 2px; border: 1px solid #444; }
        .ai-message { background-color: #444654; margin-right: auto; border-bottom-left-radius: 2px; border: 1px solid #555; }
        .sidebar { background-color: #202123; width: 260px; }
        .agent-badge { font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; display: inline-block; background: #1a7f37; color: #fff; }
        pre { background: #000; padding: 10px; border-radius: 6px; overflow-x: auto; color: #00ff41; border: 1px solid #333; }
    </style>
</head>
<body class="flex h-screen">
    <div class="sidebar hidden md:flex flex-col p-3">
        <div class="text-xs text-gray-500 font-bold p-2 uppercase tracking-widest">Squad Alpha</div>
        <div class="space-y-1 mt-2">
            <div class="p-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-3 bg-gray-800">
                <i class="fa fa-robot text-green-500"></i> @aios-master
            </div>
        </div>
    </div>

    <div class="flex-1 flex flex-col relative">
        <header class="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-[#212121]">
            <div class="font-bold tracking-tight">AIOS <span class="text-green-500">MVP-FACTORY</span></div>
            <div class="text-xs text-green-500">● LIVE CONNECTION</div>
        </header>

        <div id="chat-box" class="chat-container p-4 md:p-10">
            <div class="ai-message message">
                <span class="agent-badge">@aios-master</span>
                <p>Opa, Mr Fink! A interface está viva. Vi que você mandou um "oi" e o sistema tentou executar como comando de terminal.</p>
                <p class="mt-2">**Agora eu entendo linguagem natural.** Pode me contar sua ideia de projeto ou pedir para eu quebrar algo em etapas.</p>
            </div>
        </div>

        <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[#212121] to-transparent">
            <div class="max-w-3xl mx-auto relative">
                <textarea id="user-input" rows="1" class="w-full bg-[#40414f] border border-white/10 rounded-xl p-4 pr-12 resize-none shadow-2xl focus:ring-1 focus:ring-white/20 outline-none" placeholder="Fale sobre seu projeto ou digite um comando..."></textarea>
                <button id="send-btn" class="absolute right-3 bottom-3 text-white/30 hover:text-white transition-all">
                    <i class="fa fa-paper-plane text-xl"></i>
                </button>
            </div>
        </div>
    </div>

    <script>
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        function addMessage(text, isAi = false) {
            const div = document.createElement('div');
            div.className = \`message \${isAi ? 'ai-message' : 'user-message'}\`;
            div.innerHTML = (isAi ? '<span class="agent-badge">@aios-master</span>' : '') + '<p class="whitespace-pre-wrap">' + text + '</p>';
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        async function handleSend() {
            const text = userInput.value.trim();
            if (!text) return;
            userInput.value = '';
            addMessage(text, false);

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();
                addMessage(data.reply, true);
            } catch (err) {
                addMessage('Erro de conexão.', true);
            }
        }

        sendBtn.onclick = handleSend;
        userInput.onkeypress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    </script>
</body>
</html>
  `);
});

// Novo Endpoint de Chat (Inteligência Real)
app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Mensagem recebida:', message);

    // Se a mensagem começar com '.', executa como comando de terminal
    if (message.startsWith('.')) {
        const cmd = message.substring(1).trim();
        exec(cmd, (error, stdout, stderr) => {
            res.json({ reply: stdout || stderr || 'Comando executado sem retorno.' });
        });
        return;
    }

    // Caso contrário, usa a lógica do AIOS Master para responder (Simulado por enquanto com retorno direto)
    // Aqui plugaremos o binário do AIOS nas próximas iterações
    res.json({ 
        reply: "Recebi sua ideia: '" + message + "'. Estou pronto para quebrar isso em etapas usando o Squad Alpha. Quer começar pelo PRD ou pela Arquitetura?"
    });
});

app.listen(port, () => {
  console.log('AIOS GPT Bridge v2.1 rodando na porta ' + port);
});
