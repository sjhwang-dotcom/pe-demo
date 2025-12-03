// Knowledge Base Data & Logic
// Note: knowledgePosts is loaded from js/data/knowledge-data.js

// --- State ---
let currentView = 'feed';
let isDarkMode = false;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderFeed();

    // Render Details for the first post initially (if exists)
    // To get sortedPosts, we need to call renderFeed and capture its return value,
    // or re-sort knowledgePosts here. For simplicity and to avoid re-sorting,
    // we'll just use the first knowledgePost for initial detail rendering.
    // The feed itself will be rendered sorted by renderFeed().
    if (knowledgePosts.length > 0) {
        // Find the first post after sorting logic (pinned, score, id)
        const sortedPosts = [...knowledgePosts].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            if (b.score !== a.score) return b.score - a.score;
            return b.id - a.id;
        });
        // renderPostDetail(sortedPosts[0]); // REMOVED: Do not overwrite the main feed
        // Also update right sidebar for the first post
        renderRightSidebar(sortedPosts[0]);
    }

    // Search Listener
    const searchInput = document.querySelector('input[placeholder="Search knowledge..."]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = knowledgePosts.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.content.toLowerCase().includes(term) ||
                p.tags.some(t => t.toLowerCase().includes(term))
            );
            renderFeed(filtered);
        });
    }

    // View Toggle Listeners
    const btnFeed = document.getElementById('btn-feed');
    const btnGraph = document.getElementById('btn-graph');

    if (btnFeed) btnFeed.addEventListener('click', () => switchView('feed'));
    if (btnGraph) btnGraph.addEventListener('click', () => switchView('graph'));
});

// --- Theme & Design Logic ---
function initTheme() {
    // 1. Light/Dark Mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // 2. Design Theme (Modern, Institutional, Terminal)
    const savedDesign = localStorage.getItem('design') || 'modern';
    setDesign(savedDesign);

    // Event Listeners
    document.getElementById('designSelect').addEventListener('change', (e) => setDesign(e.target.value));
}

function setTheme(mode) {
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');

    if (mode === 'dark') {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        isDarkMode = true;
    } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        isDarkMode = false;
    }
    localStorage.setItem('theme', mode);
}

function toggleTheme() {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
}

function setDesign(design) {
    document.documentElement.setAttribute('data-theme', design);
    localStorage.setItem('design', design);

    const select = document.getElementById('designSelect');
    if (select) select.value = design;
}

// --- Feed Rendering ---
// --- Feed Rendering (Left Sidebar Navigation) ---
function renderFeed(posts) {
    // Fallback to global data if not provided
    if (!posts && typeof knowledgePosts !== 'undefined') {
        posts = knowledgePosts;
    }

    const feedList = document.getElementById('feed-list');
    if (!feedList) return;

    if (!posts || posts.length === 0) {
        feedList.innerHTML = '<div class="p-8 text-center text-textMuted">No knowledge posts found.</div>';
        return;
    }

    // Sort Logic: Pinned > Score > Recency
    const sortedPosts = [...posts].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (b.score !== a.score) return b.score - a.score;
        return b.id - a.id;
    });

    // Render Left Sidebar (Compact Navigation)
    feedList.innerHTML = sortedPosts.map(post => `
        <div onclick="scrollToPost(${post.id})" class="p-3 border-b border-borderSubtle hover:bg-bgSoft cursor-pointer transition-colors group relative">
            ${post.pinned ? `<div class="absolute top-0 right-0 w-2 h-2 rounded-bl bg-accentBlue opacity-50"></div>` : ''}
            <h3 class="font-bold text-xs text-textMain mb-1 line-clamp-2 group-hover:text-accentBlue transition-colors">${post.title}</h3>
            <div class="flex items-center justify-between text-[10px] text-textMuted">
                <span>${post.author}</span>
                <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    ${post.score}
                </span>
            </div>
        </div>
    `).join('');

    // Render Main Feed (Center Panel - Reddit Style)
    renderMainFeed(sortedPosts);
}

// --- Main Feed Rendering (Center Panel) ---
function renderMainFeed(posts) {
    const container = document.getElementById('post-detail-container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Render ALL posts in a continuous feed
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.id = `post-${post.id}`; // For scrolling
        postElement.className = "mb-8"; // Spacing between posts
        postElement.innerHTML = renderPostCard(post);
        container.appendChild(postElement);
    });
}

function renderPostCard(post) {
    // Author Badge Color
    let badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    if (post.authorRole === 'System') badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    if (post.authorRole === 'Super Agent') badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    if (post.authorRole === 'Agent') badgeClass = "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    if (post.authorRole === 'Human') badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

    // External Refs HTML
    const externalRefsHtml = post.externalRefs && post.externalRefs.length > 0 ? `
        <div class="flex flex-wrap gap-2 mt-3">
            ${post.externalRefs.map(ref => `
                <a href="${ref.url}" class="flex items-center gap-1 px-2 py-1 rounded bg-bgSoft border border-borderSubtle text-[10px] text-accentBlue hover:underline">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    ${ref.source}: ${ref.title}
                </a>
            `).join('')}
        </div>
    ` : '';

    // Internal Grounding HTML
    const internalGroundingHtml = post.internalGrounding && post.internalGrounding.length > 0 ? `
        <div class="flex flex-wrap gap-2 mt-2">
            ${post.internalGrounding.map(g => `
                <span class="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-[10px] text-amber-700 dark:text-amber-400">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
                    ${g.dataset} (${g.metric})
                </span>
            `).join('')}
        </div>
    ` : '';

    // Consolidated Summary (Knowledge Agent)
    const summaryHtml = post.consolidatedSummary ? `
        <div class="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
            ${post.consolidatedSummary}
        </div>
    ` : '';

    // Related Knowledge HTML
    let relatedHtml = '';
    if (post.relatedIds && post.relatedIds.length > 0) {
        // We need to access the global knowledgePosts to find titles
        // Since renderPostCard might be called where knowledgePosts is available in scope
        const relatedPosts = knowledgePosts.filter(p => post.relatedIds.includes(p.id));
        if (relatedPosts.length > 0) {
            relatedHtml = `
                <div class="mt-6 pt-4 border-t border-borderSubtle">
                    <h4 class="font-bold text-xs text-textMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 text-accentBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        Related Knowledge
                    </h4>
                    <div class="space-y-2">
                        ${relatedPosts.map(rp => `
                            <div onclick="scrollToPost(${rp.id})" class="p-3 rounded-lg bg-bgSoft border border-borderSubtle hover:border-accentBlue cursor-pointer transition-colors group flex items-center justify-between">
                                <div class="overflow-hidden">
                                    <h5 class="font-bold text-xs text-textMain group-hover:text-accentBlue mb-0.5 truncate">${rp.title}</h5>
                                    <span class="text-[10px] text-textMuted">by ${rp.author}</span>
                                </div>
                                <span class="flex items-center gap-1 text-[10px] text-textMuted shrink-0 ml-3">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                                    ${rp.score}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    return `
        <article class="bg-bgPanel border border-borderSubtle rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <!-- Header -->
            <div class="p-5 border-b border-borderSubtle bg-bgSoft/30">
                <div class="flex items-center gap-2 mb-3">
                    ${post.tags.map(tag => `<span class="px-2 py-1 rounded-md bg-bgSoft border border-borderSubtle text-[10px] font-bold text-textMuted uppercase tracking-wider">${tag}</span>`).join('')}
                    ${post.pinned ? `<span class="px-2 py-1 rounded-md bg-accentBlue/10 border border-accentBlue/20 text-[10px] font-bold text-accentBlue uppercase tracking-wider flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>Pinned</span>` : ''}
                </div>
                <h1 class="font-head font-bold text-xl text-textMain mb-2 leading-tight">${post.title}</h1>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-textMain">
                            ${post.author.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-textMain">${post.author}</span>
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeClass}">${post.authorRole}</span>
                            </div>
                            <span class="text-xs text-textMuted">${post.time} • ${post.usageStats}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="p-2 rounded-lg hover:bg-bgSoft text-textMuted hover:text-accentBlue transition-colors" title="Share">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Metadata & Grounding -->
            <div class="px-5 py-3 bg-bgSoft/50 border-b border-borderSubtle text-xs">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span class="font-bold text-textMain block mb-1">Discovery Origin:</span>
                        <span class="text-textMuted flex items-center gap-1">
                            <svg class="w-3 h-3 text-accentBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${post.discoveryMethod}
                        </span>
                    </div>
                    <div>
                        <span class="font-bold text-textMain block mb-1">Agent Validation:</span>
                        <div class="flex flex-wrap gap-1">
                            ${post.appliedBy ? post.appliedBy.map(agent => `
                                <span class="px-1.5 py-0.5 rounded bg-bgPanel border border-borderSubtle text-[10px] font-bold text-textMain flex items-center gap-1">
                                    <span class="w-1 h-1 rounded-full bg-green-500"></span>${agent}
                                </span>
                            `).join('') : '<span class="text-textMuted">Pending</span>'}
                        </div>
                    </div>
                </div>
                ${externalRefsHtml}
                ${internalGroundingHtml}
            </div>

            <!-- Content -->
            <div class="p-6 text-sm text-textMain leading-relaxed space-y-4 font-serif">
                ${post.content}
                ${summaryHtml}
                ${relatedHtml}
            </div>

            <!-- Comments -->
            <div class="bg-bgSoft/50 p-5 border-t border-borderSubtle">
                <h3 class="font-bold text-xs text-textMuted uppercase tracking-wider mb-4">Discussion & Validation</h3>
                <div class="space-y-4">
                    ${renderComments(post.comments)}
                </div>
            </div>
        </article>
    `;
}

function renderComments(comments) {
    if (!comments || comments.length === 0) return '<p class="text-xs text-textMuted italic">No comments yet.</p>';

    return comments.map(comment => `
        <div class="flex gap-3">
            <div class="w-6 h-6 rounded-full bg-bgPanel border border-borderSubtle flex items-center justify-center text-[10px] font-bold text-textMuted shrink-0 shadow-sm">
                ${comment.user.substring(0, 1)}
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-textMain">${comment.user} <span class="text-[10px] font-normal text-textMuted">(${comment.role})</span></span>
                    <span class="text-[10px] text-accentBlue font-bold bg-accentBlue/10 px-1.5 py-0.5 rounded">+${comment.score}</span>
                </div>
                <p class="text-xs text-textMuted leading-relaxed mb-2">${comment.text}</p>
                
                <!-- Nested Replies -->
                ${comment.replies && comment.replies.length > 0 ? `
                    <div class="pl-4 border-l-2 border-borderSubtle mt-2 space-y-3">
                        ${renderComments(comment.replies)}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function scrollToPost(id) {
    // NOTE: This function should NOT switch to Graph View.
    // It is intended to scroll to the post within the Feed View.
    const element = document.getElementById(`post-${id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight effect
        element.classList.add('ring-2', 'ring-accentBlue', 'ring-offset-2', 'ring-offset-bgBody');
        setTimeout(() => {
            element.classList.remove('ring-2', 'ring-accentBlue', 'ring-offset-2', 'ring-offset-bgBody');
        }, 2000);
    }
}

function renderRightSidebar(post) {
    const sidebar = document.getElementById('right-sidebar-content');
    if (!sidebar) return;

    // --- Feed Summary Logic ---
    let summaryHtml = '';
    if (currentView === 'graph') {
        if (activeClusterId) {
            const topic = activeClusterId.replace('cluster-', '');
            const count = knowledgePosts.filter(p => {
                const postTopic = p.tags[0] || 'Uncategorized';
                const topTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 5);
                const effectiveTopic = topTags.includes(postTopic) ? postTopic : 'Other';
                return effectiveTopic === topic;
            }).length;
            summaryHtml = `
                <div class="glass-panel p-4 rounded-xl border border-borderSubtle mb-4 bg-bgSoft/50">
                    <h3 class="font-bold text-xs text-textMain uppercase tracking-wider mb-2">Cluster Summary</h3>
                    <ul class="list-disc pl-4 space-y-1 text-xs text-textMuted">
                        <li><strong>Topic:</strong> ${topic}</li>
                        <li><strong>Items:</strong> ${count} knowledge posts</li>
                        <li><strong>Focus:</strong> Exploring connections within ${topic}.</li>
                    </ul>
                </div>
            `;
        } else {
            summaryHtml = `
                <div class="glass-panel p-4 rounded-xl border border-borderSubtle mb-4 bg-bgSoft/50">
                    <h3 class="font-bold text-xs text-textMain uppercase tracking-wider mb-2">Graph Overview</h3>
                    <ul class="list-disc pl-4 space-y-1 text-xs text-textMuted">
                        <li><strong>Total:</strong> ${knowledgePosts.length} knowledge posts</li>
                        <li><strong>Clusters:</strong> Top 5 topics + others</li>
                        <li><strong>Interaction:</strong> Click a cluster to explore.</li>
                    </ul>
                </div>
            `;
        }
    } else {
        // Feed View Summary
        summaryHtml = `
            <div class="glass-panel p-4 rounded-xl border border-borderSubtle mb-4 bg-bgSoft/50">
                <h3 class="font-bold text-xs text-textMain uppercase tracking-wider mb-2">Feed Summary</h3>
                <ul class="list-disc pl-4 space-y-1 text-xs text-textMuted">
                    <li><strong>Latest:</strong> ${knowledgePosts.length} new insights</li>
                    <li><strong>Trending:</strong> #Valuation, #Risk</li>
                    <li><strong>Action:</strong> Review pinned items first.</li>
                </ul>
            </div>
        `;
    }

    // Find related posts (if a post is selected)
    const relatedPosts = post && post.relatedIds ? knowledgePosts.filter(p => post.relatedIds.includes(p.id)) : [];

    const relatedHtml = relatedPosts.map(p => `
        <div onclick="scrollToPost(${p.id})" class="p-3 rounded-lg border border-borderSubtle bg-bgSoft hover:bg-bgPanel cursor-pointer transition-colors group">
            <h4 class="font-bold text-xs text-textMain mb-1 group-hover:text-accentBlue transition-colors line-clamp-2">${p.title}</h4>
            <div class="flex items-center gap-2 text-[10px] text-textMuted">
                <span>${p.score} pts</span>
                <span>•</span>
                <span>${p.comments.length} replies</span>
            </div>
        </div>
    `).join('');

    sidebar.innerHTML = `
        <div class="p-4 sticky top-0 h-full overflow-y-auto">
            <!-- Feed Summary -->
            ${summaryHtml}

            <!-- Selected Post Preview (Only in Graph Mode) -->
            ${currentView === 'graph' && post ? `
            <div class="glass-panel p-4 rounded-xl border border-borderSubtle mb-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div class="flex items-center gap-2 mb-2">
                    <span class="px-1.5 py-0.5 rounded bg-accentBlue/10 text-accentBlue text-[10px] font-bold uppercase">Selected</span>
                </div>
                <h3 class="font-bold text-sm text-textMain mb-2 leading-tight">${post.title}</h3>
                <p class="text-xs text-textMuted line-clamp-3 mb-3">${post.content.replace(/<[^>]*>?/gm, '')}</p>
                <button onclick="switchView('feed'); scrollToPost(${post.id})" class="text-xs text-accentBlue font-bold hover:underline flex items-center gap-1">
                    Read Full Post 
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>
            ` : ''}

            <!-- Related Posts (Only if a post is selected) -->
            ${post ? `
            <div class="glass-panel p-4 rounded-xl border border-borderSubtle mb-4">
                <h3 class="font-bold text-xs text-textMain uppercase tracking-wider mb-3">Related Knowledge Posts</h3>
                <div class="space-y-3">
                    ${relatedHtml.length > 0 ? relatedHtml : '<p class="text-xs text-textMuted italic">No related posts found for this item.</p>'}
                </div>
                ${currentView === 'feed' ? `
                <button onclick="switchView('graph')" class="w-full mt-4 py-2 rounded-lg border border-accentBlue/30 bg-accentBlue/10 text-accentBlue text-xs font-bold hover:bg-accentBlue/20 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    View in Knowledge Graph
                </button>
                ` : ''}
            </div>
            ` : ''}
        </div>
    `;
}

// --- View Logic ---
// --- View Logic ---
function switchView(view) {
    currentView = view;
    const feedContainer = document.getElementById('post-detail-container');
    const graphView = document.getElementById('view-graph');
    const btnFeed = document.getElementById('btn-feed');
    const btnGraph = document.getElementById('btn-graph');

    if (!feedContainer || !graphView) {
        console.error("View containers not found:", { feedContainer, graphView });
        return;
    }

    if (view === 'feed') {
        feedContainer.classList.remove('hidden');
        graphView.classList.add('hidden');

        btnFeed.classList.add('bg-bgPanel', 'shadow', 'text-textMain');
        btnFeed.classList.remove('text-textMuted');

        btnGraph.classList.remove('bg-bgPanel', 'shadow', 'text-textMain');
        btnGraph.classList.add('text-textMuted');

        // Stop graph simulation if running
        if (graphSimulation) {
            cancelAnimationFrame(graphSimulation);
            graphSimulation = null;
        }
        // Update sidebar for feed view
        renderRightSidebar(null);
    } else {
        feedContainer.classList.add('hidden');
        graphView.classList.remove('hidden');

        btnGraph.classList.add('bg-bgPanel', 'shadow', 'text-textMain');
        btnGraph.classList.remove('text-textMuted');

        btnFeed.classList.remove('bg-bgPanel', 'shadow', 'text-textMain');
        btnFeed.classList.add('text-textMuted');

        // Initialize Graph
        // Small delay to ensure container is visible for size calculation
        setTimeout(() => {
            requestAnimationFrame(renderGraph);
        }, 50);
        // Update sidebar for graph view (initial state)
        renderRightSidebar(null);
    }
}

// --- Graph Logic (Canvas) ---
let graphSimulation = null;

// --- Graph Logic (Clustered) ---
// graphSimulation is already declared above
// let graphSimulation = null; 
let activeClusterId = null; // State for expanded cluster
let tagCounts = {}; // Global to store tag frequencies

// Color Palette for Clusters
const clusterColors = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Purple
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
];

function renderGraph() {
    const canvas = document.getElementById('knowledgeGraphCanvas');
    if (!canvas) return;

    // Resize canvas
    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // --- 1. Data Processing (Clustering) ---
    // Count tag frequencies
    tagCounts = {}; // Reset for fresh calculation
    knowledgePosts.forEach(p => {
        const tag = p.tags[0] || 'Uncategorized';
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    // Sort tags by frequency and pick top 5
    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    const topTags = sortedTags.slice(0, 5);
    const otherTag = 'Other';

    // Helper to get cluster for a post
    const getClusterTopic = (post) => {
        const tag = post.tags[0] || 'Uncategorized';
        return topTags.includes(tag) ? tag : otherTag;
    };

    // Create Cluster Nodes (Top 5 + Other)
    const clusterTopics = [...topTags];
    if (sortedTags.length > 5) clusterTopics.push(otherTag);

    const clusterNodes = clusterTopics.map((topic, index) => ({
        id: `cluster-${topic}`,
        label: topic,
        type: 'cluster',
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        radius: 40,
        color: clusterColors[index % clusterColors.length],
        count: knowledgePosts.filter(p => getClusterTopic(p) === topic).length
    }));

    // Create Post Nodes
    let postNodes = [];
    if (activeClusterId) {
        const activeTopic = clusterNodes.find(c => c.id === activeClusterId)?.label;
        if (activeTopic) {
            // 1. Nodes in the active cluster
            const clusterPosts = knowledgePosts.filter(p => getClusterTopic(p) === activeTopic);

            // 2. Nodes related to the active cluster nodes (Cross-Cluster)
            const relatedIds = new Set();
            clusterPosts.forEach(p => {
                if (p.relatedIds) p.relatedIds.forEach(id => relatedIds.add(id));
            });

            // Filter related posts that are NOT in the active cluster
            const relatedPosts = knowledgePosts.filter(p => relatedIds.has(p.id) && getClusterTopic(p) !== activeTopic);

            // Combine
            postNodes = [...clusterPosts, ...relatedPosts].map(p => {
                // Determine color based on ITS OWN cluster
                const topic = getClusterTopic(p);
                const clusterIndex = clusterTopics.indexOf(topic);
                const color = clusterColors[clusterIndex % clusterColors.length];

                return {
                    id: p.id,
                    label: p.title,
                    type: 'post',
                    x: width / 2 + (Math.random() - 0.5) * 50,
                    y: height / 2 + (Math.random() - 0.5) * 50,
                    vx: 0,
                    vy: 0,
                    radius: 15 + (p.score / 25),
                    color: color, // Inherit cluster color
                    data: p,
                    clusterId: `cluster-${topic}`
                };
            });
        }
    }

    const nodes = [...clusterNodes, ...postNodes];

    // Links
    let links = [];

    postNodes.forEach(post => {
        // 1. Connect to its own cluster (Parent-Child)
        links.push({
            source: post.clusterId,
            target: post.id,
            type: 'parent'
        });

        // 2. Connect related posts (Sibling-Sibling or Cross-Cluster)
        if (post.data.relatedIds) {
            post.data.relatedIds.forEach(relatedId => {
                const targetNode = postNodes.find(n => n.id === relatedId);
                if (targetNode && post.id < relatedId) {
                    links.push({
                        source: post.id,
                        target: relatedId,
                        type: 'related'
                    });
                }
            });
        }
    });

    // --- 2. Simulation Constants ---
    const REPULSION = 4500; // Increased to keep clusters apart
    const SPRING_LENGTH = 100; // Shorter for tighter clusters
    const SPRING_STRENGTH = 0.15; // Stronger for tighter clusters
    const CENTER_PULL = 0.0005;
    const DAMPING = 0.6;
    const COLLISION_PADDING = 60;

    // UI Bounds (Strict Avoidance Zones)
    // Aggressively Expanded
    const LEGEND_RECT = { x: width - 260, y: 0, w: 260, h: 350 }; // Top Right (Taller)
    const TITLE_RECT = { x: 0, y: 0, w: 500, h: 140 }; // Top Left (Much Wider for Subtitle)
    const BACK_BTN_RECT = { x: 0, y: height - 80, w: 200, h: 80 }; // Bottom Left

    // Helper for text wrapping
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // --- 3. Interaction State ---
    let hoverNode = null;
    // let frameCount = 0; // Removed for continuous floating

    // --- 4. Render Legend ---
    renderLegend(clusterNodes);

    // --- 5. Animation Loop ---
    function step() {
        if (!graphSimulation && currentView !== 'graph') return;

        // Continuous floating (No freeze)

        // Update Physics
        updatePhysics();

        // Draw
        draw();

        graphSimulation = requestAnimationFrame(step);
    }

    function updatePhysics() {
        // 1. Repulsion
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                let force = REPULSION / (dist * dist);
                if (nodes[i].type === 'cluster' && nodes[j].type === 'cluster') {
                    force *= 3;
                }

                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                nodes[j].vx += fx;
                nodes[j].vy += fy;
                nodes[i].vx -= fx;
                nodes[i].vy -= fy;
            }
        }

        // 2. Links (Springs)
        links.forEach(link => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (source && target) {
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                // Tuned Spring Logic
                let length, strength;

                if (link.type === 'parent') {
                    // Strong, short springs for Cluster -> Post
                    length = SPRING_LENGTH;
                    strength = SPRING_STRENGTH;
                } else {
                    // Weak, long springs for Related Posts (minimize tangling)
                    length = 200;
                    strength = 0.01;
                }

                const force = (dist - length) * strength;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                source.vx += fx;
                source.vy += fy;
                target.vx -= fx;
                target.vy -= fy;
            }
        });

        // 3. Center Pull & Bounds
        nodes.forEach(node => {
            // Center Pull
            let targetX = width / 2;
            let targetY = height / 2;

            if (node.id === activeClusterId) {
                targetY = height / 3;
                node.vx += (targetX - node.x) * 0.05;
                node.vy += (targetY - node.y) * 0.05;
            } else {
                node.vx += (targetX - node.x) * CENTER_PULL;
                node.vy += (targetY - node.y) * CENTER_PULL;
            }

            // Apply Velocity & Damping
            node.vx *= DAMPING;
            node.vy *= DAMPING;
            node.x += node.vx;
            node.y += node.vy;

            // STRICT BOUNDS (Hard Clamping)
            const r = node.radius + 5;

            // Canvas Bounds
            node.x = Math.max(r, Math.min(width - r, node.x));
            node.y = Math.max(r, Math.min(height - r, node.y));

            // --- UI AVOIDANCE (Hard Walls) ---

            // 1. Legend (Top Right)
            if (node.x > LEGEND_RECT.x - r && node.y < LEGEND_RECT.y + LEGEND_RECT.h + r) {
                // Push to Left or Bottom
                const distToLeft = Math.abs(node.x - (LEGEND_RECT.x - r));
                const distToBottom = Math.abs(node.y - (LEGEND_RECT.y + LEGEND_RECT.h + r));

                if (distToLeft < distToBottom) {
                    node.x = LEGEND_RECT.x - r;
                    if (node.vx > 0) node.vx = 0;
                } else {
                    node.y = LEGEND_RECT.y + LEGEND_RECT.h + r;
                    if (node.vy < 0) node.vy = 0;
                }
            }

            // 2. Title (Top Left)
            if (node.x < TITLE_RECT.x + TITLE_RECT.w + r && node.y < TITLE_RECT.y + TITLE_RECT.h + r) {
                // Push to Right or Bottom
                const distToRight = Math.abs(node.x - (TITLE_RECT.x + TITLE_RECT.w + r));
                const distToBottom = Math.abs(node.y - (TITLE_RECT.y + TITLE_RECT.h + r));

                if (distToRight < distToBottom) {
                    node.x = TITLE_RECT.x + TITLE_RECT.w + r;
                    if (node.vx < 0) node.vx = 0;
                } else {
                    node.y = TITLE_RECT.y + TITLE_RECT.h + r;
                    if (node.vy < 0) node.vy = 0;
                }
            }

            // 3. Back Button (Bottom Left)
            if (node.x < BACK_BTN_RECT.x + BACK_BTN_RECT.w + r && node.y > BACK_BTN_RECT.y - r) {
                // Push to Right or Top
                const distToRight = Math.abs(node.x - (BACK_BTN_RECT.x + BACK_BTN_RECT.w + r));
                const distToTop = Math.abs(node.y - (BACK_BTN_RECT.y - r));

                if (distToRight < distToTop) {
                    node.x = BACK_BTN_RECT.x + BACK_BTN_RECT.w + r;
                    if (node.vx < 0) node.vx = 0;
                } else {
                    node.y = BACK_BTN_RECT.y - r;
                    if (node.vy > 0) node.vy = 0;
                }
            }
        });

        // 4. Collision Resolution
        for (let k = 0; k < 3; k++) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const minDist = nodes[i].radius + nodes[j].radius + COLLISION_PADDING;

                    if (dist < minDist) {
                        const overlap = minDist - dist;
                        const moveX = (dx / dist) * overlap * 0.5;
                        const moveY = (dy / dist) * overlap * 0.5;

                        nodes[j].x += moveX;
                        nodes[j].y += moveY;
                        nodes[i].x -= moveX;
                        nodes[i].y -= moveY;

                        nodes[j].vx *= 0.5;
                        nodes[j].vy *= 0.5;
                        nodes[i].vx *= 0.5;
                        nodes[i].vy *= 0.5;
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Background
        if (isDarkMode) {
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, width, height);
        } else {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, width, height);
        }

        // Links
        links.forEach(link => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (source && target) {
                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);

                if (link.type === 'parent') {
                    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    ctx.lineWidth = 1;
                } else {
                    ctx.strokeStyle = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([5, 5]);
                }

                ctx.stroke();
                ctx.setLineDash([]);
            }
        });

        // Nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;

            if (node.type === 'cluster') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = node.color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fill();
            ctx.shadowBlur = 0;

            // Border
            ctx.strokeStyle = isDarkMode ? '#fff' : '#fff';
            ctx.lineWidth = node.id === activeClusterId ? 4 : 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = isDarkMode ? '#fff' : '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (node.type === 'cluster') {
                ctx.font = 'bold 14px Inter';
                ctx.fillText(node.label, node.x, node.y);
                ctx.font = '10px Inter';
                ctx.fillText(`${node.count} items`, node.x, node.y + 14);
            } else {
                ctx.font = '11px Inter';
                const maxWidth = 100;
                const lines = wrapText(ctx, node.label, maxWidth);
                const lineHeight = 13;

                ctx.fillStyle = isDarkMode ? '#e2e8f0' : '#334155';
                lines.forEach((line, i) => {
                    ctx.fillText(line, node.x, node.y + node.radius + 12 + (i * lineHeight));
                });
            }
        });
    }

    step();

    // --- Interaction ---
    canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        hoverNode = nodes.find(node => {
            const dx = node.x - mouseX;
            const dy = node.y - mouseY;
            return Math.sqrt(dx * dx + dy * dy) < node.radius + 5;
        });

        canvas.style.cursor = hoverNode ? 'pointer' : 'default';
    };

    canvas.onclick = (e) => {
        if (hoverNode) {
            if (hoverNode.type === 'cluster') {
                // Toggle Cluster
                if (activeClusterId === hoverNode.id) {
                    activeClusterId = null; // Collapse
                } else {
                    activeClusterId = hoverNode.id; // Expand
                }
                // Restart simulation to handle new nodes
                cancelAnimationFrame(graphSimulation);
                renderGraph();
            } else if (hoverNode.type === 'post') {
                // Show Details
                renderRightSidebar(hoverNode.data);
            }
        } else {
            // Click background to deselect/collapse?
            // activeClusterId = null;
            // cancelAnimationFrame(graphSimulation);
            // renderGraph();
        }
    };
}

function renderLegend(clusters) {
    const container = document.getElementById('view-graph');
    let legend = document.getElementById('graph-legend');

    // Create if not exists
    if (!legend) {
        legend = document.createElement('div');
        legend.id = 'graph-legend';
        legend.className = 'absolute top-4 right-4 bg-bgPanel/90 backdrop-blur p-3 rounded-lg border border-borderSubtle shadow-sm z-20 max-w-[200px]';
        container.appendChild(legend);
    }

    legend.innerHTML = `
        <h4 class="text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Topics</h4>
        <div class="space-y-1.5">
            ${clusters.map(c => `
                <div class="flex items-center gap-2 cursor-pointer hover:bg-bgSoft rounded p-1 transition-colors" onclick="triggerClusterClick('${c.id}')">
                    <span class="w-3 h-3 rounded-full" style="background-color: ${c.color}"></span>
                    <span class="text-xs text-textMain font-medium truncate">${c.label}</span>
                    <span class="text-[10px] text-textMuted ml-auto">${c.count}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Helper to trigger click from legend
window.triggerClusterClick = function (clusterId) {
    activeClusterId = (activeClusterId === clusterId) ? null : clusterId;
    // Re-render
    const canvas = document.getElementById('knowledgeGraphCanvas');
    if (canvas) {
        // We need to restart the render loop
        // Best way is to just call renderGraph again, which cancels old loop if we manage it right
        // But renderGraph doesn't cancel the *current* loop if called recursively.
        // We should cancel existing before calling.
        if (graphSimulation) cancelAnimationFrame(graphSimulation);
        renderGraph();
    }
}
