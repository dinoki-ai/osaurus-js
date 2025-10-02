import { app, BrowserWindow } from "electron";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      // WARNING: Demo settings. Do NOT ship these to production.
      // - Enabling nodeIntegration and disabling contextIsolation expose Node APIs
      //   to the renderer and increase the attack surface.
      // - In production, use a preload script with contextIsolation: true, and
      //   keep nodeIntegration: false.
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Osaurus Electron Example</title>
      <style>
        body { 
          font-family: system-ui; 
          margin: 0; 
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100vh;
          box-sizing: border-box;
        }
        h1 { margin: 0 0 20px 0; }
        #connectBtn { 
          padding: 10px 20px; 
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        #connectBtn:hover { background: #5a67d8; }
        #status { 
          padding: 10px; 
          margin: 10px 0;
          background: #f5f5f5;
          border-radius: 5px;
          font-size: 14px;
        }
        #chatContainer {
          display: none;
          flex: 1;
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }
        #messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #fafafa;
        }
        .message {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 5px;
        }
        .user { background: #e3f2fd; }
        .assistant { background: #f3e5f5; }
        #inputContainer {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
          background: white;
        }
        #messageInput {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 10px;
        }
        #sendBtn {
          padding: 8px 20px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        #sendBtn:hover { background: #45a049; }
        #sendBtn:disabled { opacity: 0.5; cursor: not-allowed; }
        #modelInfo { 
          font-size: 12px; 
          color: #666; 
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Osaurus Electron Example</h1>
      <button id="connectBtn" onclick="connect()">Connect to Osaurus</button>
      <div id="status"></div>
      <div id="modelInfo"></div>
      
      <div id="chatContainer">
        <div id="messages"></div>
        <div id="inputContainer">
          <input id="messageInput" type="text" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendMessage()">
          <button id="sendBtn" onclick="sendMessage()">Send</button>
        </div>
      </div>
      
      <script>
        const { discover } = require('@osaurus/sdk');
        const OpenAI = require('openai').default;
        
        let client = null;
        let selectedModel = null;
        
        async function connect() {
          const status = document.getElementById('status');
          const connectBtn = document.getElementById('connectBtn');
          const chatContainer = document.getElementById('chatContainer');
          const modelInfo = document.getElementById('modelInfo');
          
          try {
            connectBtn.disabled = true;
            status.textContent = 'Connecting...';
            
            const instance = await discover();
            status.textContent = 'Connected to ' + instance.url;
            
            // SECURITY WARNING (DEMO ONLY):
            // This example uses the OpenAI SDK directly in the renderer process
            // and sets "dangerouslyAllowBrowser" below. Do NOT do this in production.
            // In a real app, route requests through a secure, trusted process
            // (e.g., your main process or a backend) and never expose secrets
            // to the renderer.
            client = new OpenAI({
              baseURL: instance.url + '/v1',
              apiKey: 'not-needed',
              dangerouslyAllowBrowser: true, // Only for Examples, do not use in production
            });
            
            const models = await client.models.list();
            const modelIds = Array.from(models.data).map(m => m.id);
            
            if (modelIds.length === 0) {
              status.textContent = 'No models available';
              return;
            }
            
            selectedModel = modelIds[0];
            modelInfo.textContent = 'Available models: ' + modelIds.join(', ') + ' (using ' + selectedModel + ')';
            
            chatContainer.style.display = 'flex';
            connectBtn.style.display = 'none';
          } catch (error) {
            status.textContent = 'Error: ' + error.message;
            connectBtn.disabled = false;
          }
        }
        
        async function sendMessage() {
          if (!client || !selectedModel) return;
          
          const input = document.getElementById('messageInput');
          const sendBtn = document.getElementById('sendBtn');
          const messages = document.getElementById('messages');
          
          const userMessage = input.value.trim();
          if (!userMessage) return;
          
          messages.innerHTML += '<div class="message user"><strong>You:</strong> ' + userMessage + '</div>';
          input.value = '';
          sendBtn.disabled = true;
          
          try {
            const response = await client.chat.completions.create({
              model: selectedModel,
              messages: [
                { role: 'user', content: userMessage }
              ],
              max_tokens: 200
            });
            
            const reply = response.choices[0]?.message?.content || 'No response';
            messages.innerHTML += '<div class="message assistant"><strong>Osaurus:</strong> ' + reply + '</div>';
            messages.scrollTop = messages.scrollHeight;
          } catch (error) {
            messages.innerHTML += '<div class="message assistant"><strong>Error:</strong> ' + error.message + '</div>';
          }
          
          sendBtn.disabled = false;
          input.focus();
        }
      </script>
    </body>
    </html>
  `;

  mainWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  );
}

app.whenReady().then(createWindow);
