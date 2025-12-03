const agentsData = [
    {
        id: 'super-agent',
        name: 'Super Agent',
        role: 'AI COO & System Orchestrator',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        summary: 'The AI-first Chief Operating Officer (COO) that orchestrates the entire enterprise.',
        description: 'SuperAgent is an AI-first orchestration layer that functions as the autonomous Chief Operating Officer (COO) of an organization. Unlike traditional task agents that automate isolated workflows, SuperAgent oversees all operational processes, dynamically spawns and coordinates specialized agents, monitors their performance, and continuously learns from their outputs. It integrates with the company’s knowledge base and execution logs to generate real-time insights, detect anomalies, and adapt workflows. When novel or unstructured problems arise, SuperAgent intelligently creates new agents through an AgentBuilder module, ensuring the system evolves without human bottlenecks.',
        spec: {
            objective: 'Run the entire operation of an enterprise with minimal human intervention.',
            inputs: [
                { name: 'User Prompt', type: 'String', desc: 'Natural language request from the user.' },
                { name: 'System State', type: 'Object', desc: 'Current context of the workspace and active agents.' }
            ],
            outputs: [
                { name: 'Execution Plan', type: 'JSON', desc: 'DAG of tasks assigned to specific agents.' },
                { name: 'Final Response', type: 'String', desc: 'Synthesized answer or confirmation of action.' }
            ],
            interactions: [
                'Sourcing Agent',
                'Evaluation Agent',
                'Diligence Agent',
                'Reporting Agent'
            ]
        },
        tools: [
            { type: 'code', name: 'Agent Spawner', description: 'Instantiates and configures new agent processes based on task requirements.' },
            { type: 'api', name: 'System Monitor API', description: 'Real-time telemetry of all active agents, checking for errors or bottlenecks.' },
            { type: 'code', name: 'Workflow Orchestrator', description: 'Manages the dependency graph of tasks, ensuring sequential or parallel execution.' }
        ],
        knowledge: ['System Architecture', 'Master Workflow Protocols', 'Error Recovery Strategies'],
        workflow: {
            nodes: [
                { id: 'start', label: 'Receive Investment Mandate', type: 'input', tool: 'Interface', prompt: 'Parse user criteria for new investment targets.' },
                { id: 'step1', label: 'Delegate to Sourcing Agent', type: 'agent', tool: 'Sourcing Agent', prompt: 'Identify and qualify high-potential targets matching the mandate.' },
                { id: 'step2', label: 'Delegate to Evaluation Agent', type: 'agent', tool: 'Evaluation Agent', prompt: 'Perform initial financial analysis and strategic fit assessment.' },
                { id: 'step3', label: 'Delegate to Diligence Agent', type: 'agent', tool: 'Diligence Agent', prompt: 'Conduct deep-dive legal, financial, and technical due diligence.' },
                { id: 'step4', label: 'Delegate to Reporting Agent', type: 'agent', tool: 'Reporting Agent', prompt: 'Synthesize findings into a final Investment Committee memo.' },
                { id: 'end', label: 'Present Final Recommendation', type: 'output', tool: 'Interface', prompt: 'Display the final IC Memo and recommendation to the user.' }
            ],
            edges: [
                { from: 'start', to: 'step1' },
                { from: 'step1', to: 'step2' },
                { from: 'step2', to: 'step3' },
                { from: 'step3', to: 'step4' },
                { from: 'step4', to: 'end' }
            ]
        }
    },
    {
        id: 'sourcing',
        name: 'Sourcing Agent',
        role: 'Deal Origination',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        summary: 'Scans market data to identify investment targets matching the mandate.',
        description: 'Autonomous scout that monitors multiple data streams to identify investment opportunities matching the fund\'s mandate.',
        spec: {
            objective: 'Identify and qualify potential investment targets from raw market data.',
            inputs: [
                { name: 'Investment Mandate', type: 'JSON', desc: 'Criteria for EBITDA, Sector, Geography, etc.' },
                { name: 'Market Feeds', type: 'Stream', desc: 'Live data from Pitchbook, Grata, LinkedIn.' }
            ],
            outputs: [
                { name: 'Qualified Lead', type: 'Object', desc: 'Company profile with preliminary fit score.' },
                { name: 'Pipeline Update', type: 'Event', desc: 'Notification to add target to CRM.' }
            ],
            interactions: [
                'Queries DB Agent to check for existing records (deduplication).',
                'Triggers Evaluation Agent for high-scoring leads.'
            ]
        },
        tools: [
            { type: 'datasource', name: 'Pitchbook Data Feed', description: 'Access to global private market transaction data and financials.' },
            { type: 'datasource', name: 'Grata Private Co Search', description: 'Deep search engine for discovering middle-market private companies.' },
            { type: 'datasource', name: 'LinkedIn Talent Signals', description: 'Monitors executive hiring trends as a proxy for growth or distress.' },
            { type: 'api', name: 'Clearbit Enrichment API', description: 'Enriches company domains with firmographic data (employee count, tech stack).' }
        ],
        knowledge: ['Investment Mandate', 'Market Sector Analysis', 'Sourcing Heuristics'],
        goals: {
            mainGoal: "Identify and qualify high-potential investment targets",
            subGoals: [
                {
                    title: "Monitor Market Feeds",
                    tasks: ["Scan Pitchbook for new listings", "Monitor LinkedIn for executive moves", "Filter opportunities by mandate"]
                },
                {
                    title: "Enrich Company Profiles",
                    tasks: ["Call Clearbit API for firmographics", "Retrieve preliminary financials", "Map competitive landscape"]
                },
                {
                    title: "Qualify Leads",
                    tasks: ["Score targets against investment criteria", "Check for existing records (dedup)", "Prioritize high-fit opportunities"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Monitor Feeds', type: 'trigger', tool: 'Stream Listener', prompt: 'Listen for new companies in target sectors.' },
                { id: 'n2', label: 'Apply Mandate Filters', type: 'process', tool: 'Filter Logic', prompt: 'Exclude companies outside EBITDA/Geo range.' },
                { id: 'n3', label: 'Enrich Data', type: 'action', tool: 'Clearbit API', prompt: 'Fetch missing firmographic details.' },
                { id: 'n4', label: 'Check Deduplication', type: 'decision', tool: 'DB Query', prompt: 'Check if company exists in `dim_companies`.' },
                { id: 'n5', label: 'Calculate Fit Score', type: 'process', tool: 'Scoring Model', prompt: 'Compute 0-100 score based on mandate alignment.' },
                { id: 'n6', label: 'Create Pipeline Entry', type: 'output', tool: 'CRM Connector', prompt: 'Insert new record into Pipeline Database.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' },
                { from: 'n4', to: 'n5', label: 'New Record' },
                { from: 'n5', to: 'n6' }
            ]
        }
    },
    {
        id: 'evaluation',
        name: 'Evaluation Agent',
        role: 'Initial Screening',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        summary: 'Performs initial financial and strategic analysis on potential deals.',
        description: 'Performs the first pass of financial and strategic analysis on potential deals to determine if they warrant deep diligence.',
        spec: {
            objective: 'Assess the financial health and strategic fit of a target company.',
            inputs: [
                { name: 'Target Profile', type: 'Object', desc: 'Enriched company data from Sourcing Agent.' },
                { name: 'Financials', type: 'CSV/JSON', desc: 'Historical P&L and Balance Sheet data.' }
            ],
            outputs: [
                { name: 'Investment Scorecard', type: 'PDF', desc: 'One-pager summarizing key metrics and risks.' },
                { name: 'Valuation Range', type: 'Object', desc: 'Preliminary EV/EBITDA and DCF estimates.' }
            ],
            interactions: [
                'Requests Comps Data from Data Science Agent.',
                'Updates Deal Status in DB Agent.'
            ]
        },
        tools: [
            { type: 'code', name: 'Financial Ratio Calculator', description: 'Computes margins, growth rates, and leverage ratios from raw financials.' },
            { type: 'datasource', name: 'Public Comps Database', description: 'Repository of public company trading multiples.' },
            { type: 'code', name: 'Sentiment Analyzer', description: 'NLP model to analyze news and social sentiment about the target.' }
        ],
        knowledge: ['Valuation Models', 'Competitor Landscape', 'Benchmarking Data'],
        goals: {
            mainGoal: "Assess financial viability and strategic fit",
            subGoals: [
                {
                    title: "Analyze Financials",
                    tasks: ["Calculate historical margins", "Assess revenue growth trends", "Check liquidity ratios"]
                },
                {
                    title: "Market Comparison",
                    tasks: ["Select comparable public peers", "Compare trading multiples", "Benchmark operational metrics"]
                },
                {
                    title: "Risk Assessment",
                    tasks: ["Analyze news sentiment", "Check for red flags", "Perform SWOT analysis"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Ingest Target Data', type: 'input', tool: 'Data Loader', prompt: 'Load financials and profile.' },
                { id: 'n2', label: 'Standardize Financials', type: 'process', tool: 'Normalizer', prompt: 'Map accounts to standard taxonomy.' },
                { id: 'n3', label: 'Select Peer Group', type: 'decision', tool: 'Comps Engine', prompt: 'Identify comparable public companies.' },
                { id: 'n4', label: 'Run LBO Model', type: 'process', tool: 'Excel Engine', prompt: 'Calculate IRR sensitivity.' },
                { id: 'n5', label: 'Analyze Sentiment', type: 'process', tool: 'NLP Model', prompt: 'Scan news for red flags.' },
                { id: 'n6', label: 'Generate Scorecard', type: 'output', tool: 'Report Gen', prompt: 'Compile findings into PDF summary.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n2', to: 'n4' },
                { from: 'n3', to: 'n4' },
                { from: 'n1', to: 'n5' },
                { from: 'n4', to: 'n6' },
                { from: 'n5', to: 'n6' }
            ]
        }
    },
    {
        id: 'diligence',
        name: 'Diligence Agent',
        role: 'Deep Dive Analysis',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        summary: 'Conducts forensic examination across legal, financial, and tech domains.',
        description: 'Conducts comprehensive due diligence across financial, legal, and technical domains to uncover risks.',
        spec: {
            objective: 'Validate assumptions and identify deal-breaking risks.',
            inputs: [
                { name: 'VDR Access', type: 'Auth', desc: 'Credentials for Virtual Data Room.' },
                { name: 'Diligence Request List', type: 'List', desc: 'Items required for review.' }
            ],
            outputs: [
                { name: 'Red Flag Report', type: 'JSON', desc: 'Critical issues categorized by severity.' },
                { name: 'IC Memo Draft', type: 'Doc', desc: 'Investment Committee memorandum.' }
            ],
            interactions: [
                'Collaborates with Legal/Tech specialized sub-agents (simulated).',
                'Logs findings to DB Agent.'
            ]
        },
        tools: [
            { type: 'datasource', name: 'VDR Connector', description: 'Secure API to crawl and index documents from Intralinks/Datasite.' },
            { type: 'code', name: 'Legal Doc Parser', description: 'Extracts clauses (change of control, indemnity) from contracts.' },
            { type: 'code', name: 'Tech Stack Scanner', description: 'Analyzes code repositories and architecture diagrams for debt/risk.' },
            { type: 'api', name: 'Background Check API', description: 'Verifies management backgrounds and litigation history.' }
        ],
        knowledge: ['Legal Risk Framework', 'Accounting Standards (GAAP)', 'Cybersecurity Best Practices'],
        goals: {
            mainGoal: "Conduct comprehensive due diligence to validate deal",
            subGoals: [
                {
                    title: "Legal Review",
                    tasks: ["Analyze material contracts", "Verify IP ownership", "Check litigation history"]
                },
                {
                    title: "Financial Audit",
                    tasks: ["Perform QofE analysis", "Review tax compliance", "Assess debt structure"]
                },
                {
                    title: "Tech Due Diligence",
                    tasks: ["Audit code repositories", "Scan for security vulnerabilities", "Assess infrastructure scalability"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Connect to VDR', type: 'input', tool: 'VDR Connector', prompt: 'Authenticate and index file structure.' },
                { id: 'n2', label: 'Classify Documents', type: 'process', tool: 'Classifier', prompt: 'Tag files as Legal, Financial, or Tech.' },
                { id: 'n3', label: 'Review Contracts', type: 'action', tool: 'Legal Parser', prompt: 'Extract non-compete and termination clauses.' },
                { id: 'n4', label: 'Analyze QofE', type: 'action', tool: 'Excel Parser', prompt: 'Verify EBITDA adjustments in Databook.' },
                { id: 'n5', label: 'Flag Risks', type: 'decision', tool: 'Risk Engine', prompt: 'Compare findings against risk thresholds.' },
                { id: 'n6', label: 'Draft IC Memo', type: 'output', tool: 'Writer', prompt: 'Synthesize all findings into final memo.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n2', to: 'n4' },
                { from: 'n3', to: 'n5' },
                { from: 'n4', to: 'n5' },
                { from: 'n5', to: 'n6' }
            ]
        }
    },
    {
        id: 'portfolio',
        name: 'Portfolio Agent',
        role: 'Value Creation',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
        summary: 'Monitors portfolio company performance and identifies value levers.',
        description: 'Continuous monitoring of portfolio company performance, automating reporting and identifying value creation levers.',
        spec: {
            objective: 'Maximize portfolio value through active monitoring and intervention.',
            inputs: [
                { name: 'ERP Data', type: 'Stream', desc: 'Monthly financials from portfolio companies.' },
                { name: 'Budget', type: 'JSON', desc: 'Approved annual operating plan.' }
            ],
            outputs: [
                { name: 'Monthly Perf Report', type: 'PDF', desc: 'Variance analysis and KPI dashboard.' },
                { name: 'Intervention Alert', type: 'Notification', desc: 'Warning for missed targets.' }
            ],
            interactions: [
                'Pulls data via Ingestion Agent.',
                'Triggers Reporting Agent for LP updates.'
            ]
        },
        tools: [
            { type: 'datasource', name: 'ERP Connector', description: 'Direct hooks into Netsuite, SAP, and QuickBooks.' },
            { type: 'api', name: 'Market Data API', description: 'Benchmarks performance against broader market indices.' },
            { type: 'code', name: 'KPI Dashboard Generator', description: 'Renders interactive visualization of key metrics.' }
        ],
        knowledge: ['Operational Benchmarks', '100-Day Plans', 'Turnaround Strategies'],
        goals: {
            mainGoal: "Maximize portfolio value and operational efficiency",
            subGoals: [
                {
                    title: "Performance Monitoring",
                    tasks: ["Track monthly KPIs", "Analyze budget variance", "Generate board reports"]
                },
                {
                    title: "Value Creation",
                    tasks: ["Identify synergy opportunities", "Recommend cost optimization", "Drive revenue growth initiatives"]
                },
                {
                    title: "Risk Management",
                    tasks: ["Forecast liquidity needs", "Monitor covenant compliance", "Assess market risk exposure"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Fetch ERP Data', type: 'input', tool: 'ERP Connector', prompt: 'Pull GL data for current month.' },
                { id: 'n2', label: 'Normalize Data', type: 'process', tool: 'Data Mapper', prompt: 'Map chart of accounts to standard reporting format.' },
                { id: 'n3', label: 'Calculate KPIs', type: 'process', tool: 'Calc Engine', prompt: 'Compute EBITDA, Churn, CAC, LTV.' },
                { id: 'n4', label: 'Compare vs Budget', type: 'decision', tool: 'Variance Logic', prompt: 'Check if variance > 10%.' },
                { id: 'n5', label: 'Generate Alert', type: 'action', tool: 'Notifier', prompt: 'Send Slack alert to Deal Team.' },
                { id: 'n6', label: 'Suggest Action', type: 'output', tool: 'Advisor', prompt: 'Recommend cost cutting or pricing changes.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' },
                { from: 'n4', to: 'n5', label: 'High Variance' },
                { from: 'n4', to: 'n6' }
            ]
        }
    },
    {
        id: 'reporting',
        name: 'Reporting Agent',
        role: 'Stakeholder Comms',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        summary: 'Automates generation of LP reports and performance updates.',
        description: 'Automates the generation of LP reports and internal performance updates.',
        spec: {
            objective: 'Create accurate and timely reports for stakeholders.',
            inputs: [
                { name: 'Performance Data', type: 'JSON', desc: 'Aggregated metrics from Portfolio Agent.' },
                { name: 'Market Commentary', type: 'Text', desc: 'Macro analysis from Data Science Agent.' }
            ],
            outputs: [
                { name: 'LP Quarterly Report', type: 'PDF', desc: 'Formatted report with charts and narrative.' },
                { name: 'Investor Update Email', type: 'HTML', desc: 'Draft email for distribution.' }
            ],
            interactions: [
                'Queries DB Agent for historical data.',
                'Requests charts from Visualization Agent.'
            ]
        },
        tools: [
            { type: 'code', name: 'PDF Generator', description: 'Generates pixel-perfect PDFs from HTML templates.' },
            { type: 'code', name: 'Natural Language Generator', description: 'Drafts executive summaries based on data trends.' },
            { type: 'datasource', name: 'Fund Admin System', description: 'Connects to eFront/Allvue for capital account data.' }
        ],
        knowledge: ['LP Reporting Standards (ILPA)', 'Fund Performance History', 'Investor Relations Best Practices'],
        goals: {
            mainGoal: "Deliver accurate and timely stakeholder reporting",
            subGoals: [
                {
                    title: "Data Aggregation",
                    tasks: ["Collect performance metrics", "Validate data integrity", "Consolidate multiple sources"]
                },
                {
                    title: "Report Generation",
                    tasks: ["Draft executive narrative", "Generate performance charts", "Format final PDF"]
                },
                {
                    title: "Distribution",
                    tasks: ["Email reports to LPs", "Upload to investor portal", "Archive for compliance"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Aggregate Data', type: 'input', tool: 'Data Aggregator', prompt: 'Collect performance metrics for Q3.' },
                { id: 'n2', label: 'Draft Narrative', type: 'process', tool: 'NLG Engine', prompt: 'Write executive summary highlighting 15% growth.' },
                { id: 'n3', label: 'Generate Charts', type: 'action', tool: 'Viz Agent', prompt: 'Request waterfall chart for fund return.' },
                { id: 'n4', label: 'Format Layout', type: 'process', tool: 'PDF Engine', prompt: 'Apply firm branding and layout.' },
                { id: 'n5', label: 'Distribute Report', type: 'output', tool: 'Emailer', prompt: 'Send draft to IR team for review.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n1', to: 'n3' },
                { from: 'n2', to: 'n4' },
                { from: 'n3', to: 'n4' },
                { from: 'n4', to: 'n5' }
            ]
        }
    },
    {
        id: 'visualization',
        name: 'Visualization Agent',
        role: 'Data Storytelling',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',
        summary: 'Creates dynamic charts and graphs to visualize complex data sets.',
        description: 'Specialized agent for rendering data into compelling visual formats.',
        spec: {
            objective: 'Transform raw data into intuitive visual representations.',
            inputs: [
                { name: 'Raw Data Set', type: 'JSON', desc: 'Array of data points to visualize.' },
                { name: 'Chart Type', type: 'String', desc: 'Requested format (Bar, Line, Scatter).' }
            ],
            outputs: [
                { name: 'Chart Image', type: 'SVG/PNG', desc: 'Rendered visualization.' },
                { name: 'Interactive Dashboard', type: 'HTML', desc: 'Embeddable widget.' }
            ],
            interactions: [
                'Receives requests from Reporting/Portfolio Agents.',
                'Queries DB Agent for large datasets.'
            ]
        },
        tools: [
            { type: 'code', name: 'Chart.js Wrapper', description: 'Standard charting library for common visualizations.' },
            { type: 'code', name: 'D3.js Renderer', description: 'Advanced custom visualizations and force-directed graphs.' },
            { type: 'code', name: 'Dashboard Layout Engine', description: 'Grid system for arranging multiple widgets.' }
        ],
        knowledge: ['Data Viz Best Practices', 'Color Theory', 'Accessibility Standards'],
        goals: {
            mainGoal: "Transform complex data into actionable visual insights",
            subGoals: [
                {
                    title: "Data Preparation",
                    tasks: ["Clean and normalize data", "Format for charting", "Aggregate time series"]
                },
                {
                    title: "Chart Rendering",
                    tasks: ["Select appropriate chart type", "Apply visual styling", "Render SVG elements"]
                },
                {
                    title: "Dashboarding",
                    tasks: ["Layout widgets", "Add interactivity", "Publish dashboard"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Receive Data', type: 'input', tool: 'Input Handler', prompt: 'Validate data structure and types.' },
                { id: 'n2', label: 'Select Chart Type', type: 'decision', tool: 'Viz Recommender', prompt: 'Determine best chart for time-series data.' },
                { id: 'n3', label: 'Prepare Data', type: 'process', tool: 'Data Transformer', prompt: 'Format dates and normalize values.' },
                { id: 'n4', label: 'Render Visuals', type: 'action', tool: 'D3 Engine', prompt: 'Draw SVG paths and axes.' },
                { id: 'n5', label: 'Embed in UI', type: 'output', tool: 'Export Handler', prompt: 'Return HTML snippet.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' },
                { from: 'n4', to: 'n5' }
            ]
        }
    },
    {
        id: 'ingestion',
        name: 'Ingestion Agent',
        role: 'Data Onboarding',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        summary: 'Handles intake and normalization of raw data from various sources.',
        description: 'Handles the intake and normalization of raw data from various sources.',
        spec: {
            objective: 'Ingest data from external sources into the staging environment.',
            inputs: [
                { name: 'File/Stream', type: 'Binary', desc: 'Raw file (PDF, Excel) or API stream.' },
                { name: 'Source Config', type: 'JSON', desc: 'Credentials and protocol details.' }
            ],
            outputs: [
                { name: 'Staged Data', type: 'JSON', desc: 'Raw data stored in staging area.' },
                { name: 'Ingestion Log', type: 'Text', desc: 'Record of success/failure.' }
            ],
            interactions: [
                'Writes raw data to DB Agent (Staging).',
                'Triggers Refinery Agent for cleaning.'
            ]
        },
        tools: [
            { type: 'code', name: 'File Parser', description: 'Extracts text and tables from PDF, Excel, and CSV files.' },
            { type: 'api', name: 'Universal API Connector', description: 'Connects to REST/GraphQL endpoints with auth handling.' },
            { type: 'code', name: 'Stream Processor', description: 'Handles high-throughput real-time data streams.' }
        ],
        knowledge: ['Data Formats (JSON, XML, Parquet)', 'ETL Pipelines', 'Rate Limiting Strategies'],
        goals: {
            mainGoal: "Reliably ingest data from diverse sources",
            subGoals: [
                {
                    title: "Source Monitoring",
                    tasks: ["Watch S3 buckets", "Poll API endpoints", "Listen to webhooks"]
                },
                {
                    title: "Data Extraction",
                    tasks: ["Parse PDF documents", "Read CSV files", "Decode JSON streams"]
                },
                {
                    title: "Staging",
                    tasks: ["Validate basic schema", "Load to staging DB", "Log ingestion status"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Detect Source', type: 'trigger', tool: 'Source Watcher', prompt: 'Identify new file in S3 bucket.' },
                { id: 'n2', label: 'Extract Raw Data', type: 'process', tool: 'Parser', prompt: 'Read binary content and convert to text.' },
                { id: 'n3', label: 'Normalize Format', type: 'process', tool: 'Schema Mapper', prompt: 'Convert to standard JSON structure.' },
                { id: 'n4', label: 'Load to Staging', type: 'output', tool: 'DB Writer', prompt: 'Insert into `staging_raw` table.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' }
            ]
        }
    },
    {
        id: 'refinery',
        name: 'Refinery Agent',
        role: 'Data Cleaning',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        summary: 'Cleans, enriches, and structures data for downstream consumption.',
        description: 'Cleans, enriches, and structures data for downstream consumption.',
        spec: {
            objective: 'Transform raw staging data into high-quality, trusted assets.',
            inputs: [
                { name: 'Staged Data', type: 'JSON', desc: 'Raw data from Ingestion Agent.' },
                { name: 'Quality Rules', type: 'JSON', desc: 'Validation logic (e.g., email format).' }
            ],
            outputs: [
                { name: 'Clean Data', type: 'JSON', desc: 'Validated records ready for warehouse.' },
                { name: 'DQ Report', type: 'HTML', desc: 'Summary of cleaning actions.' }
            ],
            interactions: [
                'Reads from DB Agent (Staging).',
                'Writes to DB Agent (Production).'
            ]
        },
        tools: [
            { type: 'code', name: 'Entity Resolver', description: 'Identifies and merges duplicate records (e.g., "Acme Inc" vs "Acme Corp").' },
            { type: 'code', name: 'Data Validator', description: 'Checks data against type and constraint rules.' },
            { type: 'api', name: 'Enrichment Services', description: 'Calls external APIs to fill missing fields.' }
        ],
        knowledge: ['Data Quality Rules', 'Master Data Management', 'Regex Patterns'],
        goals: {
            mainGoal: "Ensure data quality and consistency",
            subGoals: [
                {
                    title: "Cleaning",
                    tasks: ["Remove duplicate records", "Fix formatting errors", "Handle null values"]
                },
                {
                    title: "Enrichment",
                    tasks: ["Add missing metadata", "Link related entities", "Calculate derived fields"]
                },
                {
                    title: "Mastering",
                    tasks: ["Create golden records", "Resolve identity conflicts", "Publish to core warehouse"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Read Staging Data', type: 'input', tool: 'DB Reader', prompt: 'Fetch unproccessed rows.' },
                { id: 'n2', label: 'Apply Cleaning Rules', type: 'process', tool: 'Rule Engine', prompt: 'Fix phone number formatting.' },
                { id: 'n3', label: 'Enrich Records', type: 'process', tool: 'Enricher', prompt: 'Add geolocation data.' },
                { id: 'n4', label: 'Write to Warehouse', type: 'output', tool: 'DB Writer', prompt: 'Commit to `production_core`.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' }
            ]
        }
    },
    {
        id: 'db',
        name: 'DB Agent',
        role: 'Storage Manager',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
        summary: 'Manages database schemas, storage optimization, and query performance.',
        description: 'Autonomous Database Administrator that manages schema evolution, query optimization, and data integrity.',
        spec: {
            objective: 'Ensure data availability, integrity, and performance.',
            inputs: [
                { name: 'Schema Change Request', type: 'Event', desc: 'Request to add fields or tables.' },
                { name: 'Query Log', type: 'Stream', desc: 'Real-time execution stats.' }
            ],
            outputs: [
                { name: 'Schema Migration', type: 'Action', desc: 'DDL execution on the warehouse.' },
                { name: 'Performance Report', type: 'JSON', desc: 'Index usage and slow query analysis.' }
            ],
            interactions: [
                'Receives data from Ingestion/Refinery Agents.',
                'Serves data to Sourcing/Evaluation Agents.'
            ]
        },
        tools: [
            { type: 'code', name: 'Schema Migrator', description: 'Safely applies DDL changes (ALTER/CREATE) without downtime.' },
            { type: 'code', name: 'Query Optimizer', description: 'Analyzes execution plans and suggests indexes.' },
            { type: 'code', name: 'Backup Manager', description: 'Orchestrates point-in-time recovery snapshots.' }
        ],
        knowledge: ['SQL Standards', 'Database Architecture', 'Data Modeling Patterns'],
        goals: {
            mainGoal: "Maintain high-performance and secure data infrastructure",
            subGoals: [
                {
                    title: "Schema Management",
                    tasks: ["Apply schema migrations", "Validate constraints", "Document data model"]
                },
                {
                    title: "Performance Tuning",
                    tasks: ["Analyze slow queries", "Add necessary indexes", "Optimize configuration"]
                },
                {
                    title: "Maintenance",
                    tasks: ["Perform backups", "Vacuum tables", "Monitor system health"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Monitor Workload', type: 'trigger', tool: 'Metrics Collector', prompt: 'Track CPU, IOPS, and Query Latency.' },
                { id: 'n2', label: 'Detect Slow Queries', type: 'decision', tool: 'Log Analyzer', prompt: 'Identify queries taking > 200ms.' },
                { id: 'n3', label: 'Analyze Execution Plan', type: 'process', tool: 'Explain Analyzer', prompt: 'Check for full table scans.' },
                { id: 'n4', label: 'Recommend Index', type: 'action', tool: 'Index Advisor', prompt: 'Suggest CREATE INDEX on filtered columns.' },
                { id: 'n5', label: 'Apply Schema Change', type: 'action', tool: 'Migrator', prompt: 'Execute ALTER TABLE to add new columns.' },
                { id: 'n6', label: 'Update Catalog', type: 'output', tool: 'Catalog Manager', prompt: 'Refresh metadata for other agents.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3', label: 'Slow Query Found' },
                { from: 'n3', to: 'n4' },
                { from: 'n5', to: 'n6' }
            ]
        }
    },
    {
        id: 'datascience',
        name: 'Data Science Agent',
        role: 'Advanced Analytics',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
        summary: 'Builds and runs machine learning models for predictive insights.',
        description: 'Builds and runs machine learning models for predictive insights.',
        spec: {
            objective: 'Derive predictive insights and train models on warehouse data.',
            inputs: [
                { name: 'Training Data', type: 'Dataset', desc: 'Historical data from DB Agent.' },
                { name: 'Model Config', type: 'JSON', desc: 'Hyperparameters and algorithm selection.' }
            ],
            outputs: [
                { name: 'Trained Model', type: 'Binary', desc: 'Serialized model file.' },
                { name: 'Inference Result', type: 'JSON', desc: 'Predictions for new data.' }
            ],
            interactions: [
                'Queries DB Agent for training sets.',
                'Provides predictions to Evaluation Agent.'
            ]
        },
        tools: [
            { type: 'code', name: 'Python Runtime', description: 'Executes Pandas/Scikit-learn scripts.' },
            { type: 'code', name: 'Model Trainer', description: 'Manages training loops and validation.' },
            { type: 'code', name: 'Feature Engineer', description: 'Transforms raw data into model features.' }
        ],
        knowledge: ['Statistical Methods', 'ML Algorithms', 'Feature Engineering'],
        goals: {
            mainGoal: "Drive decision-making with predictive analytics",
            subGoals: [
                {
                    title: "Model Training",
                    tasks: ["Select features", "Train algorithms", "Tune hyperparameters"]
                },
                {
                    title: "Evaluation",
                    tasks: ["Test model accuracy", "Validate robustness", "Compare candidate models"]
                },
                {
                    title: "Deployment",
                    tasks: ["Serve model as API", "Monitor concept drift", "Retrain as needed"]
                }
            ]
        },
        workflow: {
            nodes: [
                { id: 'n1', label: 'Fetch Training Data', type: 'input', tool: 'DB Connector', prompt: 'Select * from training_set.' },
                { id: 'n2', label: 'Train Model', type: 'process', tool: 'Trainer', prompt: 'Fit Random Forest Classifier.' },
                { id: 'n3', label: 'Validate Results', type: 'process', tool: 'Validator', prompt: 'Calculate F1 Score and Accuracy.' },
                { id: 'n4', label: 'Deploy Inference', type: 'output', tool: 'Deployer', prompt: 'Expose model as API endpoint.' }
            ],
            edges: [
                { from: 'n1', to: 'n2' },
                { from: 'n2', to: 'n3' },
                { from: 'n3', to: 'n4' }
            ]
        }
    }
];
