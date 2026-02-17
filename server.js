const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AIOS MVP Factory</title>
        <style>
          body { background: #000; color: #00ff41; font-family: 'Courier New', Courier, monospace; padding: 20px; }
          #console { border: 1px solid #333; height: 70vh; overflow-y: auto; padding: 15px; margin-bottom: 10px; background: #050505; border-radius: 4px; box-shadow: inset 0 0 10px #000; }
          #input { width: 100%; background: #000; color: #00ff41; border: 1px solid #333; padding: 12px; outline: none; border-radius: 4px; font-family: inherit; }
          #input:focus { border-color: #00ff41; }
          .line { margin-bottom: 5px; white-space: pre-wrap; line-height: 1.4; }
          .input-line { color: #fff; font-weight: bold; }
          .system { color: #008f11; font-style: italic; }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin: 0;">AIOS COMMAND CENTER <span style="font-size: 0.5em; opacity: 0.5;">v1.0</span></h2>
          <div style="color: #008f11;">● READY</div>
        </div>
        <div id="console"><div class="line system">Bridge established. Ready for commands to @aios-master.</div></div>
        <input type="text" id="input" placeholder="Type a command (ex: ./node_modules/.bin/aios-core info) and press Enter" autofocus>
        <script>
          const input = document.getElementById('input');
          const consoleDiv = document.getElementById('console');
          
          function log(text, type = 'output') {
            const div = document.createElement('div');
            div.className = 'line ' + type;
            div.textContent = text;
            consoleDiv.appendChild(div);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
          }

          input.onkeypress = async (e) => {
            if (e.key === 'Enter') {
              const cmd = input.value;
              input.value = '';
              log('> ' + cmd, 'input-line');
              
              try {
                const response = await fetch('/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ command: cmd })
                });
                const data = await response.json();
                if (data.output) log(data.output);
                if (data.error) log(data.error, 'error');
              } catch (err) {
                log('Error connecting to AIOS server.', 'error');
              }
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.post('/execute', (req, res) => {
  const { command } = req.body;
  console.log('Executing:', command);
  
  // Executa os comandos relativos à raiz do projeto
  exec(command, (error, stdout, stderr) => {
    res.json({ output: stdout, error: stderr || (error ? error.message : null) });
  });
});

app.listen(port, () => {
  console.log(\`AIOS Bridge listening on port \${port}\`);
});
