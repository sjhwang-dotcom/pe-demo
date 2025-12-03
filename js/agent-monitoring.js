
function renderAgentMonitoring(agent) {
    const container = document.getElementById('right-sidebar-content');
    if (!container) return;

    // Mock Data Generation
    const completedTasks = [
        { id: 1, action: 'Initialize Context', time: '2m ago', status: 'success' },
        { id: 2, action: 'Load Knowledge Base', time: '1m ago', status: 'success' },
        { id: 3, action: 'Verify API Credentials', time: '45s ago', status: 'success' }
    ];

    const activeAgents = [
        {
            id: 'sub-1',
            name: agent.name.split(' ')[0] + ' Worker 1',
            action: 'Processing Batch #1024',
            progress: 65,
            logs: ['> Fetching data...', '> Parsing JSON...', '> Validating schema...']
        },
        {
            id: 'sub-2',
            name: agent.name.split(' ')[0] + ' Worker 2',
            action: 'Analyzing Sentiment',
            progress: 32,
            logs: ['> Connecting to NLP model...', '> Streaming tokens...']
        }
    ];

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

                                <!-- Terminal Logs -->
                                <div class="bg-gray-900 rounded p-2 font-mono text-[10px] text-green-400 leading-tight space-y-1 opacity-90">
                                    <div class="text-gray-500 border-b border-gray-800 pb-1 mb-1 flex justify-between">
                                        <span>TERMINAL</span>
                                        <span>${sub.id}</span>
                                    </div>
                                    ${sub.logs.map(log => `<div>${log}</div>`).join('')}
                                    <div class="animate-pulse">_</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </div>
        </div>
    `;
}
