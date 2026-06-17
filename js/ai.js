// ─── AI ENGINE ──────────────────────────────────────
// Handles all calls to Groq's free AI API

// ✏️  Replace this with your free key from console.groq.com
const GROQ_KEY = 'YOUR_GROQ_KEY_HERE';

let chatHistory = [];

async function callGroq(messages, systemPrompt) {
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({
        model:      'llama-3.1-8b-instant',
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    }
  );

  const data = await response.json();
  return data.choices?.[0]?.message?.content
    || 'Sorry, I had trouble with that. Please try again.';
}

async function doChat() {
  const input   = document.getElementById('chat-in');
  const sendBtn = document.getElementById('ask-btn');
  const question = input.value.trim();

  if (!question || sendBtn.disabled) return;

  input.value      = '';
  sendBtn.disabled = true;

  const d = DISEASES[curDisease];
  chatHistory.push({ role: 'user', content: question });
  renderChat();

  // Show loading dots
  const chatBody = document.getElementById('chat-body');
  const loader   = document.createElement('div');
  loader.className = 'msg';
  loader.id        = 'loader-msg';
  loader.innerHTML = `
    <div class="msg-who ai">AI guide</div>
    <div class="msg-text">
      <div class="dot-loader">
        <div class="dl"></div><div class="dl"></div><div class="dl"></div>
      </div>
    </div>`;
  chatBody.appendChild(loader);
  chatBody.scrollTop = chatBody.scrollHeight;

  const systemPrompt = `You are a warm, engaging science guide inside "Disease in D Minor" — an interactive app that teaches genetic mutations through music. The user is exploring ${d.name}. The mutation: ${d.mutation.replace(/<[^>]+>/g, '')}. Healthy sequence: ${d.healthy.seq}. Mutant sequence: ${d.mutant.seq}. Speak plain English — no jargon without explanation. Be concise (3–5 sentences). Connect biology to the music when relevant.`;

  try {
    const reply = await callGroq(
      chatHistory.map(m => ({ role: m.role, content: m.content })),
      systemPrompt
    );
    document.getElementById('loader-msg')?.remove();
    chatHistory.push({ role: 'assistant', content: reply });
    renderChat();
  } catch (err) {
    document.getElementById('loader-msg')?.remove();
    chatHistory.push({
      role: 'assistant',
      content: 'Connection error — check your Groq key in js/ai.js and try again.'
    });
    renderChat();
  }

  sendBtn.disabled = false;
}

async function doCustomAnalysis() {
  const input   = document.getElementById('seq-in');
  const goBtn   = document.getElementById('go-btn');
  const errorEl = document.getElementById('seq-err');
  const resultEl= document.getElementById('custom-result');
  const visualEl= document.getElementById('custom-visual');

  const raw = input.value.trim().toUpperCase().replace(/\s/g, '');
  errorEl.textContent = '';

  // Validate the sequence
  const isValid = raw.length >= 3 && raw.split('').every(c => AA_MAP[c]);
  if (!isValid) {
    errorEl.textContent = 'Please enter a valid sequence (at least 3 letters from: A C D E F G H I K L M N P Q R S T V W Y)';
    return;
  }

  goBtn.disabled    = true;
  resultEl.textContent = 'Analyzing your sequence…';
  visualEl.innerHTML   = '';

  // Describe the sequence for the AI
  const details = raw.split('').map((aa, i) =>
    `${i + 1}:${AA_MAP[aa]?.n}(${AA_MAP[aa]?.g})`
  ).join(', ');

  const systemPrompt = `You are a biology guide in a protein sonification app. Given an amino acid sequence, explain in 4–5 warm plain-English sentences: what kind of protein this might be, what the chemical pattern (nonpolar/polar/charged mix) suggests about its role, and what is musically interesting about its pattern. End with one curiosity question.`;

  try {
    const reply = await callGroq(
      [{ role: 'user', content: `Sequence: ${raw}\nDetails: ${details}` }],
      systemPrompt
    );
    resultEl.innerHTML = reply.replace(/\n/g, '<br>');

    // Draw visualization for the custom sequence
    visualEl.innerHTML = `
      <div style="font-size:10px;font-weight:600;letter-spacing:.07em;
        text-transform:uppercase;color:var(--text3);margin-bottom:8px">
        Your sequence
      </div>`;

    const rollWrapper = document.createElement('div');
    rollWrapper.className = 'roll-wrap';
    const canvas = document.createElement('canvas');
    canvas.className = 'roll-canvas';
    canvas.id        = 'cv-custom';
    rollWrapper.appendChild(canvas);
    visualEl.appendChild(rollWrapper);

    const strip = document.createElement('div');
    strip.className = 'aa-strip';
    strip.id        = 'strip-custom';
    visualEl.appendChild(strip);

    const playRow = document.createElement('div');
    playRow.style.cssText = 'margin-top:10px;display:flex;gap:8px';
    playRow.innerHTML = `
      <button class="play-btn h-btn"
        onclick="playCustomSequence(window._customSeq)"
        style="font-size:13px;padding:9px 18px">
        ▶ Play your sequence
      </button>`;
    visualEl.appendChild(playRow);

    window._customSeq = raw;

    setTimeout(() => {
      drawPianoRoll('cv-custom', raw, [], 'rgba(139,124,248,0.8)');
      renderAminoStrip('strip-custom', raw, []);
    }, 40);

  } catch (err) {
    resultEl.textContent = 'Connection error — check your Groq key in js/ai.js and try again.';
  }

  goBtn.disabled = false;
}
