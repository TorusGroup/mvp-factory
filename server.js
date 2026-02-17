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
          body { background: #000; color: #0f0; font-family: monospace; padding: 20px; }
          #console { border: 1px solid #333; height: 70vh; overflow-y: auto; padding: 10px; margin-bottom: 10px; background: #050505; }
          #input { width: 100%; background: #000; color: #0f0; border: 1px solid #333; padding: 10px; outline: none; }
          .line { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <h2>AIOS COMMAND CENTER v1.0</h2>
        <div id="console"></div>
        <input type="text" id="input" placeholder="Type a command (ex: ./node_modules/.bin/aios-core info) and press Enter" autofocus>
        <script>
          const input = document.getElementById('input');
          const consoleDiv = document.getElementById('console');
          
          function log(text, color = '#0f0') {
            const div = document.createElement('div');
            div.className = 'line';
            div.style.color = color;
            div.textContent = text;
            consoleDiv.appendChild(div);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
          }

          input.onkeypress = async (e) => {
            if (e.key === 'Enter') {
              const cmd = input.value;
              input.value = '';
              log('> ' + cmd, '#fff');
              
              try {
                const response = await fetch('/execute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ command: cmd })
                });
                const data = await response.json();
                log(data.output || data.error);
              } catch (err) {
                log('Error connecting to AIOS server.', '#f00');
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
  
  exec(command, (error, stdout, stderr) => {
    res.json({ output: stdout, error: stderr || (error ? error.message : null) });
  });
});

app.listen(port, () => {
  console.log(\`AIOS Bridge listening on port \${port}\`);
});
