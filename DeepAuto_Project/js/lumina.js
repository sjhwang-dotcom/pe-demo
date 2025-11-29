// DeepAuto PE Console - Lumina AI Logic
// Data is now global from data.js

const GEMINI_API_KEY = 'YOUR_API_KEY'; // TODO: Replace with your Gemini API Key

window.initLumina = function () {
    // Attach event listeners if needed, but they are already global
}

window.toggleLumina = function () {
    document.getElementById('chatPanel').classList.toggle('translate-x-full');
}

window.fillChat = function (text) {
    document.getElementById('chatInput').value = text;
    sendChat();
}

window.sendChat = async function () {
    const inp = document.getElementById('chatInput');
    const hist = document.getElementById('chatHistory');
    const userText = inp.value.trim();
    if (!userText) return;

    // User Message
    hist.innerHTML += `<div class="flex flex-col gap-1 items-end chat-bubble-enter"><div class="bg-accentBlue text-white text-xs p-3 rounded-lg rounded-tr-none shadow-sm max-w-[90%]">${userText}</div></div>`;
    inp.value = '';
    hist.scrollTop = hist.scrollHeight;

    // Loading Indicator
    const loadingId = 'loading-' + Date.now();
    hist.innerHTML += `<div id="${loadingId}" class="flex flex-col gap-1 items-start chat-bubble-enter"><div class="bg-bgPanel border border-borderSubtle text-xs p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] text-textMain"><span class="font-bold text-accentBlue mb-1 block text-[10px] uppercase tracking-wide">Lumina</span><span class="animate-pulse">Thinking...</span></div></div>`;
    hist.scrollTop = hist.scrollHeight;

    // Call AI
    const aiResponse = await callGeminiAPI(userText);

    // Remove Loading
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    // Lumina Message
    hist.innerHTML += `<div class="flex flex-col gap-1 items-start chat-bubble-enter"><div class="bg-bgPanel border border-borderSubtle text-xs p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] text-textMain"><span class="font-bold text-accentBlue mb-1 block text-[10px] uppercase tracking-wide">Lumina</span>${aiResponse}</div></div>`;
    hist.scrollTop = hist.scrollHeight;
}

async function callGeminiAPI(userMessage) {
    if (GEMINI_API_KEY === 'YOUR_API_KEY') {
        return "Please configure your Gemini API Key in the code to enable live reasoning. (Search for 'GEMINI_API_KEY' in js/lumina.js)";
    }

    // Access current state from DOM or global vars if needed, or just use the imported data
    // For simplicity, we use the imported static data + current tab logic from main.js (if accessible)
    // Since modules are strict, we might need to pass currentTab/Fund or just rely on the static data for this demo.

    const context = `
You are Lumina, an advanced AI partner for a Private Equity firm.
Your Role:
1. Report on current tasks and status.
2. Answer questions using the Enterprise Data provided below.
3. Execute tasks requested by the user (simulate the execution).
4. Proactively offer insights based on data patterns.

Enterprise Data Context:
- Sourcing Pipeline: ${JSON.stringify(sourcingData)}
- Active Evaluations: ${JSON.stringify(evalData)}
- Fund I Portfolio: ${JSON.stringify(fund1Data)}
- Fund II Portfolio: ${JSON.stringify(fund2Data)}

Instructions:
- Be concise, professional, and data-driven.
- If the user asks to do something (e.g., "email", "schedule"), confirm the action.
- If you see a risk or opportunity in the data related to the query, mention it proactively.
`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: "user", parts: [{ text: context }] },
                    { role: "user", parts: [{ text: userMessage }] }
                ]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to the enterprise brain right now. Please try again.";
    }
}
