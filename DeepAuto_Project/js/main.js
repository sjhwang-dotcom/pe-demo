// DeepAuto PE Console - Main Logic

// Global State
let currentTab = 'sourcing';
let currentFund = 'all';
let simChart, scatterChart, funnelChart, pfTrendChart, pfSectorChart, pfBridgeChart, evalChart, evalScatterChart;

// Data is loaded via script tags in index.html
// window.sourcingData, window.evalData, window.portfolioData, window.diligenceData are available globally.

// --- THEME MANAGEMENT ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDesign = localStorage.getItem('design') || 'modern';

    setTheme(savedTheme);
    setDesign(savedDesign);

    // Event Listeners for Theme Controls
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('designSelect').addEventListener('change', (e) => setDesign(e.target.value));
}



function setTheme(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('themeIconSun').classList.remove('hidden');
        document.getElementById('themeIconMoon').classList.add('hidden');
    } else {
        document.body.classList.remove('dark');
        document.getElementById('themeIconSun').classList.add('hidden');
        document.getElementById('themeIconMoon').classList.remove('hidden');
    }
    localStorage.setItem('theme', mode);
    refreshCharts();
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

function setDesign(design) {
    document.documentElement.setAttribute('data-theme', design);
    localStorage.setItem('design', design);
    document.getElementById('designSelect').value = design;
    refreshCharts();
}

function refreshCharts() {
    if (simChart) simChart.destroy();
    if (funnelChart) funnelChart.destroy();
    if (pfTrendChart) pfTrendChart.destroy();
    if (pfSectorChart) pfSectorChart.destroy();
    if (pfBridgeChart) pfBridgeChart.destroy();
    if (scatterChart) scatterChart.destroy();

    if (currentTab === 'sourcing') initSourcingCharts();
    if (currentTab === 'evaluation') {
        // Get the current company for Evaluation tab
        const company = window.evalData?.find(c => c.id === currentEvalId);
        if (company) {
            initEvalCharts(company);
        }
    }
    if (currentTab === 'portfolio') initPortfolioCharts();
}

// --- TAB MANAGEMENT ---
window.setTab = function (tabId) {
    document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="setTab('${tabId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.remove('fade-in');
        void targetView.offsetWidth;
        targetView.classList.add('fade-in');
    }

    updateSidebar(tabId);
    currentTab = tabId;

    setTimeout(() => {
        if (tabId === 'sourcing') initSourcingCharts();
        if (tabId === 'evaluation') switchEvalCompany(document.getElementById('evalCompanySelect')?.value || 'apex');
        if (tabId === 'portfolio') initPortfolioCharts();
    }, 50);
}

function updateSidebar(tabId) {
    const listEl = document.getElementById('sidebarList');
    listEl.innerHTML = '';
    const sidebarTitle = document.getElementById('sidebarTitle');
    const sidebarDesc = document.getElementById('sidebarDesc');

    if (tabId === 'sourcing') {
        sidebarTitle.innerText = "Target Universe";
        sidebarDesc.innerText = "Public & Private Comps";
        sourcingData.forEach(item => {
            listEl.innerHTML += `
            <div class="p-2 rounded hover:bg-bgSoft cursor-pointer group border border-transparent hover:border-borderSubtle transition-all mb-1 min-w-[140px] lg:min-w-0 shrink-0">
                <div class="flex justify-between items-center">
                <span class="font-bold text-xs text-textMain group-hover:text-accentBlue">${item.name}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-bgSoft border border-borderSubtle text-textMuted">${item.source}</span>
                </div>
                <div class="flex justify-between mt-1 text-[9px] text-textMuted">
                <span>EBITDA: ${item.e}</span>
                <span class="text-accentTeal font-mono">Fit: ${item.score}</span>
                </div>
            </div>`;
        });
        renderSourcingTable();
    }
    else if (tabId === 'evaluation') {
        sidebarTitle.innerText = "Active Models";
        sidebarDesc.innerText = "Live Valuation Workstreams";
        evalData.forEach(item => {
            const isActive = item.id === (typeof currentEvalId !== 'undefined' ? currentEvalId : 'apex');
            listEl.innerHTML += `
            <div onclick="switchEvalCompany('${item.id}')" class="p-3 rounded hover:bg-bgSoft cursor-pointer group border border-transparent hover:border-borderSubtle transition-all mb-1 min-w-[140px] lg:min-w-0 shrink-0 ${isActive ? 'bg-bgSoft border-borderSubtle' : ''}">
                <div class="font-bold text-sm text-textMain group-hover:text-accentBlue">${item.name}</div>
                <div class="flex justify-between mt-1.5 text-[10px] text-textMain font-medium">
                    <span>${item.metrics.ltmEbitda} EBITDA</span>
                    <span class="text-accentTeal font-bold">${item.metrics.entryMultiple}</span>
                </div>
                <div class="text-[10px] text-textMuted mt-1 opacity-90">${item.status}</div>
            </div>`;
        });
    }
    else if (tabId === 'diligence') {
        sidebarTitle.innerText = "Active Diligence";
        sidebarDesc.innerText = "HCA Healthcare (Proxy)";
        listEl.innerHTML = `
        <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 mb-2 min-w-[200px] lg:min-w-0 shrink-0">
            <div class="font-bold text-sm text-textMain">HCA Healthcare</div>
            <div class="text-[10px] text-accentBlue mt-1.5 font-bold">Confirmatory • Week 4</div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-2 rounded-full overflow-hidden">
                <div class="bg-accentBlue h-full" style="width: 65%"></div>
            </div>
        </div>
        `;
    }
    else if (tabId === 'portfolio') {
        sidebarTitle.innerText = "Fund Assets";
        sidebarDesc.innerText = currentFund === 'all' ? "All Active Holdings" : (currentFund === 'fund1' ? "Fund I (Vintage 2018)" : "Fund II (Vintage 2024)");
        let data = [];
        if (currentFund === 'all') data = [...portfolioData.fund1, ...portfolioData.fund2];
        else if (currentFund === 'fund1') data = portfolioData.fund1;
        else data = portfolioData.fund2;

        data.forEach(a => {
            listEl.innerHTML += `
                <div onclick="viewAssetDetail('${a.id}')" class="p-3 rounded hover:bg-bgSoft cursor-pointer group border border-transparent hover:border-borderSubtle transition-all mb-1 min-w-[140px] lg:min-w-0 shrink-0">
                <div class="font-bold text-sm text-textMain group-hover:text-accentTeal">${a.n}</div>
                <div class="flex justify-between mt-1.5 text-[10px] text-textMain font-medium">
                    <span>FMV: ${a.f}M</span>
                    <span class="text-accentTeal font-bold">EBITDA: ${a.e}</span>
                </div>
                <div class="text-[10px] ${a.stc} mt-1 font-bold">${a.st}</div>
                </div>`;
        });
    }
}

function renderSourcingTable() {
    const tbody = document.getElementById('sourcingTable');
    const countEl = document.getElementById('sourcingCount');

    if (countEl) {
        countEl.textContent = `${sourcingData.length} Matches Found`;
        countEl.className = "text-[10px] text-emerald-600 font-bold font-mono";
    }

    if (tbody) {
        tbody.innerHTML = sourcingData.map(c => {
            // Color Coding Logic
            let sourceClass = "bg-gray-100 text-gray-600 border-gray-200";
            if (c.source.includes('Proprietary') || c.source.includes('Outbound')) sourceClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            else if (c.source.includes('Bank') || c.source.includes('Advisor')) sourceClass = "bg-blue-50 text-blue-700 border-blue-200";

            let actionClass = "bg-white border-gray-300 text-gray-700 hover:border-accentBlue hover:text-accentBlue";
            if (c.action.includes('NDA')) actionClass = "bg-emerald-600 border-transparent text-white hover:bg-emerald-700 shadow-sm";
            else if (c.action.includes('Review')) actionClass = "bg-blue-600 border-transparent text-white hover:bg-blue-700 shadow-sm";

            // Lead Logic
            let leadHtml = `<span class="text-[10px] text-textMuted italic">Unassigned</span>`;
            if (c.lead) {
                const initials = c.lead.split(' ').map(n => n[0]).join('');
                leadHtml = `
                    <div class="flex items-center justify-center gap-1.5">
                        <div class="w-5 h-5 rounded-full bg-bgPanel border border-borderSubtle flex items-center justify-center text-[9px] font-bold text-textMain">
                            ${initials}
                        </div>
                        <span class="text-[11px] font-medium text-textMain">${c.lead}</span>
                    </div>
                `;
            }

            return `
            <tr class="hover:bg-bgSoft transition-colors group border-b border-borderSubtle last:border-0">
                <td class="px-5 py-4 font-bold text-sm text-textMain group-hover:text-accentBlue transition-colors">${c.name}</td>
                <td class="px-5 py-4">
                    <span class="px-2.5 py-1 rounded-md border text-[10px] font-bold ${sourceClass}">
                        ${c.sponsor} <span class="opacity-50 mx-1">/</span> ${c.source}
                    </span>
                </td>
                <td class="px-5 py-4 text-right font-mono font-medium text-textMain">${c.r}</td>
                <td class="px-5 py-4 text-right font-mono font-medium text-textMain">${c.e}</td>
                <td class="px-5 py-4 text-right font-mono font-bold text-accentTeal">${c.m}</td>
                <td class="px-5 py-4 text-center">
                    ${leadHtml}
                </td>
                <td class="px-5 py-4 text-center">
                    <span class="font-bold text-accentBlue bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-xs border border-blue-100 dark:border-blue-800">${c.score}</span>
                </td>
                <td class="px-5 py-4 text-right">
                    <button class="px-3 py-1.5 rounded-md border text-[10px] font-bold transition-all ${actionClass}">
                        ${c.action}
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    }
}

// --- CHART UTILS ---
const getChartColors = () => {
    const style = getComputedStyle(document.body);
    return {
        textColor: style.getPropertyValue('--text-muted').trim(),
        gridColor: style.getPropertyValue('--border-subtle').trim()
    };
};

// --- CHART INITS (Simplified for brevity, same logic as before but using getChartColors) ---
// --- Evaluation Logic ---
// --- Evaluation Logic ---
let currentEvalId = 'apex';

window.switchEvalCompany = function (companyId) {
    const company = window.evalData.find(c => c.id === companyId);
    if (!company) return;

    currentEvalId = companyId;

    // Sync Dropdown
    const select = document.getElementById('evalCompanySelect');
    if (select) select.value = companyId;

    // Sync Sidebar Highlight
    updateSidebar('evaluation');

    // 1. Header
    document.getElementById('eval-deal-name').textContent = company.name;
    const tagsContainer = document.getElementById('eval-tags');
    tagsContainer.innerHTML = company.tags.map(tag =>
        `<span class="px-1.5 py-0.5 rounded bg-bgPanel border border-borderSubtle text-[10px] text-textMuted font-medium">${tag}</span>`
    ).join('');

    // 2. Deal Overview
    document.getElementById('eval-entry-multiple').textContent = company.metrics.entryMultiple;
    document.getElementById('eval-ltm-ebitda').textContent = company.metrics.ltmEbitda;
    document.getElementById('eval-leverage').textContent = company.metrics.leverage;

    // 3. Trading Comps
    renderCompsTable(company.comps);

    // 4. Sensitivity Matrix
    renderSensitivityMatrix(company.sensitivity);

    // 5. Deal Team
    renderTeam(company.team);

    // 6. Conviction
    renderConviction(company.conviction);

    // 7. Reset Copilot
    const historyEl = document.getElementById('copilot-history');
    if (historyEl) {
        historyEl.innerHTML = `
            <div class="flex gap-3 fade-in">
                <div class="w-6 h-6 rounded-full bg-accentPurple flex items-center justify-center text-[10px] font-bold text-white shrink-0">AI</div>
                <div class="bg-accentPurple/10 rounded-lg rounded-tr-none p-2 text-xs text-textMain max-w-[80%]">
                    Hello. I'm ready to help you model scenarios for <strong>${company.name}</strong>. Try asking: "Weight DCF 60%" or "Increase growth by 5%".
                </div>
            </div>
        `;
    }

    // 8. Charts
    initEvalCharts(company);
}

function renderCompsTable(comps) {
    const tbody = document.getElementById('eval-comps-body');
    if (!tbody) return;

    const metrics = [
        { label: 'EV / EBITDA', key: 'evEbitda', format: (v) => v },
        { label: 'EV / Sales', key: 'evSales', format: (v) => v },
        { label: 'EBITDA Margin', key: 'margin', format: (v) => v }
    ];

    // Assuming comps[0] is Target, comps[1] is Peer Avg
    const target = comps[0];
    const peer = comps[1];

    tbody.innerHTML = metrics.map(m => {
        const tVal = parseFloat(target[m.key]);
        const pVal = parseFloat(peer[m.key]);
        let delta = tVal - pVal;
        let deltaStr = delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);

        // Special handling for margin (bps) could be added, but keeping simple for now
        if (m.key === 'margin') {
            deltaStr = (delta).toFixed(1) + '%';
        } else {
            deltaStr += 'x';
        }

        const deltaColor = delta < 0 ? 'text-accentTeal' : 'text-accentRed'; // Lower multiple is usually better (Green/Teal), Higher is Red. For Margin, higher is Green.
        // Logic fix: 
        // Multiple: Lower is "Cheaper" (Green/Teal) vs Peer? Or "Lower Valuation" (Red)?
        // Context: "Deal Evaluation" -> We want to buy cheap? Or we are selling?
        // Usually "Delta" just shows difference. Let's stick to Green = Positive Delta, Red = Negative Delta numerically, or context aware.
        // Let's use: Green if Target is "Better" (Higher Margin, Lower Multiple if buying).
        // Assuming Buy Side: Lower Multiple = Green, Higher Margin = Green.

        let colorClass = 'text-textMuted';
        if (m.key === 'margin') {
            colorClass = delta > 0 ? 'text-emerald-500' : 'text-red-500';
        } else {
            colorClass = delta < 0 ? 'text-emerald-500' : 'text-red-500'; // Cheaper than peers = Green
        }

        return `
            <tr class="border-b border-borderSubtle last:border-0 hover:bg-bgSoft/50 transition-colors">
                <td class="py-2 font-medium text-textMain">${m.label}</td>
                <td class="py-2 text-right text-textMain">${target[m.key]}</td>
                <td class="py-2 text-right text-textMuted">${peer[m.key]}</td>
                <td class="py-2 text-right font-bold ${colorClass}">${deltaStr}</td>
            </tr>
        `;
    }).join('');
}

function renderSensitivityMatrix(sens) {
    const container = document.getElementById('eval-sensitivity-matrix');
    if (!container) return;

    // X-Axis: Exit Multiple, Y-Axis: Growth Rate
    let html = `<table class="w-full text-[10px] text-center font-mono border-collapse">`;

    // Header Row (Exit Multiples)
    html += `<thead><tr><th class="p-1 text-textMuted text-left">Gr \\ Ex</th>`;
    sens.x.forEach(x => html += `<th class="p-1 text-textMain">${x}</th>`);
    html += `</tr></thead><tbody>`;

    // Rows (Growth Rates)
    sens.y.forEach((y, i) => {
        html += `<tr><td class="p-1 text-textMain font-bold text-left">${y}</td>`;
        sens.values[i].forEach(val => {
            // Color scale based on IRR value (e.g. <15% red, 15-20 yellow, >20 green)
            // Or simple opacity of green
            let bgClass = '';
            let textClass = 'text-textMain';

            if (val >= 25) { bgClass = 'bg-emerald-500/30'; textClass = 'text-emerald-400 font-bold'; }
            else if (val >= 20) { bgClass = 'bg-emerald-500/20'; textClass = 'text-emerald-300'; }
            else if (val >= 15) { bgClass = 'bg-emerald-500/10'; textClass = 'text-textMain'; }
            else { bgClass = 'bg-red-500/10'; textClass = 'text-red-400'; }

            html += `<td class="p-1"><div class="rounded py-1 ${bgClass} ${textClass}">${val.toFixed(1)}%</div></td>`;
        });
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function renderTeam(team) {
    const container = document.getElementById('eval-team-list');
    if (!container) return;
    container.innerHTML = team.map(member => `
        <div class="flex items-center gap-3 p-2 rounded hover:bg-bgSoft transition-colors">
            <div class="w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold">${member.initials}</div>
            <div>
                <div class="text-xs font-bold text-textMain">${member.name}</div>
                <div class="text-[10px] text-textMuted">${member.role}</div>
            </div>
        </div>
    `).join('');
}

function renderConviction(conviction) {
    document.getElementById('eval-score').textContent = `${conviction.score}/100`;
    document.getElementById('eval-score-bar').style.width = `${conviction.score}%`;

    const container = document.getElementById('eval-flags');
    if (!container) return;
    container.innerHTML = conviction.flags.map(flag => `
        <div class="flex items-start gap-2 text-[10px] text-textMuted">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-accentRed shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${flag.text}</span>
        </div>
    `).join('');
}

function initEvalCharts(company) {
    // Properly destroy existing charts
    if (evalChart) {
        evalChart.destroy();
        evalChart = null;
    }
    if (evalScatterChart) {
        evalScatterChart.destroy();
        evalScatterChart = null;
    }

    // Reset canvas elements to ensure clean reinit
    const resetCanvas = (id) => {
        const oldCanvas = document.getElementById(id);
        if (oldCanvas) {
            const newCanvas = oldCanvas.cloneNode(true);
            oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
            return newCanvas;
        }
        return null;
    };

    const { textColor, gridColor } = getChartColors();

    // 1. Valuation Waterfall Chart
    // Process waterfall data into floating bars
    let currentVal = 0;
    const waterfallData = company.waterfall.map((item, index) => {
        const start = currentVal;
        let end = currentVal;
        let bg = '#94a3b8'; // Default Grey

        if (item.type === 'base') {
            end = item.value;
            currentVal = end;
            bg = '#64748b';
        } else if (item.type === 'add') {
            end = currentVal + item.value;
            currentVal = end;
            bg = '#10b981'; // Green
        } else if (item.type === 'sub') {
            end = currentVal + item.value; // value is negative
            currentVal = end;
            bg = '#ef4444'; // Red
        }

        // Special case for final bar if needed, or just color code
        if (index === company.waterfall.length - 1) bg = '#8b5cf6'; // Purple for final

        return {
            x: item.label,
            y: [start, end],
            v: item.value, // Store raw value for tooltip
            backgroundColor: bg
        };
    });

    const ctxWaterfall = resetCanvas('evalWaterfallChart');
    if (ctxWaterfall) {
        evalChart = new Chart(ctxWaterfall.getContext('2d'), {
            type: 'bar',
            data: {
                labels: company.waterfall.map(d => d.label),
                datasets: [{
                    label: 'Valuation Bridge',
                    data: waterfallData,
                    backgroundColor: waterfallData.map(d => d.backgroundColor),
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const raw = context.raw.v;
                                return raw > 0 ? `+${raw}M` : `${raw}M`;
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
                    x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } }
                }
            }
        });
    }

    // 2. Peer Benchmarking Scatter (Growth vs Multiple)
    const ctxScatter = resetCanvas('evalScatterChart');
    if (ctxScatter) {
        // Parse metrics for dynamic plotting
        const growth = parseFloat(company.metrics.revenueGrowth);
        const multiple = parseFloat(company.metrics.entryMultiple);

        evalScatterChart = new Chart(ctxScatter.getContext('2d'), {
            type: 'bubble',
            data: {
                datasets: [
                    {
                        label: 'Target',
                        data: [{ x: growth, y: multiple, r: 15 }],
                        backgroundColor: '#8b5cf6', // Purple
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    {
                        label: 'Peers',
                        data: company.scatterPeers || [
                            { x: growth - 4, y: multiple + 1.4, r: 10, name: 'Peer A' },
                            { x: growth + 3, y: multiple + 4.7, r: 8, name: 'Peer B' }
                        ],
                        backgroundColor: 'rgba(148, 163, 184, 0.5)', // Slate
                        borderColor: 'transparent'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const raw = context.raw;
                                const name = raw.name || context.dataset.label;
                                return `${name}: ${raw.x}% Growth, ${raw.y}x EBITDA`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Revenue Growth (%)', color: textColor, font: { size: 10 } },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        title: { display: true, text: 'EV / EBITDA (x)', color: textColor, font: { size: 10 } },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }
}

function initSourcingCharts() {
    if (funnelChart) funnelChart.destroy();
    const canvas = document.getElementById('sourcingFunnelChart');
    if (!canvas) return;
    const { textColor } = getChartColors();
    funnelChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Origination', 'NDA', 'Mgmt Mtg', 'LOI', 'Closed'],
            datasets: [{ label: 'Count', data: [320, 85, 24, 8, 2], backgroundColor: ['#94a3b8', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'], borderRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: textColor, font: { size: 9 } } }, y: { display: false } } }
    });
}


// --- Mandate & Sourcing Logic ---
let currentSourcingFund = 'fund1';
const mandateData = {
    'fund1': {
        criteria: { ebitda: '$3M-$40M', sectors: 'HVAC, Ind. Services, Healthcare', geo: 'Sun Belt, Midwest' },
        prompt: "Targeting founder-owned HVAC and plumbing service providers in the Sun Belt region (FL, TX, GA, AZ) with $5M-$15M EBITDA. Focus on companies with >60% recurring maintenance revenue and low customer concentration."
    },
    'fund2': {
        criteria: { ebitda: '$10M-$100M', sectors: 'B2B SaaS, Fintech, Data Infra', geo: 'North America, Europe' },
        prompt: "Looking for high-growth B2B SaaS companies with $10M+ ARR and >110% NRR. Focus on mission-critical vertical software and data infrastructure. Avoid heavy services components."
    }
};

window.switchSourcingFund = function (fund) {
    currentSourcingFund = fund;

    // Update Buttons
    const btn1 = document.getElementById('src-btn-fund1');
    const btn2 = document.getElementById('src-btn-fund2');

    if (btn1) btn1.className = fund === 'fund1'
        ? "px-2 py-0.5 text-[9px] font-bold rounded bg-accentBlue text-white shadow-sm transition-all"
        : "px-2 py-0.5 text-[9px] font-bold rounded text-textMuted hover:text-textMain transition-all";

    if (btn2) btn2.className = fund === 'fund2'
        ? "px-2 py-0.5 text-[9px] font-bold rounded bg-accentBlue text-white shadow-sm transition-all"
        : "px-2 py-0.5 text-[9px] font-bold rounded text-textMuted hover:text-textMain transition-all";

    // Update Title & Criteria
    const titleEl = document.getElementById('mandate-title');
    if (titleEl) titleEl.innerText = fund === 'fund1' ? "Fund I Mandate" : "Fund II Mandate";

    const data = mandateData[fund];
    const criteriaEl = document.getElementById('mandate-criteria');
    if (criteriaEl) {
        criteriaEl.innerHTML = `
            <span><strong>EBITDA:</strong> ${data.criteria.ebitda}</span>
            <span><strong>Sectors:</strong> ${data.criteria.sectors}</span>
            <span><strong>Geo:</strong> ${data.criteria.geo}</span>
        `;
    }

    const promptEl = document.getElementById('sourcingPrompt');
    if (promptEl) promptEl.value = data.prompt;
}

window.openMandateModal = function () {
    const modal = document.getElementById('mandateModal');
    const content = document.getElementById('mandateModalContent');
    const input = document.getElementById('modalMandateInput');

    // Populate with current prompt
    input.value = document.getElementById('sourcingPrompt').value;

    // Reset AI area
    document.getElementById('aiRefinementArea').classList.add('hidden');
    document.getElementById('aiTagsContainer').innerHTML = '';

    modal.classList.remove('hidden');
    // Small delay for transition
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

window.closeMandateModal = function () {
    const modal = document.getElementById('mandateModal');
    const content = document.getElementById('mandateModalContent');

    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

window.refineMandateAI = function () {
    const btn = document.querySelector('#mandateModal button[onclick="refineMandateAI()"]');
    const originalText = btn.innerHTML;

    // Loading State
    btn.innerHTML = `<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...`;
    btn.disabled = true;

    // Simulate AI Processing
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        const input = document.getElementById('modalMandateInput').value;
        const tagsContainer = document.getElementById('aiTagsContainer');
        tagsContainer.innerHTML = '';

        // Mock Parsing Logic (Demo purposes)
        const tags = [];
        if (input.toLowerCase().includes('saas')) tags.push({ label: 'Sector: B2B SaaS', color: 'bg-purple-100 text-purple-700 border-purple-200' });
        if (input.toLowerCase().includes('hvac')) tags.push({ label: 'Sector: HVAC/Services', color: 'bg-orange-100 text-orange-700 border-orange-200' });
        if (input.match(/\$[0-9]+M/)) tags.push({ label: 'Fin: ' + input.match(/\$[0-9]+M/)[0] + '+', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' });
        if (input.toLowerCase().includes('north america') || input.toLowerCase().includes('usa')) tags.push({ label: 'Geo: North America', color: 'bg-blue-100 text-blue-700 border-blue-200' });
        if (input.toLowerCase().includes('growth') || input.toLowerCase().includes('recurring')) tags.push({ label: 'Attr: High Recurring Rev', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' });

        // Fallback if no specific keywords found
        if (tags.length === 0) {
            tags.push({ label: 'Sector: Generalist', color: 'bg-gray-100 text-gray-700 border-gray-200' });
            tags.push({ label: 'Geo: Global', color: 'bg-gray-100 text-gray-700 border-gray-200' });
        }

        tags.forEach(tag => {
            tagsContainer.innerHTML += `<span class="px-2 py-1 rounded-md text-[10px] font-bold border ${tag.color}">${tag.label}</span>`;
        });

        document.getElementById('aiRefinementArea').classList.remove('hidden');
    }, 1500);
}

window.saveMandate = function () {
    const newPrompt = document.getElementById('modalMandateInput').value;

    // Update Data
    mandateData[currentSourcingFund].prompt = newPrompt;

    // Update UI
    document.getElementById('sourcingPrompt').value = newPrompt;

    closeMandateModal();

    // Show success toast/alert
    const btn = document.querySelector('#mandate-criteria').parentElement.parentElement.parentElement.querySelector('button.underline');
    if (btn) {
        const original = btn.innerText;
        btn.innerText = "Saved!";
        btn.classList.add('text-emerald-500');
        setTimeout(() => {
            btn.innerText = original;
            btn.classList.remove('text-emerald-500');
        }, 2000);
    }
}

window.switchFund = function (fund) {
    if (typeof closeAssetDetail === 'function') closeAssetDetail();

    currentFund = fund;
    document.querySelectorAll('.fund-btn').forEach(btn => {
        btn.classList.remove('bg-bgPanel', 'text-textMain', 'shadow-sm', 'active');
        btn.classList.add('text-textMuted', 'hover:text-textMain');
    });
    const activeBtn = document.getElementById(`btn-${fund}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-textMuted', 'hover:text-textMain');
        activeBtn.classList.add('bg-bgPanel', 'text-textMain', 'shadow-sm', 'active');
    }

    // Update KPIs based on Fund
    const kpis = {
        'all': { irr: '22.5%', moic: '1.52x', invested: '$975M', dpi: '0.38x', assets: '11' },
        'fund1': { irr: '24.1%', moic: '1.85x', invested: '$840M', dpi: '0.45x', assets: '8' },
        'fund2': { irr: '18.2%', moic: '1.15x', invested: '$135M', dpi: '0.05x', assets: '3' }
    };

    const data = kpis[fund];
    if (data) {
        if (document.getElementById('kpi-irr')) document.getElementById('kpi-irr').innerText = data.irr;
        if (document.getElementById('kpi-moic')) document.getElementById('kpi-moic').innerText = data.moic;
        if (document.getElementById('kpi-invested')) document.getElementById('kpi-invested').innerText = data.invested;
        if (document.getElementById('kpi-dpi')) document.getElementById('kpi-dpi').innerText = data.dpi;
        if (document.getElementById('kpi-assets')) document.getElementById('kpi-assets').innerText = data.assets;
    }

    updateSidebar('portfolio');
    initPortfolioCharts();
    renderPortfolioTable();
}

function initPortfolioCharts() {
    if (pfTrendChart) pfTrendChart.destroy();
    if (pfSectorChart) pfSectorChart.destroy();
    if (pfBridgeChart) pfBridgeChart.destroy();

    const { textColor, gridColor } = getChartColors();

    let trendDatasets = [];
    let sectorData, bridgeData;

    if (currentFund === 'all') {
        // Overlay Fund I and Fund II
        trendDatasets = [
            {
                label: 'Fund I EBITDA Growth (YoY %)',
                data: [8.5, 9.2, 11.0, 12.4, 14.5, 15.2],
                borderColor: '#10b981', // Emerald
                backgroundColor: 'rgba(16,185,129,0.1)',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Fund II EBITDA Growth (YoY %)',
                data: [0, 0, 2.5, 3.8, 4.2, 5.0],
                borderColor: '#3b82f6', // Blue
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: false,
                tension: 0.4
            }
        ];
        sectorData = [30, 30, 20, 20];
        bridgeData = [975, 155, 40, 60, 1230];
    } else if (currentFund === 'fund1') {
        trendDatasets = [{
            label: 'Fund I EBITDA Growth (YoY %)',
            data: [8.5, 9.2, 11.0, 12.4, 14.5, 15.2],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            fill: true,
            tension: 0.4
        }];
        sectorData = [35, 30, 20, 15];
        bridgeData = [840, 150, 40, 60, 1090];
    } else {
        trendDatasets = [{
            label: 'Fund II EBITDA Growth (YoY %)',
            data: [0, 0, 2.5, 3.8, 4.2, 5.0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true,
            tension: 0.4
        }];
        sectorData = [10, 20, 0, 70];
        bridgeData = [135, 5, 0, 0, 140];
    }

    const trendCanvas = document.getElementById('pfTrendChart');
    if (trendCanvas) {
        pfTrendChart = new Chart(trendCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Q3-23', 'Q4-23', 'Q1-24', 'Q2-24', 'Q3-24', 'Q4-24'],
                datasets: trendDatasets
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, labels: { color: textColor } } }, scales: { x: { grid: { display: false }, ticks: { color: textColor, font: { size: 9 } } }, y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 9 } } } } }
        });
    }

    const sectorCanvas = document.getElementById('pfSectorChart');
    if (sectorCanvas) {
        pfSectorChart = new Chart(sectorCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Healthcare', 'Ind. Tech', 'Software', 'Services'],
                datasets: [{ data: sectorData, backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: textColor, boxWidth: 10, font: { size: 9 } } } }, cutout: '70%' }
        });
    }

    const bridgeCanvas = document.getElementById('pfBridgeChart');
    if (bridgeCanvas) {
        pfBridgeChart = new Chart(bridgeCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Entry Cost', 'EBITDA Growth', 'Mult Expansion', 'Deleveraging', 'Current FMV'],
                datasets: [{
                    data: bridgeData,
                    backgroundColor: ['#94a3b8', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
                    borderRadius: 3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: textColor, font: { size: 9 } } }, y: { display: false } } }
        });
    }
}

// --- REPORTING SYSTEM ---

function showReportModal(title, contentHTML, actions = []) {
    // Remove existing modal if any
    const existing = document.getElementById('reportModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm fade-in p-4";

    let actionButtons = actions.map(a => `
    <button onclick="${a.onclick}" class="px-4 py-2 rounded text-xs font-bold ${a.primary ? 'bg-accentBlue text-white hover:bg-blue-600' : 'bg-bgPanel border border-borderSubtle text-textMain hover:bg-bgSoft'} transition-colors shadow-sm">
    ${a.label}
        </button>
        `).join('');

    modal.innerHTML = `
        <div class="bg-bgPanel w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-borderSubtle transform scale-95 animate-[scaleIn_0.2s_ease-out_forwards]">
            <!-- Header -->
            <div class="p-5 border-b border-borderSubtle flex justify-between items-center bg-bgSoft/50 rounded-t-xl shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-accentBlue/10 flex items-center justify-center text-accentBlue">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                        <h2 class="font-head text-lg font-bold text-textMain">${title}</h2>
                        <p class="text-[10px] text-textMuted uppercase tracking-wider">Confidential • Internal Use Only</p>
                    </div>
                </div>
                <button onclick="document.getElementById('reportModal').remove()" class="text-textMuted hover:text-textMain transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 bg-bgBody text-textMain font-sans leading-relaxed">
                ${contentHTML}
            </div>

            <!-- Footer -->
    <div class="p-4 border-t border-borderSubtle bg-bgSoft/50 rounded-b-xl flex justify-end gap-3 shrink-0">
        <button onclick="document.getElementById('reportModal').remove()" class="px-4 py-2 rounded text-xs font-bold text-textMuted hover:text-textMain transition-colors">Close</button>
        ${actionButtons}
    </div>
        </div>
        `;

    document.body.appendChild(modal);
}

window.generateICMemo = function () {
    const d = window.diligenceData;
    if (!d || !d.overview) {
        alert("Diligence data not loaded.");
        return;
    }

    const html = `
        <div class="max-w-3xl mx-auto">
            <div class="text-center mb-8 border-b-2 border-textMain pb-4">
                <h1 class="text-3xl font-bold uppercase tracking-widest mb-2 text-textMain">Investment Committee Memorandum</h1>
                <div class="flex justify-between text-sm font-bold text-textMuted mt-4">
                    <span>Date: November 28, 2025</span>
                    <span>Target: ${d.target}</span>
                    <span>Fund: Fund II</span>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-accentBlue border-b border-borderSubtle mb-3 pb-1">Executive Summary</h3>
                <p class="mb-4 text-sm text-textMain">${d.overview.description}</p>
                <div class="grid grid-cols-3 gap-4 bg-bgSoft p-4 rounded border border-borderSubtle">
                    <div><span class="block text-xs text-textMuted uppercase">Deal Size</span><span class="font-bold text-textMain">${d.overview.dealSize}</span></div>
                    <div><span class="block text-xs text-textMuted uppercase">Industry</span><span class="font-bold text-textMain">${d.overview.industry}</span></div>
                    <div><span class="block text-xs text-textMuted uppercase">HQ</span><span class="font-bold text-textMain">${d.overview.headquarters}</span></div>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-accentBlue border-b border-borderSubtle mb-3 pb-1">Investment Thesis</h3>
                <ul class="list-disc pl-5 space-y-2 text-sm text-textMain">
                    ${d.thesis.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-accentBlue border-b border-borderSubtle mb-3 pb-1">Key Risks & Mitigants</h3>
                <table class="w-full text-sm text-left border-collapse">
                    <thead class="bg-bgSoft text-xs uppercase text-textMuted">
                        <tr>
                            <th class="p-2 border border-borderSubtle">Area</th>
                            <th class="p-2 border border-borderSubtle">Finding</th>
                            <th class="p-2 border border-borderSubtle">Mitigant</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${d.risks.map(r => `
                        <tr>
                            <td class="p-2 border border-borderSubtle font-bold text-textMain">${r.area}</td>
                            <td class="p-2 border border-borderSubtle text-textMain">${r.finding}</td>
                            <td class="p-2 border border-borderSubtle text-textMuted italic">${r.mitigant}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-accentBlue border-b border-borderSubtle mb-3 pb-1">Financial Summary</h3>
                <table class="w-full text-sm text-left border-collapse">
                     <thead class="bg-bgSoft text-xs uppercase text-textMuted">
                        <tr>
                            <th class="p-2 border border-borderSubtle">Metric</th>
                            <th class="p-2 border border-borderSubtle text-right">FY2023</th>
                            <th class="p-2 border border-borderSubtle text-right">FY2024</th>
                            <th class="p-2 border border-borderSubtle text-right">FY2025 (P)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-2 border border-borderSubtle font-bold text-textMain">Revenue</td>
                            ${d.financials.revenue.map(v => `<td class="p-2 border border-borderSubtle text-right font-mono text-textMain">${v}</td>`).join('')}
                        </tr>
                        <tr>
                            <td class="p-2 border border-borderSubtle font-bold text-textMain">EBITDA</td>
                            ${d.financials.ebitda.map(v => `<td class="p-2 border border-borderSubtle text-right font-mono text-textMain">${v}</td>`).join('')}
                        </tr>
                        <tr>
                            <td class="p-2 border border-borderSubtle font-bold text-textMain">Margin</td>
                            ${d.financials.margin.map(v => `<td class="p-2 border border-borderSubtle text-right font-mono text-accentBlue font-bold">${v}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="text-xs text-textMuted text-center mt-12 pt-4 border-t border-borderSubtle">
                Generated by DeepAuto PE Console • ${new Date().toLocaleDateString()}
            </div>
        </div>
        `;

    showReportModal("Investment Committee Memorandum", html, [
        { label: "Share via Email", onclick: "alert('Opening email client...')", primary: false },
        { label: "Export to PDF", onclick: "alert('Exporting PDF...')", primary: true }
    ]);
}

window.openLPReport = function () {
    const data = [...window.portfolioData.fund1, ...window.portfolioData.fund2];
    const totalInvested = data.reduce((sum, item) => sum + parseFloat(item.c.replace('$', '')), 0).toFixed(1);
    const totalFMV = data.reduce((sum, item) => sum + parseFloat(item.f.replace('$', '')), 0).toFixed(1);
    const totalMOIC = (totalFMV / totalInvested).toFixed(2);

    const html = `
        < div class= "max-w-3xl mx-auto" >
            <div class="text-center mb-8 border-b-2 border-gray-800 pb-4">
                <h1 class="text-3xl font-bold uppercase tracking-widest mb-2">Quarterly LP Report</h1>
                <div class="flex justify-between text-sm font-bold text-gray-600 mt-4">
                    <span>Period: Q3 2025</span>
                    <span>Funds: Fund I & II</span>
                    <span>Status: Final</span>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-4 mb-8">
                <div class="p-4 bg-gray-900 text-white rounded text-center">
                    <div class="text-xs uppercase opacity-70 mb-1">Total Invested</div>
                    <div class="text-xl font-bold">$${totalInvested}M</div>
                </div>
                <div class="p-4 bg-gray-900 text-white rounded text-center">
                    <div class="text-xs uppercase opacity-70 mb-1">Total FMV</div>
                    <div class="text-xl font-bold">$${totalFMV}M</div>
                </div>
                <div class="p-4 bg-gray-900 text-white rounded text-center">
                    <div class="text-xs uppercase opacity-70 mb-1">Gross MOIC</div>
                    <div class="text-xl font-bold text-emerald-400">${totalMOIC}x</div>
                </div>
                <div class="p-4 bg-gray-900 text-white rounded text-center">
                    <div class="text-xs uppercase opacity-70 mb-1">Active Assets</div>
                    <div class="text-xl font-bold">${data.length}</div>
                </div>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-blue-800 border-b border-gray-300 mb-3 pb-1">Portfolio Highlights</h3>
                <p class="mb-4 text-sm text-gray-700">
                    The portfolio continued to perform well in Q3, driven by strong organic growth in the Healthcare and Industrial Tech sectors. 
                    Overall revenue across the platform increased by 12% YoY. We successfully deployed $45M into one new platform investment (Apex Climate Services) 
                    and completed two add-on acquisitions for JDC Power Systems.
                </p>
            </div>

            <div class="mb-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-blue-800 border-b border-gray-300 mb-3 pb-1">Asset Performance Summary</h3>
                <table class="w-full text-sm text-left border-collapse">
                    <thead class="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th class="p-2 border border-gray-300">Company</th>
                            <th class="p-2 border border-gray-300">Sector</th>
                            <th class="p-2 border border-gray-300 text-right">Cost</th>
                            <th class="p-2 border border-gray-300 text-right">FMV</th>
                            <th class="p-2 border border-gray-300 text-right">MOIC</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => {
        const cost = parseFloat(item.c.replace('$', ''));
        const fmv = parseFloat(item.f.replace('$', ''));
        const moic = (fmv / cost).toFixed(2);
        const moicColor = moic >= 2.0 ? 'text-emerald-600 font-bold' : (moic >= 1.0 ? 'text-gray-900' : 'text-red-600');
        return `
                            <tr>
                                <td class="p-2 border border-gray-300 font-bold">${item.n}</td>
                                <td class="p-2 border border-gray-300 text-gray-600">${item.s}</td>
                                <td class="p-2 border border-gray-300 text-right font-mono">${item.c}</td>
                                <td class="p-2 border border-gray-300 text-right font-mono">${item.f}</td>
                                <td class="p-2 border border-gray-300 text-right font-mono ${moicColor}">${moic}x</td>
                            </tr>`;
    }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="text-xs text-gray-400 text-center mt-12 pt-4 border-t border-gray-200">
                Generated by DeepAuto PE Console • ${new Date().toLocaleDateString()}
            </div>
        </div >
        `;

    showReportModal("Quarterly Limited Partner Report", html, [
        { label: "Email to LPs", onclick: "alert('Email sent to LP distribution list.')", primary: false },
        { label: "Download PDF", onclick: "alert('Downloading LP_Report_Q3_2025.pdf...')", primary: true }
    ]);
}



function renderDiligenceRisks() {
    const risks = window.diligenceData.risks;
    const mapping = {
        'Financial': 'risk-fin',
        'Accounting': 'risk-acct',
        'Legal': 'risk-legal',
        'Regulatory': 'risk-legal', // Group Regulatory with Legal
        'Labor': 'risk-legal',      // Group Labor with Legal
        'Tech': 'risk-tech'
    };

    // Clear existing content
    Object.values(mapping).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    risks.forEach((risk, index) => {
        const targetId = mapping[risk.area];
        const container = document.getElementById(targetId);
        if (container) {
            let borderClass = "border-l-textMuted";
            let titleClass = "text-textMain";

            if (risk.impact.includes("High") || risk.impact.includes("Critical")) {
                borderClass = "border-l-accentRed";
                titleClass = "text-accentRed";
            } else if (risk.impact.includes("Medium")) {
                borderClass = "border-l-accentGold";
                titleClass = "text-accentGold";
            }

            const html = `
        < div class= "glass-panel p-5 rounded-lg border-l-4 ${borderClass}" >
                <div class="flex justify-between mb-2">
                    <h4 class="font-bold text-sm text-textMain ${titleClass}">Finding #${index + 1}: ${risk.area} Risk</h4>
                    <span class="text-[10px] font-mono text-textMuted">${risk.impact}</span>
                </div>
                <p class="text-xs text-textMain leading-relaxed opacity-90 mb-2">
                    ${risk.finding}
                </p>
                <div class="mt-2 p-2 bg-bgPanel rounded border border-borderSubtle text-[10px] text-textMuted">
                    <strong>Mitigant:</strong> ${risk.mitigant}
                </div>
            </div > `;
            container.innerHTML += html;
        }
    });
}

// --- Asset Detail View Logic ---
let detailFinancialChart = null;

window.viewAssetDetail = function (assetId) {
    // Find asset data
    let asset = null;
    ['fund1', 'fund2'].forEach(fund => {
        const found = portfolioData[fund].find(a => a.id === assetId);
        if (found) asset = found;
    });

    if (!asset) return;

    // Switch Views
    document.getElementById('portfolio-aggregate-view').classList.add('hidden');
    document.getElementById('portfolio-detail-view').classList.remove('hidden');

    renderAssetDetail(asset);
}

window.closeAssetDetail = function () {
    document.getElementById('portfolio-detail-view').classList.add('hidden');
    document.getElementById('portfolio-aggregate-view').classList.remove('hidden');
}

function renderAssetDetail(asset) {
    // Header
    document.getElementById('detail-breadcrumb-name').innerText = asset.n;
    document.getElementById('detail-name').innerText = asset.n;
    document.getElementById('detail-status').innerText = asset.st;
    document.getElementById('detail-status').className = `px-2 py-0.5 rounded text-[10px] font-bold ${asset.stc} ${asset.bg}`;

    document.getElementById('detail-sector').innerText = asset.s;
    document.getElementById('detail-date').innerText = asset.d;

    // Details
    if (asset.details) {
        document.getElementById('detail-lead').innerText = asset.details.lead || 'N/A';
        document.getElementById('detail-fmv').innerText = asset.f + 'M';
        document.getElementById('detail-cost').innerText = asset.c + 'M';
        document.getElementById('detail-ebitda').innerText = asset.e;
        document.getElementById('detail-margin').innerText = asset.details.kpis.margin || 'N/A';
        document.getElementById('detail-moic').innerText = asset.details.kpis.moic || 'N/A';
        document.getElementById('detail-irr').innerText = asset.details.kpis.irr || 'N/A';

        document.getElementById('detail-thesis').innerText = asset.details.thesis || 'No thesis available.';
        document.getElementById('detail-desc').innerText = asset.details.description || 'No description available.';

        // Updates
        const updatesContainer = document.getElementById('detail-updates');
        updatesContainer.innerHTML = '';
        if (asset.details.updates && asset.details.updates.length > 0) {
            asset.details.updates.forEach(update => {
                updatesContainer.innerHTML += `
                    <div class="relative pl-6">
                        <div class="absolute left-0 top-1.5 w-3 h-3 bg-bgPanel border-2 border-accentBlue rounded-full z-10"></div>
                        <h4 class="text-xs font-bold text-textMain">${update.title}</h4>
                        <div class="flex gap-2 text-[10px] text-textMuted mt-0.5">
                            <span>${update.date}</span>
                            <span>•</span>
                            <span class="text-accentBlue">${update.type}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            updatesContainer.innerHTML = '<p class="text-xs text-textMuted italic">No recent updates.</p>';
        }

        // Team
        const teamContainer = document.getElementById('detail-team');
        teamContainer.innerHTML = '';
        if (asset.details.team && asset.details.team.length > 0) {
            asset.details.team.forEach(member => {
                teamContainer.innerHTML += `
                    <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-bgSoft transition-colors">
                        <div class="w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold">
                            ${member.initials}
                        </div>
                        <div>
                            <div class="text-xs font-bold text-textMain">${member.name}</div>
                            <div class="text-[10px] text-textMuted">${member.role}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            teamContainer.innerHTML = '<p class="text-xs text-textMuted italic">No team data.</p>';
        }

        // Chart
        initDetailChart(asset.details.financials);
    }
}

function initDetailChart(financials) {
    if (detailFinancialChart) detailFinancialChart.destroy();
    const canvas = document.getElementById('detailFinancialChart');
    if (!canvas || !financials || !financials.years || financials.years.length === 0) return;

    const { textColor, gridColor } = getChartColors();

    detailFinancialChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: financials.years,
            datasets: [
                {
                    label: 'Revenue',
                    data: financials.revenue,
                    backgroundColor: '#94a3b8',
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'EBITDA',
                    data: financials.ebitda,
                    backgroundColor: '#10b981',
                    borderRadius: 4,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: textColor, font: { size: 10 } } },
                y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } }
            }
        }
    });
}

function renderPortfolioTable() {
    const tbody = document.getElementById('pfTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let assets = [];
    if (currentFund === 'all') {
        assets = [...portfolioData.fund1, ...portfolioData.fund2];
    } else {
        assets = portfolioData[currentFund];
    }

    assets.forEach(asset => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-bgSoft transition-colors cursor-pointer group";
        tr.onclick = () => viewAssetDetail(asset.id); // Add click handler

        tr.innerHTML = `
            <td class="px-5 py-3 font-medium group-hover:text-accentBlue transition-colors">${asset.n}</td>
            <td class="px-5 py-3 text-textMuted">${asset.s}</td>
            <td class="px-5 py-3 text-right text-textMuted font-mono">${asset.d}</td>
            <td class="px-5 py-3 text-right text-textMuted font-mono">${asset.c}</td>
            <td class="px-5 py-3 text-right font-bold font-mono">${asset.f}</td>
            <td class="px-5 py-3 text-right font-mono">${asset.e}</td>
            <td class="px-5 py-3 text-center">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${asset.stc} ${asset.bg}">${asset.st}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.runSourcingAI = function () {
    alert("Screen Complete: 7 new targets identified.");
    // Mock update logic
}

window.setRiskTab = function (tabId) {
    // Update Tab Styles
    document.querySelectorAll('.risk-tab').forEach(el => {
        el.classList.remove('active', 'text-accentBlue', 'border-accentBlue', 'bg-blue-50/50', 'dark:bg-blue-900/10');
        el.classList.add('text-textMuted', 'border-transparent');
    });

    const activeTab = document.getElementById(`tab-risk-${tabId}`);
    if (activeTab) {
        activeTab.classList.remove('text-textMuted', 'border-transparent');
        activeTab.classList.add('active', 'text-accentBlue', 'border-accentBlue', 'bg-blue-50/50', 'dark:bg-blue-900/10');
    }

    // Show Content
    document.querySelectorAll('.risk-content').forEach(el => el.classList.add('hidden'));
    const targetContent = document.getElementById(`risk-${tabId}`);
    if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('fade-in');
    }
}

window.runUWAgent = function () {
    const inputEl = document.getElementById('uwChatInput');
    const historyEl = document.getElementById('copilot-history');

    if (!inputEl || inputEl.value.trim() === "") return;

    const query = inputEl.value.trim();
    inputEl.value = "";

    // 1. Append User Message
    const userMsgHTML = `
        <div class="flex gap-3">
            <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">U</div>
            <div class="bg-bgSoft rounded-lg rounded-tl-none p-2 text-xs text-textMain max-w-[80%]">
                ${query}
            </div>
        </div>
    `;
    historyEl.insertAdjacentHTML('beforeend', userMsgHTML);
    historyEl.scrollTop = historyEl.scrollHeight;

    // 2. Simulate AI Response
    setTimeout(() => {
        let responseText = "";
        let tagsHTML = "";
        let codeBlock = null;
        let newData = null;

        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes("weight") || lowerQuery.includes("dcf")) {
            responseText = "I've updated the valuation weighting methodology. Increasing DCF weight to 60% based on stable cash flow profile.";
            tagsHTML = `
                <span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">DCF: 60%</span>
                <span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">Comps: 40%</span>
            `;
            // Mock update chart data
            newData = [100, 110, 125, 135, 145, 175];
        } else if (lowerQuery.includes("growth") || lowerQuery.includes("revenue")) {
            responseText = "Adjusted revenue growth assumptions for the forecast period. Sensitivity analysis suggests a +0.5x turn impact on valuation.";
            tagsHTML = `
                <span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">Growth: 5.0%</span>
                <span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">Impact: +$15M</span>
            `;
            newData = [100, 105, 115, 125, 140, 155];
        } else {
            // Context-Aware Logic
            const currentCompany = window.evalData.find(c => c.id === currentEvalId);
            const context = currentCompany?.copilotContext;

            let matchedScenario = null;
            if (context && context.scenarios) {
                matchedScenario = context.scenarios.find(s => lowerQuery.includes(s.trigger));
            }

            if (matchedScenario) {
                responseText = matchedScenario.response;
                codeBlock = matchedScenario.code;
                tagsHTML = `<span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">Scenario: ${matchedScenario.trigger.toUpperCase()}</span>`;
            } else {
                responseText = `I can help you model scenarios for ${currentCompany?.name || 'this deal'}. Try asking about specific drivers like "margin", "growth", or "risk".`;
                tagsHTML = `<span class="px-1.5 py-0.5 rounded bg-white/50 border border-accentPurple/20 text-[9px] font-mono text-accentPurple">Ready</span>`;
            }
        }

        const aiMsgHTML = `
                <div class="bg-accentPurple/10 rounded-lg rounded-tr-none p-2 text-xs text-textMain max-w-[80%]">
                    ${responseText}
                    <div class="flex gap-1 mt-2 flex-wrap">
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        `;

        // Append Code Block if available
        if (codeBlock) {
            aiMsgHTML += `
            <div class="flex gap-3 flex-row-reverse fade-in mt-1">
                <div class="w-6 shrink-0"></div> <!-- Spacer -->
                <div class="bg-[#1e1e1e] rounded-lg p-3 text-[10px] font-mono text-gray-300 max-w-[80%] overflow-x-auto border border-gray-700 shadow-lg">
                    <div class="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                        <span class="text-xs text-blue-400 font-bold">Python / Pandas Logic</span>
                        <span class="text-[9px] text-gray-500">Live Execution</span>
                    </div>
                    <pre class="whitespace-pre text-emerald-400">${codeBlock}</pre>
                </div>
            </div>
            `;
        }

        historyEl.insertAdjacentHTML('beforeend', aiMsgHTML);
        historyEl.scrollTop = historyEl.scrollHeight;

        // Update Chart if needed
        if (newData && evalChart) {
            evalChart.data.datasets[0].data = newData;
            evalChart.update();
        }

    }, 800);
}

window.updateScatter = function () {
    console.log("Updating scatter chart based on new axis selection...");
    // In a real app, this would re-render the scatter chart with new data mapping
    initEvalCharts();
}

// Initialize
window.onload = () => {
    // Map Portfolio Data
    if (window.portfolioData) {
        window.fund1Data = window.portfolioData.fund1;
        window.fund2Data = window.portfolioData.fund2;
    }

    initTheme();
    setTab('sourcing');
    switchFund('all');
    initLumina();
};
