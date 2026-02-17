const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Rota para a nova interface ChatGPT
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
        body { background-color: #212121; color: #ececec; font-family: 'Sentry', sans-serif; }
        .chat-container { height: calc(100vh - 160px); overflow-y: auto; scroll-behavior: smooth; }
        .message { max-width: 80%; margin-bottom: 20px; padding: 12px 16px; border-radius: 12px; line-height: 1.5; }
        .user-message { background-color: #343541; margin-left: auto; border-bottom-right-radius: 2px; }
        .ai-message { background-color: #444654; margin-right: auto; border-bottom-left-radius: 2px; }
        .sidebar { background-color: #202123; width: 260px; transition: all 0.3s ease; }
        input:focus { outline: none; }
        pre { background: #000; padding: 10px; border-radius: 6px; overflow-x: auto; margin-top: 10px; border: 1px solid #444; }
        code { font-family: monospace; color: #00ff41; }
        .agent-badge { font-size: 0.7rem; font-weight: bold; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; display: inline-block; }
    </style>
</head>
<body class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <div class="sidebar hidden md:flex flex-col p-2">
        <button class="flex items-center gap-3 p-3 border border-white/20 rounded-md hover:bg-gray-500/10 transition-all text-sm mb-4">
            <i class="fa fa-plus"></i> Novo Projeto
        </button>
        <div class="flex-1 overflow-y-auto">
            <div class="text-xs text-gray-500 font-bold px-3 py-2 uppercase">Squad Alpha</div>
            <div class="space-y-1">
                <div class="px-3 py-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-3">
                    <i class="fa fa-robot text-green-500"></i> @aios-master
                </div>
                <div class="px-3 py-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-3">
                    <i class="fa fa-code text-blue-400"></i> @dev (DeepSeek)
                </div>
                <div class="px-3 py-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer flex items-center gap-3">
                    <i class="fa fa-vial text-purple-400"></i> @qa-validator
                </div>
            </div>
        </div>
        <div class="border-t border-white/20 p-2 mt-auto">
            <div class="text-xs text-gray-400 px-2 py-1">v2.0 Beta - Railway Edition</div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col relative">
        <header class="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#212121]/80 backdrop-blur">
            <div class="font-semibold">AIOS Command Center</div>
            <div class="flex items-center gap-4">
                <span class="text-xs text-green-500 flex items-center gap-1">
                    <span class="block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Railway Online
                </span>
                <button id="toggle-terminal" class="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all">
                    <i class="fa fa-terminal"></i> Terminal
                </button>
            </div>
        </header>

        <div id="chat-box" class="chat-container p-4 md:p-8">
            <!-- Boas vindas -->
            <div class="ai-message message">
                <span class="agent-badge bg-green-900 text-green-300 border border-green-500/30">@aios-master</span>
                <p>Olá Mr Fink. A versão 2.0 (GPT UI) está ativa. Estou conectado ao motor da VPS via Railway.</p>
                <p class="mt-2 text-sm text-gray-400">Podemos discutir ideias agora. Qual projeto vamos quebrar em etapas hoje?</p>
            </div>
        </div>

        <!-- Input Area -->
        <div class="absolute bottom-0 w-full p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent">
            <div class="max-w-3xl mx-auto relative">
                <textarea id="user-input" rows="1" class="w-full bg-[#343541] border border-white/10 rounded-xl p-4 pr-12 resize-none shadow-2xl focus:border-white/20" placeholder="Envie uma ideia ou comando (ex: *help)..."></textarea>
                <button id="send-btn" class="absolute right-3 bottom-3 text-white/50 hover:text-white transition-all">
                    <i class="fa fa-paper-plane text-xl"></i>
                </button>
            </div>
            <div class="text-[10px] text-center mt-2 text-gray-500">
                AIOS can make mistakes. Verify important code results. Powered by DeepSeek & Gemini.
            </div>
        </div>
    </div>

    <script>
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');

        function addMessage(text, isAi = false, agent = 'aios-master') {
            const div = document.createElement('div');
            div.className = \`message \${isAi ? 'ai-message' : 'user-message'}\`;
            
            let content = '';
            if (isAi) {
                content += \`<span class="agent-badge bg-green-900 text-green-300 border border-green-500/30">@\${agent}</span>\`;
            }
            content += \`<p class="whitespace-pre-wrap">\${text}</p>\`;
            
            div.innerHTML = content;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        async function handleSend() {
            const text = userInput.value.trim();
            if (!text) return;

            userInput.value = '';
            addMessage(text, false);

            try {
                const response = await fetch('/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: text })
                });
                const data = await response.json();
                addMessage(data.output || data.error || 'Sem resposta do sistema.', true);
            } catch (err) {
                addMessage('Erro de conexão com o AIOS.', true);
            }
        }

        sendBtn.onclick = handleSend;
        userInput.onkeypress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
        
        document.getElementById('toggle-terminal').onclick = () => {
            alert('Acesso ao log bruto habilitado. Digite comandos de terminal no chat.');
        };
    </script>
</body>
</html>
  `);
});

app.post('/execute', (req, res) => {
  const { command } = req.body;
  console.log('Executando:', command);
  
  // Se for um comando de ajuda ou algo do AIOS, podemos processar via binário
  // Por enquanto, apenas repassa para o shell
  exec(command, (error, stdout, stderr) => {
    res.json({ output: stdout, error: stderr || (error ? error.message : null) });
  });
});

app.listen(port, () => {
  console.log('AIOS GPT Bridge rodando na porta ' + port);
});
