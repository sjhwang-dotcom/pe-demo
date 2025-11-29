window.evalData = [
    {
        id: 'sunstate',
        name: 'SunState HVAC',
        status: 'Active',
        tags: ['HVAC', 'Residential', 'Auction'],
        metrics: {
            ltmEbitda: '$8.2M',
            entryMultiple: '9.8x',
            leverage: '5.5x',
            revenueGrowth: '12%'
        },
        comps: [
            { name: 'SunState (Target)', evEbitda: '9.8x', evSales: '2.1x', margin: '24.0%' },
            { name: 'Peer Average', evEbitda: '11.2x', evSales: '2.4x', margin: '21.5%' }
        ],
        scatterPeers: [
            { name: 'Watsco', x: 8.5, y: 14.2, r: 12 },
            { name: 'Lennox', x: 6.0, y: 12.5, r: 14 },
            { name: 'Carrier', x: 5.5, y: 11.8, r: 18 },
            { name: 'Trane', x: 7.2, y: 13.5, r: 16 },
            { name: 'Comfort Sys', x: 14.0, y: 15.0, r: 10 }
        ],
        sensitivity: {
            x: ['8.0x', '9.0x', '10.0x', '11.0x', '12.0x'],
            y: ['2.0%', '4.0%', '6.0%', '8.0%', '10.0%'],
            values: [
                [15.2, 16.5, 17.8, 19.1, 20.4],
                [17.5, 18.9, 20.3, 21.7, 23.1],
                [19.8, 21.2, 22.7, 24.2, 25.7],
                [22.1, 23.6, 25.1, 26.7, 28.3],
                [24.5, 26.0, 27.6, 29.2, 30.9]
            ]
        },
        waterfall: [
            { label: 'Base Case', value: 100, type: 'base' },
            { label: 'Rev Synergies', value: 15, type: 'add' },
            { label: 'Cost Opt', value: 10, type: 'add' },
            { label: 'Work Cap', value: -5, type: 'sub' },
            { label: 'Mult Exp', value: 12, type: 'add' },
            { label: 'AI Upside', value: 20, type: 'add' }
        ],
        team: [
            { name: 'Sarah Chen', role: 'VP', initials: 'SC', color: 'bg-purple-100 text-purple-700' },
            { name: 'Mike Ross', role: 'Associate', initials: 'MR', color: 'bg-blue-100 text-blue-700' }
        ],
        conviction: {
            score: 80,
            flags: [
                { text: 'Customer concentration risk', type: 'warning' },
                { text: 'Labor shortage in region', type: 'warning' }
            ]
        },
        copilotContext: {
            intro: "Focusing on HVAC roll-up strategy. Key value driver is EBITDA margin expansion via route density optimization.",
            scenarios: [
                {
                    trigger: "margin",
                    response: "I've modeled a 200bps margin expansion based on route optimization synergies. Here is the Python logic used for the adjustment:",
                    code: `
# Margin Expansion Scenario
current_margin = 0.24
synergy_impact = 0.02 # 200 bps

# Adjusted EBITDA
projected_revenue = 45000000
adjusted_ebitda = projected_revenue * (current_margin + synergy_impact)

print(f"New EBITDA: \${adjusted_ebitda:,.0f}")
# Output: New EBITDA: $11,700,000`
                }
            ]
        }
    },
    {
        id: 'apex',
        name: 'Apex Climate',
        status: 'Active',
        tags: ['Commercial', 'Services', 'Proprietary'],
        metrics: {
            ltmEbitda: '$6.5M',
            entryMultiple: '8.5x',
            leverage: '4.0x',
            revenueGrowth: '8%'
        },
        comps: [
            { name: 'Apex (Target)', evEbitda: '8.5x', evSales: '1.8x', margin: '18.0%' },
            { name: 'Peer Average', evEbitda: '10.0x', evSales: '2.0x', margin: '16.5%' }
        ],
        scatterPeers: [
            { name: 'JCI', x: 4.5, y: 9.5, r: 20 },
            { name: 'Emerson', x: 5.0, y: 10.8, r: 18 },
            { name: 'Honeywell', x: 3.5, y: 11.5, r: 22 },
            { name: 'Siemens', x: 4.0, y: 10.0, r: 25 },
            { name: 'Schneider', x: 6.5, y: 12.0, r: 19 }
        ],
        sensitivity: {
            x: ['7.0x', '8.0x', '9.0x', '10.0x', '11.0x'],
            y: ['2.0%', '4.0%', '6.0%', '8.0%', '10.0%'],
            values: [
                [14.0, 15.5, 17.0, 18.5, 20.0],
                [16.0, 17.5, 19.0, 20.5, 22.0],
                [18.0, 19.5, 21.0, 22.5, 24.0],
                [20.0, 21.5, 23.0, 24.5, 26.0],
                [22.0, 23.5, 25.0, 26.5, 28.0]
            ]
        },
        waterfall: [
            { label: 'Base Case', value: 80, type: 'base' },
            { label: 'M&A', value: 25, type: 'add' },
            { label: 'Margin Exp', value: 10, type: 'add' },
            { label: 'Multiple', value: 5, type: 'add' }
        ],
        team: [
            { name: 'David Kim', role: 'Principal', initials: 'DK', color: 'bg-indigo-100 text-indigo-700' },
            { name: 'Lisa Ray', role: 'VP', initials: 'LR', color: 'bg-pink-100 text-pink-700' }
        ],
        conviction: {
            score: 75,
            flags: [
                { text: 'Integration risk', type: 'warning' },
                { text: 'Regulatory changes', type: 'warning' }
            ]
        },
        copilotContext: {
            intro: "Analyzing commercial climate control services. Primary risk is regulatory changes in refrigerant standards.",
            scenarios: [
                {
                    trigger: "risk",
                    response: "Simulating impact of new refrigerant regulations (EPA HFC phase-down). Assuming 5% increase in COGS.",
                    code: `
# Regulatory Risk Simulation
cogs_base = 15000000
regulatory_impact = 1.05

adjusted_cogs = cogs_base * regulatory_impact
margin_impact_bps = -150

print(f"Adjusted COGS: \${adjusted_cogs:,.0f}")
print(f"Margin Impact: {margin_impact_bps} bps")`
                }
            ]
        }
    },
    {
        id: 'nexus',
        name: 'Nexus AI',
        status: 'New',
        tags: ['SaaS', 'Enterprise', 'AI/ML'],
        metrics: {
            ltmEbitda: '-$2.5M',
            entryMultiple: '12.0x', // Revenue Multiple for SaaS
            leverage: '1.5x',
            revenueGrowth: '45%'
        },
        comps: [
            { name: 'Nexus (Target)', evEbitda: 'NM', evSales: '12.0x', margin: '-15.0%' },
            { name: 'Peer Average', evEbitda: '35.0x', evSales: '14.5x', margin: '5.0%' }
        ],
        scatterPeers: [
            { name: 'Datadog', x: 25.0, y: 18.0, r: 15 },
            { name: 'Snowflake', x: 35.0, y: 22.0, r: 18 },
            { name: 'MongoDB', x: 28.0, y: 16.5, r: 12 },
            { name: 'Palantir', x: 20.0, y: 15.0, r: 20 },
            { name: 'C3.ai', x: 15.0, y: 8.0, r: 10 }
        ],
        sensitivity: {
            x: ['10.0x', '12.0x', '14.0x', '16.0x', '18.0x'], // Rev Multiple
            y: ['30%', '40%', '50%', '60%', '70%'], // Growth
            values: [
                [25.0, 30.5, 36.0, 41.5, 47.0],
                [28.0, 34.0, 40.0, 46.0, 52.0],
                [31.0, 37.5, 44.0, 50.5, 57.0],
                [34.0, 41.0, 48.0, 55.0, 62.0],
                [37.0, 44.5, 52.0, 59.5, 67.0]
            ]
        },
        waterfall: [
            { label: 'Base Case', value: 150, type: 'base' },
            { label: 'New Logos', value: 40, type: 'add' },
            { label: 'Net Retention', value: 30, type: 'add' },
            { label: 'R&D Eff', value: 10, type: 'add' },
            { label: 'Mult Exp', value: 20, type: 'add' }
        ],
        team: [
            { name: 'Alex Wong', role: 'MD', initials: 'AW', color: 'bg-orange-100 text-orange-700' },
            { name: 'Jessica Lee', role: 'Associate', initials: 'JL', color: 'bg-teal-100 text-teal-700' }
        ],
        conviction: {
            score: 92,
            flags: [
                { text: 'High valuation sensitivity', type: 'warning' },
                { text: 'Technical talent retention', type: 'warning' }
            ]
        },
        copilotContext: {
            intro: "Evaluating high-growth AI infrastructure play. Key metric is ARR growth and Net Dollar Retention (NDR).",
            scenarios: [
                {
                    trigger: "retention",
                    response: "Modeling impact of 120% Net Dollar Retention (NDR) on terminal value. Using the 'Rule of 40' framework.",
                    code: `
# SaaS Valuation Model (Rule of 40)
arr_current = 25000000
growth_rate = 0.45
fcf_margin = -0.10

rule_of_40_score = (growth_rate * 100) + (fcf_margin * 100)
# Score: 35 (Below 40 target)

# Sensitivity: If NDR increases to 120%
growth_adjusted = 0.55
new_score = 45 # Premium Valuation Unlocked

print(f"Rule of 40 Score: {new_score}")
print("Valuation Premium: +2.0x Rev Multiple")`
                }
            ]
        }
    }
];
