export const GAMING_SURVEY_DATA = {
    questions: [
        {
            id: 1,
            question: "Which gaming monitor feature matters most to you?",
            consensus: "MODERATE CONSENSUS",
            consensus_color: "text-amber-500",
            total_responses: 1000,
            distribution: [
                { label: "High refresh rate (144Hz+)", count: 412, color: "#10b981" }, // emerald-500
                { label: "Low response time (<1ms)", count: 278, color: "#f59e0b" },   // amber-500
                { label: "Resolution (4K)", count: 198, color: "#3b82f6" },            // blue-500
                { label: "Color accuracy", count: 112, color: "#ec4899" }              // pink-500
            ],
            why_they_chose_this: "Respondents prioritizing high refresh rate consistently cited competitive gaming as their primary motivation—phrases like 'seeing enemies first,' 'smoother tracking,' and 'competitive edge in Valorant/CS2' appeared frequently. Many noted that 'frame rate matters more than pixels in fast-paced games.' Those choosing low response time expressed similar competitive motivations but emphasized input lag reduction specifically. The resolution camp leaned toward single-player and immersive experiences, with several noting dual-use for content consumption. Color accuracy voters were predominantly those who mentioned content creation alongside gaming.",
            reasoning_themes: [
                { name: "Competitive advantage", percentage: 52, description: "Desire to gain measurable advantage in multiplayer games" },
                { name: "Immersive experience", percentage: 24, description: "Prioritizing visual fidelity for single-player games" },
                { name: "Multi-purpose setup", percentage: 18, description: "Monitor serves gaming plus work/content creation" },
                { name: "Budget optimization", percentage: 6, description: "Best perceived value per rupee" }
            ],
            minority_perspectives: [
                { name: "Color accuracy", percentage: 11.2, description: "Multi-purpose workstation users. Gaming is important but not the sole use case." }
            ]
        },
        {
            id: 2,
            question: "What is your preferred keyboard type for gaming?",
            consensus: "DIVIDED",
            consensus_color: "text-orange-500",
            total_responses: 1000,
            distribution: [
                { label: "Mechanical (linear)", count: 356, color: "#10b981" },
                { label: "Mechanical (tactile)", count: 298, color: "#f59e0b" },
                { label: "Optical", count: 201, color: "#3b82f6" },
                { label: "Membrane", count: 145, color: "#ec4899" }
            ],
            why_they_chose_this: "The linear vs tactile split reflects a fundamental divide in keystroke feedback preferences. Linear switch advocates emphasized speed and consistency—'no bump means faster double-taps.' Tactile fans countered that feedback helps confirm keypresses without bottoming out. Optical choosers cited durability and faster actuation. The membrane minority wasn't apologetic—they questioned whether expensive keyboards deliver proportional value.",
            reasoning_themes: [
                { name: "Speed optimization", percentage: 38, description: "Choosing fastest possible actuation" },
                { name: "Tactile feedback", percentage: 28, description: "Wanting physical confirmation of keypresses" },
                { name: "Durability focus", percentage: 16, description: "Prioritizing lifespan and reliability" },
                { name: "Value consciousness", percentage: 14, description: "Questioning premium keyboard value" }
            ],
            minority_perspectives: [
                { name: "Membrane", percentage: 14.5, description: "Rejected 'mechanical premium' as unnecessary. Budget reallocation to other components was a consistent theme." }
            ]
        },
        {
            id: 3,
            question: "What is your top priority when choosing a gaming mouse?",
            consensus: "DIVIDED",
            consensus_color: "text-orange-500",
            total_responses: 1000,
            distribution: [
                { label: "Low weight (<70g)", count: 334, color: "#10b981" },
                { label: "Ergonomic comfort", count: 287, color: "#f59e0b" },
                { label: "Wireless freedom", count: 221, color: "#3b82f6" },
                { label: "Extra buttons", count: 158, color: "#ec4899" }
            ],
            why_they_chose_this: "Low weight preference correlates with FPS players—reasoning notes mentioned 'flick shots' and 'less arm fatigue.' Ergonomic comfort voters often mentioned existing or feared wrist issues. Wireless was framed as quality-of-life improvement. Extra buttons voters were predominantly MMO/MOBA players who bind abilities to mouse buttons.",
            reasoning_themes: [
                { name: "FPS optimization", percentage: 31, description: "Faster aim adjustments in shooters" },
                { name: "Physical health", percentage: 26, description: "Preventing wrist/arm strain" },
                { name: "Setup convenience", percentage: 20, description: "Cable-free desk experience" },
                { name: "Genre-specific needs", percentage: 15, description: "Complex games requiring many binds" }
            ],
            minority_perspectives: [
                { name: "Extra buttons", percentage: 15.8, description: "MMO/MOBA/RTS players. Game genres require numerous ability bindings." }
            ]
        },
        {
            id: 4,
            question: "What matters most in gaming headphones?",
            consensus: "DIVIDED",
            consensus_color: "text-orange-500",
            total_responses: 1000,
            distribution: [
                { label: "Comfort for long sessions", count: 342, color: "#10b981" },
                { label: "Audio quality/soundstage", count: 301, color: "#f59e0b" },
                { label: "Microphone quality", count: 198, color: "#3b82f6" },
                { label: "Wireless convenience", count: 159, color: "#ec4899" }
            ],
            why_they_chose_this: "Comfort as top priority reflects extended gaming sessions—reasoning notes mentioned 4-8 hour sessions where 'head clamp' becomes significant. Audio quality voters emphasized positional audio for competitive advantage. Microphone priority correlated with team-based play and streaming aspirations. Wireless voters cited convenience and freedom of movement.",
            reasoning_themes: [],
            minority_perspectives: []
        },
        {
            id: 5,
            question: "What best describes your budget approach for gaming accessories?",
            consensus: "MODERATE CONSENSUS",
            consensus_color: "text-amber-500",
            total_responses: 1000,
            distribution: [
                { label: "Premium main, budget rest", count: 387, color: "#10b981" },
                { label: "Mid-range across board", count: 312, color: "#f59e0b" },
                { label: "Budget-conscious", count: 178, color: "#3b82f6" },
                { label: "Premium everything", count: 123, color: "#ec4899" }
            ],
            why_they_chose_this: "The 'premium main peripheral' strategy reflects cost-benefit thinking: identify which peripheral most impacts performance, then allocate budget there. Mouse and monitor were most cited as worth premium investment. Mid-range voters expressed uncertainty or belief in diminishing returns. Budget-conscious noted 'skill matters more than gear.' Premium-everything voters treated their setup as a hobby investment.",
            reasoning_themes: [],
            minority_perspectives: []
        }
    ],
    patterns: {
        archetypes: [
            { name: "Competitive Optimizer", percentage: 35, description: "Performance-focused gamers prioritizing measurable competitive advantage. Predominantly FPS players.", color: "bg-red-500" },
            { name: "Comfort-First Gamer", percentage: 28, description: "Prioritize physical comfort and session longevity. Often cite health concerns.", color: "bg-blue-500" },
            { name: "Value Rationalist", percentage: 22, description: "Skeptical of premium pricing, believes skill matters more than gear.", color: "bg-green-500" },
            { name: "Multi-Purpose User", percentage: 15, description: "Gaming setup doubles as workstation or content creation rig.", color: "bg-purple-500" }
        ],
        correlations: [
            {
                strength: "STRONG",
                title: "FPS optimization cluster",
                flow: "High refresh rate → Low-weight mouse → Audio quality",
                questions: ["Q1", "Q3", "Q4"]
            },
            {
                strength: "STRONG",
                title: "Budget philosophy consistency",
                flow: "Membrane keyboard → Budget-conscious spending",
                questions: ["Q2", "Q5"]
            },
            {
                strength: "MODERATE",
                title: "Comfort prioritization chain",
                flow: "Ergonomic mouse → Comfort-focused headphones",
                questions: ["Q3", "Q4"]
            }
        ],
        recurring_threads: [
            {
                title: "Competitive edge seeking",
                description: "Desire to gain measurable advantage appeared across all peripheral questions.",
                questions: ["Q1", "Q2", "Q3", "Q4"]
            },
            {
                title: "Physical health awareness",
                description: "Concerns about strain and ergonomics in mouse and headphone choices.",
                questions: ["Q3", "Q4"]
            },
            {
                title: "Value/price skepticism",
                description: "Questioning whether premium pricing delivers proportional value.",
                questions: ["Q2", "Q5"]
            }
        ],
        cohort: {
            query: "Gaming enthusiasts in India",
            summary: "Skews toward competitive/performance-oriented gaming with FPS as dominant genre influence. Strong awareness of diminishing returns.",
            characteristics: [
                "Competitive FPS orientation is dominant influence",
                "Strategic budget allocation preferred",
                "Physical comfort is significant concern",
                "15-20% treat setup as multi-purpose workstation"
            ]
        }
    },
    methodology: {
        cohort_selection: {
            query: "Gaming enthusiasts in India",
            matching_twins: "8,432",
            twins_surveyed: "1,000"
        },
        data_quality: {
            completion_rate: "97%",
            avg_reasoning_length: "156",
            freshness: "11 days"
        },
        limitations: [
            "AI Twin responses reflect historical preferences",
            "India market factors may influence responses",
            "Cohort defined by platform behavior indicators"
        ]
    }
}
