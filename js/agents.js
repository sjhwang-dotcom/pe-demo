// State
let selectedAgentId = 'super-agent';
let currentView = 'card'; // 'card', 'goals', or 'workflow'
let zoomState = { scale: 1, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };

document.addEventListener('DOMContentLoaded', () => {
    renderAgentList();
    selectAgent(selectedAgentId);

    // Theme & Design Initialization (Matching main.js)
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDesign = localStorage.getItem('design') || 'modern';

    // Apply Theme (Light/Dark)
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        updateThemeIcon('dark');
    } else {
        document.body.classList.remove('dark');
        updateThemeIcon('light');
    }

    // Apply Design
    document.documentElement.setAttribute('data-theme', savedDesign);
    const designSelect = document.getElementById('designSelect');
    if (designSelect) designSelect.value = savedDesign;

    // Theme Toggle Listener
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark');
            if (isDark) {
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                updateThemeIcon('light');
            } else {
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon('dark');
            }
        });
    }

    // Design Select Listener
    if (designSelect) {
        designSelect.addEventListener('change', (e) => {
            const design = e.target.value;
            document.documentElement.setAttribute('data-theme', design);
            localStorage.setItem('design', design);
        });
    }
});

function renderAgentList() {
    const listContainer = document.getElementById('agent-list');
    if (!listContainer) return;

    listContainer.innerHTML = agentsData.map(agent => `
        <div id="agent-item-${agent.id}" 
             class="p-3 rounded-lg cursor-pointer border border-transparent hover:bg-bgSoft transition-all group mb-1"
             onclick="selectAgent('${agent.id}')">
            <div class="flex items-start gap-3 w-full overflow-hidden">
                <div class="w-8 h-8 rounded-lg bg-bgSoft dark:bg-blue-900/20 group-hover:bg-bgPanel border border-borderSubtle flex items-center justify-center text-accentBlue dark:text-blue-300 shadow-sm transition-colors shrink-0">
                    ${agent.icon || getAgentInitials(agent.name)}
                </div>
                <div class="flex-1 min-w-0 overflow-hidden">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-bold text-textMain truncate">${agent.name}</div>
                        ${agent.id === 'super-agent' ? '<span class="text-[10px] text-accentPurple font-bold">★</span>' : ''}
                    </div>
                    <!-- Role Removed as per request -->
                    <div class="text-[10px] text-textMuted/70 mt-0.5 block w-full whitespace-normal leading-tight">${agent.summary || agent.description}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectAgent(agentId) {
    selectedAgentId = agentId;

    // Update active state in list
    document.querySelectorAll('[id^="agent-item-"]').forEach(el => {
        el.classList.remove('bg-bgSoft', 'border-borderSubtle');
        el.classList.add('border-transparent');
    });
    const activeItem = document.getElementById(`agent-item-${agentId}`);
    if (activeItem) {
        activeItem.classList.add('bg-bgSoft', 'border-borderSubtle');
        activeItem.classList.remove('border-transparent');
    }

    const agent = agentsData.find(a => a.id === agentId);
    if (!agent) return;

    // Update Header
    document.getElementById('agent-name').textContent = agent.name;
    document.getElementById('agent-role').textContent = agent.role;
    const headerIcon = document.getElementById('agent-header-icon');
    if (headerIcon) {
        headerIcon.innerHTML = agent.icon || getAgentInitials(agent.name);
    }

    // Update Tools Sidebar
    // renderTools(agent.tools);
    // renderInteractions(agent.spec?.interactions);

    // Update Knowledge
    // renderKnowledge(agent.knowledge);

    // Update Monitoring Sidebar
    if (typeof renderAgentMonitoring === 'function') {
        renderAgentMonitoring(agent);
    }

    // Render Content based on view
    renderMainContent();
}

function renderTools(tools, interactions) {
    const container = document.getElementById('tools-list');
    if (!container) return;

    const categories = {
        datasource: { label: 'Data Sources', icon: 'Database', color: 'text-blue-500' },
        code: { label: 'Code Tools', icon: 'Code', color: 'text-purple-500' },
        api: { label: 'External APIs', icon: 'Globe', color: 'text-green-500' }
    };

    // Group tools
    const grouped = tools.reduce((acc, tool) => {
        if (!acc[tool.type]) acc[tool.type] = [];
        acc[tool.type].push(tool);
        return acc;
    }, {});

    let html = Object.entries(grouped).map(([type, groupTools]) => `
        <div class="mb-4">
            <h4 class="text-[10px] uppercase font-bold text-textMuted tracking-wider mb-2 flex items-center gap-2">
                ${categories[type].label}
            </h4>
            <div class="space-y-2">
                ${groupTools.map(tool => `
                    <div class="group relative p-2 bg-bgSoft rounded border border-borderSubtle text-xs text-textMain flex items-center gap-2 cursor-help hover:border-accentBlue transition-colors">
                        <div class="w-1.5 h-1.5 rounded-full ${type === 'code' ? 'bg-accentPurple' : type === 'api' ? 'bg-accentTeal' : 'bg-accentBlue'}"></div>
                        ${tool.name}
                        
                        <!-- Tooltip -->
                        <div class="absolute left-0 bottom-full mb-2 w-48 p-2 bg-bgPanel border border-borderSubtle rounded shadow-xl text-[10px] text-textMuted opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                            <div class="font-bold text-textMain mb-1">${tool.name}</div>
                            ${tool.description || 'No description available.'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function renderInteractions(interactions) {
    const container = document.getElementById('interactions-list');
    if (!container) return;

    if (!interactions || interactions.length === 0) {
        container.innerHTML = '<div class="text-textMuted text-xs italic">No interactions defined.</div>';
        return;
    }

    const html = `
        <div class="space-y-3">
            <div class="grid grid-cols-1 gap-2">
                ${interactions.map(interaction => {
        // Check if interaction matches an agent name
        const targetAgent = agentsData.find(a => a.name === interaction);

        if (targetAgent) {
            // Render Agent Icon + Name
            return `
                        <div class="p-3 bg-bgSoft/50 rounded-lg border border-borderSubtle/50 flex items-center gap-3 hover:bg-bgSoft transition-colors cursor-default">
                            <div class="w-8 h-8 rounded-lg bg-bgPanel border border-borderSubtle flex items-center justify-center text-accentBlue shrink-0">
                                ${targetAgent.icon}
                            </div>
                            <span class="text-sm font-medium text-textMain">${targetAgent.name}</span>
                        </div>
                        `;
        } else {
            // Fallback for generic text
            return `
                        <div class="p-3 bg-bgSoft/50 rounded-lg border border-borderSubtle/50 flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-bgPanel border border-borderSubtle flex items-center justify-center text-textMuted shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                            </div>
                            <span class="text-sm text-textMuted">${interaction}</span>
                        </div>
                        `;
        }
    }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderKnowledge(knowledge) {
    const container = document.getElementById('knowledge-list');
    if (!container) return;

    container.innerHTML = knowledge.map(k => `
        <a href="knowledge-base.html?q=${encodeURIComponent(k)}" 
           class="block p-2 rounded hover:bg-bgSoft text-xs text-accentBlue hover:underline transition-colors">
            📚 ${k}
        </a>
    `).join('');
}

function setView(view) {
    currentView = view;

    // Update Toggle Buttons
    const btnCard = document.getElementById('btn-view-card');
    const btnGoals = document.getElementById('btn-view-goals');
    const btnWorkflow = document.getElementById('btn-view-workflow');

    // Reset all
    [btnCard, btnGoals, btnWorkflow].forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-bgPanel', 'shadow', 'text-textMain');
            btn.classList.add('text-textMuted', 'hover:text-textMain');
        }
    });

    // Activate current
    const activeBtn = view === 'card' ? btnCard : view === 'goals' ? btnGoals : btnWorkflow;
    if (activeBtn) {
        activeBtn.classList.add('bg-bgPanel', 'shadow', 'text-textMain');
        activeBtn.classList.remove('text-textMuted', 'hover:text-textMain');
    }

    renderMainContent();
}

function renderMainContent() {
    const container = document.getElementById('main-content');
    const agent = agentsData.find(a => a.id === selectedAgentId);

    if (currentView === 'card') {
        // Enable scrolling for card view
        container.classList.remove('overflow-hidden');
        container.classList.add('overflow-y-auto');

        // Redesigned Card View: Tighter, Merged Chat
        const spec = agent.spec || {};
        const systemPrompt = `You are the ${agent.name}, acting as the ${agent.role} for the DeepAuto platform.
Your core objective is: ${spec.objective || agent.description}

RULES:
1. Always prioritize data accuracy.
2. Communicate clearly with other agents.
3. Follow the defined workflow steps.

INTERACTIONS:
${(spec.interactions || []).map(i => `- ${i}`).join('\n')}
`;

        container.innerHTML = `
            <div class="space-y-4 animate-in fade-in duration-300 pb-10">
                
                <!-- 1. Mission / High Level -->
                <div class="glass-panel p-5 rounded-xl border border-borderSubtle">
                    <div class="mb-3">
                        <div>
                            <h3 class="font-head font-bold text-lg text-textMain">Overview</h3>
                        </div>
                    </div>
                    <p class="text-sm text-textMain leading-relaxed mb-3">
                        ${agent.description}
                    </p>
                    <div class="pt-4 border-t border-borderSubtle flex flex-col gap-4">
                        
                        <!-- Tools -->
                        <div>
                            <div class="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2">Capabilities (Tools)</div>
                            <div class="flex flex-wrap gap-2">
                                ${(agent.tools || []).map(tool => {
            let colorClass = 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            if (tool.type === 'api') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            else if (tool.type === 'search') colorClass = 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';

            return `
                                    <div class="px-3 py-1.5 rounded-full border ${colorClass} text-xs font-semibold transition-colors cursor-help flex items-center gap-1.5 shadow-sm" title="${tool.description || ''}">
                                        ${tool.type === 'code' ? '⚡' : tool.type === 'api' ? '🔌' : '🔍'}
                                        ${tool.name}
                                    </div>
                                    `;
        }).join('')}
                                ${(!agent.tools || agent.tools.length === 0) ? '<span class="text-xs text-textMuted italic">No tools assigned</span>' : ''}
                            </div>
                        </div>

                        <!-- Interactions -->
                        <div>
                            <div class="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2">Collaborators</div>
                            <div class="flex flex-wrap gap-2">
                                ${(agent.spec?.interactions || []).map(interaction => {
            // Try to find matching agent
            const targetAgent = agentsData.find(a => interaction.includes(a.name) || a.name === interaction);
            const icon = targetAgent ? targetAgent.icon : '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>';
            const label = targetAgent ? targetAgent.name : interaction;

            return `
                                    <div class="px-3 py-1.5 rounded-full border bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800 text-xs font-semibold transition-colors cursor-default flex items-center gap-1.5 shadow-sm">
                                        <div class="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                                            ${icon}
                                        </div>
                                        ${label}
                                    </div>
                                    `;
        }).join('')}
                                ${(!agent.spec?.interactions || agent.spec.interactions.length === 0) ? '<span class="text-xs text-textMuted italic">No interactions defined</span>' : ''}
                            </div>
                        </div>

                        <!-- Knowledge -->
                        <div>
                            <div class="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2">Knowledge Context</div>
                            <div class="flex flex-wrap gap-2">
                                ${(agent.knowledge || []).map(k => `
                                    <a href="knowledge-base.html?q=${encodeURIComponent(k)}" 
                                       class="px-3 py-1.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm decoration-0">
                                        📚 ${k}
                                    </a>
                                `).join('')}
                                ${(!agent.knowledge || agent.knowledge.length === 0) ? '<span class="text-xs text-textMuted italic">No knowledge assigned</span>' : ''}
                            </div>
                        </div>

                    </div>
                    
                    <div class="mt-4 pt-3 border-t border-borderSubtle flex items-center justify-between">
                        <div class="text-xs flex items-center gap-2 shrink-0">
                            <span class="text-textMuted font-bold uppercase tracking-wider">Model:</span>
                            <select class="bg-bgSoft border border-borderSubtle text-textMain text-xs rounded px-2 py-1 outline-none focus:border-accentBlue cursor-pointer">
                                <option value="gpt4o">GPT-4o (v2024.11)</option>
                                <option value="claude35">Claude 3.5 Sonnet</option>
                                <option value="gemini15">Gemini 1.5 Pro</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 2. System Prompt & Refinement (Merged) -->
                <div class="glass-panel p-5 rounded-xl border border-borderSubtle flex flex-col h-[600px]">
                    <div class="flex items-center justify-between mb-3 shrink-0">
                        <div>
                            <h3 class="font-head font-bold text-lg text-textMain">System Prompt</h3>
                            <p class="text-[10px] text-textMuted">Core instruction set driving agent behavior</p>
                        </div>
                        <span class="text-[10px] font-mono text-textMuted bg-bgSoft px-2 py-1 rounded">v1.2.4</span>
                    </div>
                    
                    <!-- Editor Area -->
                    <div class="relative group flex-1 mb-4">
                        <textarea class="w-full h-full bg-bgBody border border-borderSubtle rounded-lg p-4 text-xs font-mono text-textMain focus:outline-none focus:border-accentBlue transition-colors resize-none leading-relaxed" spellcheck="false">${systemPrompt}</textarea>
                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="p-1.5 bg-bgPanel border border-borderSubtle rounded hover:text-accentBlue transition-colors" title="Copy">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Refinement Chat (Merged) -->
                    <div class="shrink-0 pt-3 border-t border-borderSubtle">
                        <div class="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-2 flex items-center gap-2">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Refine Behavior
                        </div>
                        <div class="flex gap-2">
                            <input type="text" id="chat-input" class="flex-1 bg-bgBody border border-borderSubtle rounded-lg px-3 py-2 text-sm text-textMain focus:outline-none focus:border-accentBlue transition-colors" placeholder="Ask AI to adjust the prompt (e.g., 'Make the tone more formal')...">
                            <button onclick="sendChatMessage()" class="px-4 py-2 bg-accentBlue text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">Update</button>
                        </div>
                        <!-- Quick Feedback History -->
                        <div id="chat-history" class="mt-2 space-y-1 max-h-20 overflow-y-auto text-[10px]">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>

            </div>
        `;
    } else if (currentView === 'goals') {
        // Enable scrolling for goals view
        container.classList.remove('overflow-hidden');
        container.classList.add('overflow-y-auto');

        if (!agent.goals) {
            container.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-textMuted"><div class="text-4xl mb-2">🎯</div><div>No goals defined for this agent.</div></div>';
            return;
        }

        const goals = agent.goals;

        container.innerHTML = `
            <div class="min-h-full p-4 flex flex-col items-center overflow-x-auto">
                
                <!-- Main Goal (Root) -->
                <div class="relative z-10 mb-0 flex flex-col items-center">
                    <div class="bg-bgPanel dark:bg-gray-800 text-textMain dark:text-white rounded-xl p-4 shadow-lg max-w-xl text-center relative border border-borderSubtle dark:border-gray-700">
                        <div class="text-[10px] font-bold text-accentBlue dark:text-blue-400 uppercase tracking-wider mb-1">Primary Objective</div>
                        <h2 class="text-lg font-head font-bold leading-tight">${goals.mainGoal}</h2>
                    </div>
                    <!-- Vertical Connector to Branch -->
                    <div class="h-6 w-px bg-borderSubtle dark:bg-gray-600"></div>
                </div>

                <!-- Tree Branch (Horizontal Line) -->
                <div class="relative inline-flex justify-center mb-4">
                    <!-- The horizontal line connecting the first and last sub-goal -->
                    <!-- Adjusted left/right to match the center of the first/last items -->
                    <div class="absolute top-0 border-t border-borderSubtle dark:border-gray-600 left-[16.66%] right-[16.66%]"></div>
                    
                    <div class="flex gap-4 justify-center w-full mt-6">
                        ${goals.subGoals.map((sub, index) => `
                            <div class="flex flex-col items-center w-60 shrink-0 relative">
                                <!-- Vertical Connector from Branch -->
                                <div class="absolute -top-6 h-6 w-px bg-borderSubtle dark:bg-gray-600"></div>
                                
                                <!-- Sub Goal Node -->
                                <div class="w-full bg-bgSoft dark:bg-gray-800/50 text-textMain dark:text-gray-200 rounded-lg p-3 shadow-sm mb-3 relative z-10 border border-borderSubtle dark:border-gray-700">
                                    <div class="text-[10px] font-bold text-accentTeal dark:text-teal-400 uppercase tracking-wider mb-1">Sub-Goal</div>
                                    <h3 class="text-xs font-bold leading-snug">${sub.title}</h3>
                                </div>

                                <!-- Tasks List (Leaf Nodes) -->
                                <div class="flex flex-col gap-2 w-full relative">
                                    <!-- Vertical Line running down -->
                                    <div class="absolute left-1/2 top-0 bottom-0 w-px bg-borderSubtle dark:bg-gray-600 -translate-x-1/2 -z-0"></div>

                                    ${sub.tasks.map(task => `
                                        <div class="relative z-10 bg-bgPanel dark:bg-gray-800 text-textMain dark:text-gray-300 rounded-lg p-2 shadow-sm border border-borderSubtle dark:border-gray-700 text-[10px] font-medium leading-relaxed hover:border-accentBlue transition-colors">
                                            ${task}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        `;

    } else {
        // Disable scrolling for workflow view (handled by zoom/pan)
        container.classList.remove('overflow-y-auto');
        container.classList.add('overflow-hidden');
        renderWorkflowGraph(container, agent.workflow);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const history = document.getElementById('chat-history');
    if (!input || !input.value.trim()) return;

    const userMsg = input.value;
    input.value = '';

    // User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'flex items-center gap-2 text-textMuted';
    userDiv.innerHTML = `<span class="font-bold text-textMain">You:</span> ${userMsg}`;
    history.prepend(userDiv);

    // Mock AI Response
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'flex items-center gap-2 text-accentBlue';
        aiDiv.innerHTML = `<span class="font-bold">AI:</span> Updated prompt to reflect changes.`;
        history.prepend(aiDiv);
    }, 500);
}

function renderWorkflowGraph(container, workflow) {
    if (!workflow || !workflow.nodes) {
        container.innerHTML = '<div class="text-center text-textMuted p-10">No workflow defined.</div>';
        return;
    }

    // Reset Zoom State
    zoomState = { scale: 1, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };

    // Simple layout calculation (Layered DAG)
    const nodes = workflow.nodes.map(n => ({ ...n, level: 0 }));
    const edges = workflow.edges;

    // Calculate levels
    let changed = true;
    while (changed) {
        changed = false;
        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (fromNode && toNode) {
                if (toNode.level <= fromNode.level) {
                    toNode.level = fromNode.level + 1;
                    changed = true;
                }
            }
        });
    }

    // Render SVG
    const nodeWidth = 340; // Wide
    const nodeHeight = 160; // Short (Rectangular)
    const xGap = 40; // Tight horizontal
    const yGap = 60; // Tight vertical
    const startY = 40; // Reduced top margin

    // Calculate Layout (x, y)
    const levelWidths = {};
    nodes.forEach(n => {
        levelWidths[n.level] = (levelWidths[n.level] || 0) + 1;
    });

    const maxLevel = Math.max(...nodes.map(n => n.level));
    const graphHeight = (maxLevel + 1) * (nodeHeight + yGap) + startY * 2;

    // Calculate max width
    let maxWidth = 0;
    Object.values(levelWidths).forEach(count => {
        const w = count * (nodeWidth + xGap);
        if (w > maxWidth) maxWidth = w;
    });
    const graphWidth = maxWidth + xGap * 2;

    // Assign Coordinates
    const levelCounts = {};
    nodes.forEach(n => {
        const count = levelCounts[n.level] || 0;
        const levelTotal = levelWidths[n.level];
        const levelW = levelTotal * (nodeWidth + xGap) - xGap;

        // Center the level
        const startX = (graphWidth - levelW) / 2;

        n.x = startX + count * (nodeWidth + xGap);
        n.y = startY + n.level * (nodeHeight + yGap);

        levelCounts[n.level] = count + 1;
    });

    // Calculate Scale
    const containerWidth = container.clientWidth || 1000;
    const containerHeight = container.clientHeight || 800;
    const padding = 20; // Reduced padding
    const scaleX = (containerWidth - padding * 2) / graphWidth;
    const scaleY = (containerHeight - padding * 2) / graphHeight;
    const fitScale = Math.max(Math.min(scaleX, 1), 0.5);

    // Center the graph horizontally
    const initialX = (containerWidth - graphWidth * fitScale) / 2;

    // Update Zoom State
    zoomState = {
        scale: fitScale,
        x: initialX,
        y: 20, // Small top padding
        isDragging: false,
        startX: 0,
        startY: 0
    };

    // Initialize SVG
    let svgContent = `<div id="graph-container" class="w-full h-full overflow-hidden relative bg-bgBody cursor-grab active:cursor-grabbing select-none">
        <svg id="workflow-svg" width="100%" height="100%" style="touch-action: none;">
            <g id="workflow-layer">`;

    // Draw Edges
    edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        if (from && to) {
            const startX = from.x + nodeWidth / 2;
            const startY = from.y + nodeHeight;
            const endX = to.x + nodeWidth / 2;
            const endY = to.y;

            // Curved Path
            const cp1x = startX;
            const cp1y = startY + yGap / 2;
            const cp2x = endX;
            const cp2y = endY - yGap / 2;

            svgContent += `<path d="M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}" 
                fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)" opacity="0.6" />`;
        }
    });

    // Arrowhead Marker
    svgContent += `<defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
    </defs>`;

    // Draw Nodes (HTML ForeignObject)
    nodes.forEach(n => {
        const style = getNodeStyle(n.type);

        svgContent += `
            <foreignObject x="${n.x}" y="${n.y}" width="${nodeWidth}" height="${nodeHeight}">
                <div xmlns="http://www.w3.org/1999/xhtml" class="h-full w-full p-2">
                    <div onclick="showNodeDetails('${n.id}')" class="h-full w-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative group hover:shadow-md hover:border-blue-300 hover:ring-2 hover:ring-blue-100 transition-all duration-200 cursor-pointer overflow-hidden">
                        
                        <!-- Input Port (Top Center) -->
                        ${n.type !== 'input' ? '<div class="absolute -top-1.5 left-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1/2"></div>' : ''}
                        
                        <!-- Output Port (Bottom Center) -->
                        ${n.type !== 'output' ? '<div class="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1/2"></div>' : ''}

                        <!-- Header Badge -->
                        <div class="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                            <span class="${style.badgeBg} ${style.badgeText} text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wide flex items-center gap-1">
                                ${style.icon} ${n.type === 'datasource' ? 'Data Source' : n.type}
                            </span>
                            <span class="text-[10px] font-bold text-gray-300 uppercase tracking-wider ml-auto">${n.id}</span>
                        </div>
                        
                        <!-- Body -->
                        <div class="p-3 flex-1 flex flex-col justify-center">
                            <div class="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-1">${n.label}</div>
                            <div class="text-xs text-gray-500 leading-relaxed line-clamp-2">${n.prompt}</div>
                        </div>

                        <!-- Footer Tool Tag -->
                        <div class="bg-gray-50 px-3 py-1.5 border-t border-gray-100 flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span class="text-[10px] font-medium text-gray-600 truncate">${n.tool}</span>
                        </div>
                    </div>
                </div>
            </foreignObject>
        `;
    });

    svgContent += `</g></svg></div>`;
    container.innerHTML = svgContent;

    // Initialize Zoom/Pan
    initZoomPan();
    updateTransform(); // Apply initial transform
}

function getNodeStyle(type) {
    switch (type) {
        case 'input':
            return {
                badgeBg: 'bg-green-100',
                badgeText: 'text-green-700',
                icon: '⚡'
            };
        case 'datasource':
            return {
                badgeBg: 'bg-red-100',
                badgeText: 'text-red-700',
                icon: '💿'
            };
        case 'action':
            return {
                badgeBg: 'bg-blue-100',
                badgeText: 'text-blue-700',
                icon: '⚙️'
            };
        case 'output':
            return {
                badgeBg: 'bg-purple-100',
                badgeText: 'text-purple-700',
                icon: '✨'
            };
        case 'agent':
            return {
                badgeBg: 'bg-orange-100',
                badgeText: 'text-orange-700',
                icon: '🤖'
            };
        default:
            return {
                badgeBg: 'bg-gray-100',
                badgeText: 'text-gray-700',
                icon: '📄'
            };
    }
}

function showNodeDetails(nodeId) {
    const agent = agentsData.find(a => a.id === selectedAgentId);
    const node = agent.workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const modal = document.getElementById('node-details-modal');
    const content = document.getElementById('node-details-content');
    const style = getNodeStyle(node.type);

    content.innerHTML = `
        <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Step ID</div>
            <div class="text-lg font-mono font-bold text-gray-900">${node.id}</div>
        </div>

        <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</div>
            <span class="${style.badgeBg} ${style.badgeText} text-xs font-bold uppercase px-2 py-1 rounded-md tracking-wide inline-flex items-center gap-1">
                ${style.icon} ${node.type}
            </span>
        </div>

        <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Label</div>
            <div class="text-base font-bold text-gray-900 leading-snug">${node.label}</div>
        </div>

        <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tool Configuration</div>
            <div class="bg-gray-50 border border-gray-200 rounded p-2 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-sm font-medium text-gray-700">${node.tool}</span>
            </div>
        </div>

        <div>
            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">System Prompt</div>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-gray-600 leading-relaxed whitespace-pre-wrap">
${node.prompt}
            </div>
        </div>
    `;

    modal.classList.remove('translate-x-full');
}

function closeNodeDetails() {
    const modal = document.getElementById('node-details-modal');
    modal.classList.add('translate-x-full');
}

function initZoomPan() {
    const container = document.getElementById('graph-container');
    const layer = document.getElementById('workflow-layer');
    if (!container || !layer) return;

    // Wheel Pan (Vertical Scroll)
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        // Scroll speed factor
        const scrollSpeed = 1;
        zoomState.y -= e.deltaY * scrollSpeed;
        updateTransform();
    });

    // Drag Pan
    container.addEventListener('mousedown', (e) => {
        zoomState.isDragging = true;
        zoomState.startX = e.clientX - zoomState.x;
        zoomState.startY = e.clientY - zoomState.y;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!zoomState.isDragging) return;
        zoomState.x = e.clientX - zoomState.startX;
        zoomState.y = e.clientY - zoomState.startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        zoomState.isDragging = false;
        container.style.cursor = 'grab';
    });
}

function zoomGraph(delta) {
    zoomState.scale += delta;
    zoomState.scale = Math.min(Math.max(0.2, zoomState.scale), 3); // Limit zoom
    updateTransform();
}

function resetZoom() {
    zoomState = { scale: 1, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };
    updateTransform();
}

function updateTransform() {
    const layer = document.getElementById('workflow-layer');
    if (layer) {
        layer.setAttribute('transform', `translate(${zoomState.x}, ${zoomState.y}) scale(${zoomState.scale})`);
    }
}

function getStepColorClass(type) {
    switch (type) {
        case 'trigger': return 'border-accentGold/50 hover:border-accentGold';
        case 'process': return 'border-accentBlue/50 hover:border-accentBlue';
        case 'action': return 'border-accentPurple/50 hover:border-accentPurple';
        case 'output': return 'border-green-500/50 hover:border-green-500';
        case 'decision': return 'border-orange-500/50 hover:border-orange-500';
        case 'input': return 'border-textMuted/30 hover:border-textMuted';
        default: return 'border-borderSubtle';
    }
}

function getAgentInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function openCreateAgentModal() {
    const modal = document.getElementById('createAgentModal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeCreateAgentModal() {
    const modal = document.getElementById('createAgentModal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function createAgent() {
    const input = document.getElementById('newAgentGoal');
    const btn = document.getElementById('btn-create-agent');

    if (!input.value.trim()) return;

    btn.innerHTML = '<span class="animate-spin">↻</span> Creating...';
    btn.disabled = true;

    setTimeout(() => {
        closeCreateAgentModal();
        btn.innerHTML = 'Create Agent';
        btn.disabled = false;
        input.value = '';
        alert("Super Agent has accepted your request. Spawning new agent infrastructure...");
    }, 1500);
}

function updateThemeIcon(theme) {
    const sun = document.getElementById('themeIconSun');
    const moon = document.getElementById('themeIconMoon');
    if (!sun || !moon) return;

    if (theme === 'dark') {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
    } else {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
    }
}

function renderAgentMonitoring(agent) {
    const container = document.getElementById('right-sidebar-content');
    if (!container) return;

    // Mock Data Generation based on agent
    const completedTasks = [
        { id: 1, action: 'Initialize Context', time: '2m ago', status: 'success' },
        { id: 2, action: 'Load Knowledge Base', time: '1m ago', status: 'success' },
        { id: 3, action: 'Verify API Credentials', time: '45s ago', status: 'success' }
    ];

    // Customize active agents based on the selected agent
    let activeAgents = [];
    if (agent.id === 'super-agent') {
        activeAgents = [
            {
                id: 'orch-1',
                name: 'Sourcing Agent',
                action: 'Scanning Market Feeds',
                progress: 65,
                logs: ['> Connecting to Pitchbook API...', '> Filtering by EBITDA > M...', '> Found 12 matches...']
            },
            {
                id: 'orch-2',
                name: 'Evaluation Agent',
                action: 'Analyzing Financials',
                progress: 32,
                logs: ['> Parsing PDF balance sheets...', '> Calculating normalized EBITDA...', '> Flagging irregularities...']
            }
        ];
    } else {
        activeAgents = [
            {
                id: 'sub-1',
                name: agent.name.split(' ')[0] + ' Worker 1',
                action: 'Processing Batch #1024',
                progress: 45,
                logs: ['> Fetching data chunk...', '> Validating schema...', '> 200 OK']
            },
            {
                id: 'sub-2',
                name: agent.name.split(' ')[0] + ' Worker 2',
                action: 'Generating Embeddings',
                progress: 12,
                logs: ['> Tokenizing input...', '> Sending to Vector DB...', '> Indexing...']
            }
        ];
    }

    container.innerHTML = `
        <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 border-b border-borderSubtle shrink-0">
                <h3 class="font-head font-bold text-[10px] uppercase tracking-widest text-textMuted">System Monitor</h3>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-6">
                
                <!-- Completed Tasks (Collapsible) -->
                <details class="group" open>
                    <summary class="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-textMuted uppercase tracking-wider mb-2 hover:text-textMain transition-colors">
                        <span>Completed Tasks (${completedTasks.length})</span>
                        <svg class="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </summary>
                    <div class="space-y-2 pl-2 border-l-2 border-borderSubtle mt-2">
                        ${completedTasks.map(task => `
                            <div class="flex items-center gap-2 text-xs">
                                <div class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span class="text-textMain font-medium">${task.action}</span>
                                <span class="text-textMuted ml-auto text-[10px]">${task.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </details>

                <!-- Active Agents -->
                <div>
                    <h4 class="text-xs font-bold text-accentBlue uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Active Processes
                    </h4>
                    
                    <div class="space-y-3">
                        ${activeAgents.map(sub => `
                            <div class="bg-bgSoft border border-borderSubtle rounded-lg p-3 shadow-sm">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span class="text-xs font-bold text-textMain">${sub.name}</span>
                                    </div>
                                    <span class="text-[10px] font-mono text-textMuted">${sub.progress}%</span>
                                </div>
                                
                                <!-- Progress Bar -->
                                <div class="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                                    <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: ${sub.progress}%"></div>
                                </div>

                                <!-- Activity Stream (Clean) -->
                                <div class="bg-bgPanel rounded border border-borderSubtle p-2 space-y-2">
                                    <div class="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1 px-1">Recent Activity</div>
                                    ${sub.logs.map(log => {
        // Clean up log text (remove >)
        const cleanLog = log.replace('> ', '');
        return `
                                        <div class="flex items-start gap-2 text-[10px] text-textMain px-1">
                                            <div class="mt-0.5 w-1.5 h-1.5 rounded-full bg-accentBlue shrink-0 opacity-50"></div>
                                            <span class="leading-tight">${cleanLog}</span>
                                        </div>
                                        `;
    }).join('')}
                                    <div class="flex items-center gap-2 text-[10px] text-textMuted px-1 animate-pulse">
                                        <div class="w-3 h-3 border-2 border-textMuted border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        </div>
    `;
}
