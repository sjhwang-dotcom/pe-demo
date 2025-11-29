window.diligenceData = {
    "target": "HCA Healthcare (Proxy)",
    "status": "Confirmatory (Week 4)",
    "vdrFiles": "1,840 Files",
    "redFlags": "4 Critical",
    "overview": {
        "description": "HCA Healthcare is a leading provider of healthcare services, operating a network of 182 locally managed hospitals and approximately 2,300 sites of care, including surgery centers, freestanding ERs, urgent care centers, and physician clinics, in 20 states and the United Kingdom.",
        "dealSize": "$32.5B Enterprise Value",
        "industry": "Healthcare Services",
        "headquarters": "Nashville, TN"
    },
    "thesis": [
        "**Market Leadership & Scale**: HCA is the largest non-governmental hospital operator in the U.S., providing significant economies of scale in procurement, payer contracting, and physician recruitment.",
        "**Operational Excellence**: Proven track record of margin expansion through the deployment of technology-driven efficiency initiatives and clinical best practices across its vast network.",
        "**Resilient Financial Profile**: Consistent revenue growth and strong free cash flow generation allow for continuous reinvestment in facilities and shareholder returns, even during economic downturns.",
        "**Valuation Opportunity**: Current trading multiple of 7.5x EV/EBITDA represents a discount to the 5-year historical average of 9.0x, offering an attractive entry point for a high-quality asset."
    ],
    "risks": [
        {
            "area": "Financial",
            "finding": "Seller includes $2.5M of 'Procurement Savings' in Adjusted EBITDA based on unverified vendor quotes. Our analysis suggests only $1.0M is achievable in Year 1.",
            "impact": "High (EBITDA Risk)",
            "mitigant": "We have adjusted our base case model to exclude 60% of these synergies. We will require binding vendor quotes prior to signing to validate any add-backs."
        },
        {
            "area": "Financial",
            "finding": "Top 3 customers account for 45% of revenue. The largest customer (22% of Rev) has a contract expiring in 6 months and has issued an RFP.",
            "impact": "Critical (Revenue Risk)",
            "mitigant": "We are conducting deep customer diligence calls. The deal will be contingent on the renewal of this key contract or a structure that de-risks the potential loss (e.g., earn-out)."
        },
        {
            "area": "Accounting",
            "finding": "Inconsistent application of ASC 606 (Revenue Recognition) was identified across three recently acquired subsidiaries. Specifically, the timing of revenue recognition for certain bundled service contracts varies, leading to a potential overstatement of FY2024 revenue by approximately $1.2M.",
            "impact": "Medium ($1.2M EBITDA Impact)",
            "mitigant": "Management has agreed to a post-close financial integration plan to standardize revenue recognition policies across all entities. A specific indemnity will be included in the SPA to cover any potential restatements or penalties."
        },
        {
            "area": "Accounting",
            "finding": "The reserve for obsolete inventory (primarily surgical supplies and pharmaceuticals) appears understated by approximately $500k based on our independent aging analysis. Several high-value SKUs have not moved in over 12 months but remain at full carrying value.",
            "impact": "Low ($0.5M One-time Hit)",
            "mitigant": "We have negotiated a Purchase Price Adjustment mechanism in the SPA. The final working capital target will be adjusted to reflect the true realizable value of inventory, protecting us from this exposure."
        },
        {
            "area": "Regulatory",
            "finding": "There is a heightened risk of changes in Medicare/Medicaid reimbursement rates due to ongoing federal budget negotiations. A 1% reduction in reimbursement rates could impact EBITDA by approximately $50M given the company's payer mix.",
            "impact": "High (Systemic Risk)",
            "mitigant": "The company has a diversified payer mix (only 35% government pay) and a strong government relations team that actively engages with policymakers. Additionally, operational efficiency programs are in place to offset potential rate pressures."
        },
        {
            "area": "Labor",
            "finding": "The company faces rising nursing costs and increased unionization activity in key markets (California, Florida). Contract labor costs have increased by 15% YoY, compressing margins in the acute care segment.",
            "impact": "Medium (Margin Compression)",
            "mitigant": "HCA has invested heavily in its own nursing schools (Galen College of Nursing) to create a proprietary talent pipeline. They are also implementing long-term staffing contracts to reduce reliance on expensive travel nurses."
        },
        {
            "area": "Legal",
            "finding": "There is ongoing litigation regarding physician staffing contracts in the Texas market. Plaintiffs allege breach of non-compete clauses. While currently in discovery, an adverse ruling could result in damages up to $15M.",
            "impact": "Medium ($15M Exposure)",
            "mitigant": "Legal counsel has reviewed the case and established a reserve of $5M. Outside counsel estimates the probability of a full $15M loss at less than 20%. The SPA will include a special indemnity for this specific litigation."
        },
        {
            "area": "Tech",
            "finding": "The core patient billing system is running on legacy mainframe infrastructure that is approaching end-of-life. It lacks modern API connectivity, hindering integration with new digital health tools.",
            "impact": "High ($25M Capex Required)",
            "mitigant": "A detailed IT modernization roadmap has been developed. We have allocated a $25M Capex budget in the Year 1 value creation plan to migrate to a cloud-based ERP system, which will also drive long-term cost savings."
        }
    ],
    "financials": {
        "revenue": ["$50,234M", "$55,500M", "$60,200M (Proj)"],
        "ebitda": ["$10,500M", "$11,800M", "$12,900M (Proj)"],
        "margin": ["20.9%", "21.2%", "21.4%"]
    },
    "vdrIndex": {
        "financial": [
            { "name": "FY23_QofE_Final_Report_v2.xlsx", "tag": "New", "tagColor": "text-accentTeal" },
            { "name": "Customer_Churn_Analysis_By_Region.csv", "tag": "Critical", "tagColor": "text-accentRed" },
            { "name": "Unit_Economics_By_Facility_Type.pdf", "tag": "", "tagColor": "" },
            { "name": "Working_Capital_Peg_Calculation.xlsx", "tag": "Updated", "tagColor": "text-accentBlue" }
        ],
        "legal": [
            { "name": "Disclosure_Schedules_v4_Clean.docx", "tag": "Review", "tagColor": "text-accentGold" },
            { "name": "Litigation_Summary_Q3_2025.pdf", "tag": "", "tagColor": "" },
            { "name": "Material_Contracts_Log_Consolidated.xlsx", "tag": "", "tagColor": "" }
        ],
        "tech": [
            { "name": "OpenSource_Security_Scan_Results.json", "tag": "Flagged", "tagColor": "text-accentRed" },
            { "name": "AWS_Cost_Optimization_Plan_Phase1.pptx", "tag": "", "tagColor": "" },
            { "name": "IT_Org_Chart_Current_State.pdf", "tag": "", "tagColor": "" }
        ],
        "hr": [
            { "name": "Executive_Comp_Study_2025.pdf", "tag": "New", "tagColor": "text-accentTeal" },
            { "name": "Employee_Census_Anonymized_Q3.xlsx", "tag": "", "tagColor": "" }
        ]
    }
}