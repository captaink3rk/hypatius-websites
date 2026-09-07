// STARCHITECT glossary data (browser build). Source: STARCHITECT_Glossary_PressKit.docx v1.0
window.STARCHITECT_GLOSSARY = [
  // ===== A =====
  {
    term: "AFSIM",
    abbrev: "Advanced Framework for Simulation, Integration, and Modeling",
    category: "Architecture",
    definition: "A defense-industry simulation environment maintained by the Air Force Research Laboratory. Used for campaign-level analysis and engagement modeling. STARCHITECT is designed to operate alongside AFSIM, ingesting its outputs and feeding into operational workflows AFSIM was never built to handle.",
    seeAlso: "STK, GMAT, MATLAB"
  },
  {
    term: "AOI",
    abbrev: "Area of Interest",
    category: "Acquisition",
    definition: "A government-defined capability area within a Commercial Solutions Opening (CSO) or similar contract vehicle. Each AOI specifies a problem the government wants industry to solve. STARCHITECT addresses three AOIs in the May 2026 CSO: Global & Regional Operations C2, Battle Management Prototype, and Space Intelligence Integration.",
    seeAlso: "CSO, OTA"
  },
  {
    term: "Astrodynamics",
    abbrev: null,
    category: "Operations",
    definition: "The branch of mechanics dealing with the motion of objects in space, particularly satellites and spacecraft. Includes orbital propagation, maneuver planning, perturbation modeling, and rendezvous calculation. STARCHITECT's physics layer uses Orekit and poliastro — both of which implement aerospace-grade astrodynamics.",
    seeAlso: "Orekit, poliastro, Numerical Propagator"
  },

  // ===== B =====
  {
    term: "BMC4I",
    abbrev: "Battle Management Command, Control, Communications, Computers, and Intelligence",
    category: "Doctrine",
    definition: "The integrated system of systems that allows military commanders to direct forces and assets. BMC4I modernization is a core Department of Defense priority — legacy BMC4I tools were not designed for the multi-domain, machine-speed character of modern conflict. STARCHITECT is purpose-built as a BMC4I platform.",
    seeAlso: "CJADC2, C2"
  },
  {
    term: "BabylonJS",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source JavaScript 3D rendering engine. STARCHITECT uses BabylonJS to transition seamlessly from strategic ECI (Earth-Centered Inertial) views to tactical LVLH (Local Vertical/Local Horizontal) ingress views as a target's relative range crosses operator-defined thresholds.",
    seeAlso: "CesiumJS, ECI, LVLH"
  },

  // ===== C =====
  {
    term: "C2",
    abbrev: "Command and Control",
    category: "Doctrine",
    definition: "The exercise of authority and direction by a commander over assigned forces. The shorthand for everything from a single radio operator dispatching a unit to enterprise-scale joint-force coordination. STARCHITECT is a C2 platform at machine speed, built to operate where legacy C2 systems collapse.",
    seeAlso: "BMC4I, CJADC2"
  },
  {
    term: "CesiumJS",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source 3D globe and geospatial visualization library. STARCHITECT uses CesiumJS for the operator-facing real-time orbital dashboard with sub-10ms WebSocket telemetry updates.",
    seeAlso: "BabylonJS, K3s"
  },
  {
    term: "CJADC2",
    abbrev: "Combined Joint All-Domain Command and Control",
    category: "Doctrine",
    definition: "The Department of War's framework for integrating sensor and effector systems across all warfighting domains — space, air, land, maritime, cyber, and information. CJADC2 demands a kill chain that closes in seconds across previously incompatible service-specific systems. STARCHITECT is engineered as a CJADC2 execution layer.",
    seeAlso: "JADC2, BMC4I, F2T2EA"
  },
  {
    term: "Common Operating Picture",
    abbrev: "COP",
    category: "Doctrine",
    definition: "A unified view of the battlespace shared across operators, commanders, and decision-makers. Effective C2 requires a coherent COP — one that all participants trust. STARCHITECT generates and maintains the COP across distributed nodes even when network connectivity degrades.",
    seeAlso: "C2, BMC4I, Fog of War"
  },
  {
    term: "Course of Action",
    abbrev: "COA",
    category: "Doctrine",
    definition: "A proposed plan for accomplishing a mission, usually one of several alternatives presented to a commander for selection. STARCHITECT's AI Battlespace Correlator generates COAs in under 500 milliseconds — synthesized from multi-domain sensor data, ranked by P(success), and presented for operator verification.",
    seeAlso: "OODA, ROE"
  },
  {
    term: "CRDT",
    abbrev: "Conflict-Free Replicated Data Type",
    category: "Architecture",
    definition: "A class of data structures that allows multiple copies to be updated independently and merged without conflict. Critical for distributed systems operating across unreliable networks. STARCHITECT uses CRDTs for split-brain merge — when network partitions heal, divergent state reconciles automatically with zero data loss.",
    seeAlso: "K3s, NATS, DDIL"
  },
  {
    term: "CSO",
    abbrev: "Commercial Solutions Opening",
    category: "Acquisition",
    definition: "A streamlined Department of Defense procurement vehicle that allows rapid award of prototype contracts to commercial vendors. Faster than traditional FAR-based contracting. The May 2026 CSO addresses three AOIs that STARCHITECT directly supports.",
    seeAlso: "OTA, AOI"
  },
  {
    term: "Cislunar",
    abbrev: null,
    category: "Operations",
    definition: "The region of space between Earth and the Moon, including lunar orbits and Lagrange points. Cislunar operations are an emerging priority for U.S. Space Force as commercial and adversary activity expands beyond GEO. STARCHITECT's astrodynamics layer supports multi-body cislunar trajectory design.",
    seeAlso: "GEO, Astrodynamics"
  },

  // ===== D =====
  {
    term: "DDIL",
    abbrev: "Denied, Degraded, Intermittent, Limited",
    category: "Doctrine",
    definition: "The operating conditions of contested communications environments. In DDIL, networks fail, satellites are jammed, ground stations are destroyed, and bandwidth becomes scarce. STARCHITECT is engineered specifically to fight through DDIL via its five-tier PACE architecture.",
    seeAlso: "PACE, K3s, CRDT"
  },
  {
    term: "Delta-V",
    abbrev: "&Delta;V",
    category: "Operations",
    definition: "The change in velocity required to execute a maneuver, expressed in meters or kilometers per second. Each maneuver depletes a satellite's onboard fuel; tracking delta-V budget is essential to mission planning. STARCHITECT's maneuver planner provides real-time delta-V cost calculations for every proposed burn.",
    seeAlso: "Hohmann Transfer, Lambert Solver"
  },
  {
    term: "Digital Twin",
    abbrev: null,
    category: "Operations",
    definition: "A live, high-fidelity simulation of a physical system that updates as the real system changes. STARCHITECT serves as a digital twin of orbital constellations, ground networks, and engagement geometries — and uses the same messaging bus for both simulation and live operations.",
    seeAlso: "M&S, SiL"
  },
  {
    term: "DSO",
    abbrev: "Dynamic Space Operations",
    category: "Operations",
    definition: "The discipline of executing offensive and defensive maneuvers in a contested orbital environment. DSO is the core of modern space warfare and the area where legacy tools fail most visibly. STARCHITECT's Three Burns kill chain is the canonical DSO workflow.",
    seeAlso: "Three Burns, RPO, OCS, DCS"
  },

  // ===== E =====
  {
    term: "ECI",
    abbrev: "Earth-Centered Inertial",
    category: "Operations",
    definition: "A coordinate frame fixed relative to distant stars, used for absolute orbital position calculations. ECI is the standard frame for strategic-level orbital tracking. For close-approach intercept planning, operators transition to LVLH (relative) coordinates.",
    seeAlso: "LVLH, BabylonJS"
  },
  {
    term: "EKF",
    abbrev: "Extended Kalman Filter",
    category: "Operations",
    definition: "A recursive estimator that fuses noisy sensor observations with predictive models to maintain accurate state tracking under uncertainty. STARCHITECT's EKF pipeline continuously fuses radar and optical observations with propagator predictions — keeping Blue's tracking ellipsoid tight while Red's uncertainty grows during maneuver.",
    seeAlso: "Numerical Propagator, Track Quality Score"
  },

  // ===== F =====
  {
    term: "F2T2EA",
    abbrev: "Find, Fix, Track, Target, Engage, Assess",
    category: "Doctrine",
    definition: "The canonical six-step kill chain. Each step has discrete sensor and decision requirements. Compressing F2T2EA timeline is the central challenge of modern command and control — and the headline metric STARCHITECT optimizes.",
    seeAlso: "OODA, CJADC2"
  },
  {
    term: "FMI / FMU",
    abbrev: "Functional Mock-up Interface / Functional Mock-up Unit",
    category: "Architecture",
    definition: "An open standard for exchanging dynamic system models between simulation tools. An FMU is a compiled binary that implements the FMI standard — black-box, with documented inputs and outputs. STARCHITECT executes prime-supplied FMU binaries in isolated Player Pods, enabling proprietary physics injection without exposing source code.",
    seeAlso: "Player Pod, Sandbox Vaulting"
  },
  {
    term: "Fog of War",
    abbrev: null,
    category: "Doctrine",
    definition: "The uncertainty in situational awareness experienced by participants in conflict. STARCHITECT enforces strict Fog of War in wargaming — symmetric visibility based on actual sensor acquisition, with role-scoped Red/Blue/White access controls and Track Quality Scores reflecting genuine sensor confidence.",
    seeAlso: "Track Quality Score, ROE"
  },
  {
    term: "FOSS",
    abbrev: "Free and Open-Source Software",
    category: "Architecture",
    definition: "Software whose source code is publicly available and freely modifiable. STARCHITECT runs on a 100% FOSS backbone — NATS, K3s, Postgres, Orekit, Qdrant — by design. Government auditors can inspect every layer; allied-nation deployments are not gated by U.S. commercial license terms.",
    seeAlso: "Open Architecture, K3s, NATS"
  },

  // ===== G =====
  {
    term: "GEO",
    abbrev: "Geosynchronous Earth Orbit",
    category: "Operations",
    definition: "Orbits at approximately 35,786 km altitude where satellites match Earth's rotational period. Strategic communications, missile warning, and many adversary surveillance satellites operate in GEO. Recent close-approach activity by Chinese satellites (TJS-3, TJS-10, SJ-29A/B) has occurred in GEO.",
    seeAlso: "LEO, Cislunar, RPO"
  },
  {
    term: "GMAT",
    abbrev: "General Mission Analysis Tool",
    category: "Architecture",
    definition: "An open-source orbital analysis tool maintained by NASA. Used for mission design and trajectory analysis. STARCHITECT integrates with GMAT-derived models through its Orbital Bus — physics computed externally can be injected into the live simulation runtime.",
    seeAlso: "STK, MATLAB, Orekit"
  },
  {
    term: "Golden Dome",
    abbrev: null,
    category: "Doctrine",
    definition: "A U.S. homeland missile defense initiative requiring a layered architecture of interceptors, space-based sensors, ground-based fire control, and a survivable C2 mesh. STARCHITECT's design directly addresses Golden Dome's command-and-control challenges: sensor fusion, machine-speed engagement sequencing, and DDIL survivability.",
    seeAlso: "BMC4I, CJADC2, PWSA"
  },

  // ===== H =====
  {
    term: "Hohmann Transfer",
    abbrev: null,
    category: "Operations",
    definition: "An efficient two-burn orbital maneuver between two coplanar circular orbits. Used for routine altitude changes when fuel matters more than time. STARCHITECT's maneuver planner offers Hohmann transfers as one option in its DSO solver alongside higher-cost, faster Lambert intercepts.",
    seeAlso: "Lambert Solver, Three Burns"
  },
  {
    term: "Hypersonic",
    abbrev: null,
    category: "Operations",
    definition: "Speeds at or above Mach 5. Modern hypersonic threats compress engagement windows to 160-300 seconds. The mismatch between hypersonic kinematics and legacy decision-loop timelines is the central premise of STARCHITECT.",
    seeAlso: "Kill Chain, F2T2EA"
  },

  // ===== I =====
  {
    term: "ITAR",
    abbrev: "International Traffic in Arms Regulations",
    category: "Doctrine",
    definition: "U.S. regulations (22 C.F.R. 120-130) controlling the export of defense-related articles, services, and technical data. STARCHITECT contains technical data subject to ITAR and may not be exported to foreign persons without prior written U.S. Government authorization.",
    seeAlso: "PROPIN, EAR"
  },
  {
    term: "IXP",
    abbrev: "Internet Exchange Point",
    category: "Architecture",
    definition: "A physical infrastructure node where multiple Internet service providers and content networks interconnect. STARCHITECT's network topology layer models global IXPs as potential bottlenecks for end-to-end command-link latency, allowing operators to identify routing-dependency vulnerabilities.",
    seeAlso: "Submarine Cable"
  },

  // ===== J =====
  {
    term: "JADC2",
    abbrev: "Joint All-Domain Command and Control",
    category: "Doctrine",
    definition: "The U.S. military's earlier framework for cross-domain integration, since superseded in coalition-context naming by CJADC2. The technical and operational requirements are largely identical.",
    seeAlso: "CJADC2, BMC4I"
  },

  // ===== K =====
  {
    term: "K3s",
    abbrev: null,
    category: "Architecture",
    definition: "A lightweight, production-grade Kubernetes distribution designed for edge deployment, IoT, and resource-constrained environments. STARCHITECT runs on a K3s mesh — every node is a complete operational stack capable of standalone operation when disconnected from the broader cluster.",
    seeAlso: "Kubernetes, NATS, FOSS"
  },
  {
    term: "KEDA",
    abbrev: "Kubernetes Event-Driven Autoscaling",
    category: "Architecture",
    definition: "A Kubernetes component that scales workloads based on event triggers rather than CPU or memory metrics. STARCHITECT uses KEDA to spin up thousands of parallel worker pods for massively-parallel orbital prediction — calculating 5,000+ intercept permutations in under 15 seconds.",
    seeAlso: "K3s, NATS"
  },
  {
    term: "Kill Chain",
    abbrev: null,
    category: "Doctrine",
    definition: "The end-to-end sequence of detecting, identifying, tracking, targeting, engaging, and assessing a threat. The canonical six-step model is F2T2EA. STARCHITECT compresses kill-chain timelines from minutes (legacy) to sub-second machine-speed correlation.",
    seeAlso: "F2T2EA, OODA"
  },
  {
    term: "Kill Web",
    abbrev: null,
    category: "Doctrine",
    definition: "An evolution of the kill chain concept where multiple sensors and effectors are dynamically meshed rather than chained linearly. Kill Web is more resilient to single-point disruption. STARCHITECT's distributed architecture is purpose-built for Kill Web operations.",
    seeAlso: "Kill Chain, F2T2EA, CJADC2"
  },

  // ===== L =====
  {
    term: "Lambert Solver",
    abbrev: null,
    category: "Operations",
    definition: "An algorithm that calculates the orbital trajectory connecting two positions in a specified flight time. Used for rendezvous and intercept targeting. STARCHITECT uses robust Izzo-algorithm implementations of Lambert solvers for fast, fuel-aware intercept planning.",
    seeAlso: "Hohmann Transfer, Three Burns"
  },
  {
    term: "LEO",
    abbrev: "Low Earth Orbit",
    category: "Operations",
    definition: "Orbits between approximately 160 km and 2,000 km altitude. Most reconnaissance, communications, and Earth-observation satellites operate in LEO. Proliferated LEO constellations (Starlink, OneWeb, PWSA) have transformed the strategic environment.",
    seeAlso: "GEO, MEO, PWSA"
  },
  {
    term: "Link 16",
    abbrev: null,
    category: "Standards",
    definition: "A NATO-standard tactical data exchange network used by U.S. and allied military aircraft, ships, and ground forces. STARCHITECT is engineered for Link 16 interoperability — its track-quality outputs are compatible with Link 16 Track Quality Score schemas.",
    seeAlso: "MIDS/JTIDS, Track Quality Score"
  },
  {
    term: "LVLH",
    abbrev: "Local Vertical / Local Horizontal",
    category: "Operations",
    definition: "A coordinate frame fixed to a satellite's orbital plane, used for relative-motion analysis during proximity operations. STARCHITECT transitions from ECI (absolute) to LVLH (relative) frames as engagement range shortens — sensor-selectable thresholds trigger the switch automatically.",
    seeAlso: "ECI, RPO, BabylonJS"
  },

  // ===== M =====
  {
    term: "M&S",
    abbrev: "Modeling and Simulation",
    category: "Operations",
    definition: "The discipline of constructing computational models to represent real-world systems for analysis, training, and decision support. STARCHITECT serves as the core M&S platform for USSF and SPACECOM exercises in its Phase 1 deployment posture.",
    seeAlso: "Digital Twin, SiL, LVC"
  },
  {
    term: "MATLAB",
    abbrev: null,
    category: "Architecture",
    definition: "A proprietary numerical computing environment widely used in defense engineering. STARCHITECT exposes a native MATLAB Toolbox with .m wrappers calling REST endpoints directly — covering 90%+ of typical scientific use cases without re-implementation.",
    seeAlso: "Python SDK, FMI/FMU"
  },
  {
    term: "MBSE",
    abbrev: "Model-Based Systems Engineering",
    category: "Architecture",
    definition: "An engineering methodology that uses domain-specific models (often expressed in SysML) as the primary artifact of system design. STARCHITECT bridges static MBSE artifacts to live executable architectures — translating SysML models directly into NATS streams and runtime data schemas.",
    seeAlso: "MDAO, SysML"
  },
  {
    term: "MCP",
    abbrev: "Model Context Protocol",
    category: "Architecture",
    definition: "An emerging standard for tool-calling and context exchange between Large Language Models and external systems. STARCHITECT's CJADC2 MCP Server exposes 78+ MCP tools — natively bridging the physical space domain with LLM-driven course-of-action generation.",
    seeAlso: "AI Correlator, Natural Language C2"
  },
  {
    term: "MDAO",
    abbrev: "Multidisciplinary Design Analysis and Optimization",
    category: "Architecture",
    definition: "A computational design methodology that simultaneously optimizes across multiple engineering disciplines. STARCHITECT supports federated MDAO via KEDA-driven Kubernetes worker pods, enabling massive-parallel trade-space evaluation that exceeds legacy desktop-bound tools.",
    seeAlso: "MBSE, K3s, KEDA"
  },
  {
    term: "MIDS / JTIDS",
    abbrev: "Multifunctional Information Distribution System / Joint Tactical Information Distribution System",
    category: "Standards",
    definition: "The hardware and waveform implementations of Link 16. STARCHITECT integrates with MIDS/JTIDS legacy networks while operating at modern machine speed — protecting existing investments while enabling new capability.",
    seeAlso: "Link 16, OMS/UCI"
  },
  {
    term: "MLS",
    abbrev: "Multi-Level Security",
    category: "Standards",
    definition: "A security paradigm permitting users with different clearance levels to interact with a single system while preventing unauthorized access between classification tiers. STARCHITECT implements MLS through password-protected session isolation and role-based White/Red/Blue/Gray separation per warfighter lobby.",
    seeAlso: "ROE, Fog of War"
  },

  // ===== N =====
  {
    term: "NATS",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source, high-performance publish-subscribe messaging system. STARCHITECT uses NATS JetStream as its reactive event bus — the \"Orbital Edge Bus\" — providing sub-100ms synchronization across the constellation mesh and enabling self-healing federation across distributed nodes.",
    seeAlso: "K3s, FOSS, CRDT"
  },
  {
    term: "Numerical Propagator",
    abbrev: null,
    category: "Operations",
    definition: "An orbital mechanics solver that integrates equations of motion numerically — accounting for J2 perturbations, atmospheric drag, third-body gravity, and finite burns. STARCHITECT uses numerical propagators to track non-Keplerian maneuvering threats that break legacy TLE-based propagators.",
    seeAlso: "TLE, EKF, Orekit"
  },
  {
    term: "ns-3",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source discrete-event network simulator used for packet-level fidelity in network research. STARCHITECT incorporates ns-3 for end-to-end RF link path-loss modeling, optical-link weather attenuation, and protocol queue dynamics.",
    seeAlso: "Link Margin, FOSS"
  },

  // ===== O =====
  {
    term: "OCS / DCS",
    abbrev: "Offensive Space Control / Defensive Space Control",
    category: "Doctrine",
    definition: "Joint-doctrinal categories of space operations. OCS includes actions to deny adversary use of space; DCS includes actions to protect friendly space capabilities. STARCHITECT presents engagement options categorized as OCS or DCS with associated cost functions and ROE constraints.",
    seeAlso: "ROE, Three Burns"
  },
  {
    term: "OMS / UCI",
    abbrev: "Open Mission Systems / Universal Command and Control Interface",
    category: "Standards",
    definition: "U.S. Air Force standards for open architecture and interoperability across mission systems. STARCHITECT is built from day one for OMS/UCI alignment.",
    seeAlso: "SDA OCT, Link 16"
  },
  {
    term: "OODA",
    abbrev: "Observe, Orient, Decide, Act",
    category: "Doctrine",
    definition: "John Boyd's decision-cycle model. The faster a force can iterate OODA loops relative to its adversary, the greater its decision advantage. STARCHITECT compresses OODA from human timescales (minutes) to machine timescales (sub-second) — while keeping humans in the loop on action authority.",
    seeAlso: "F2T2EA, COA"
  },
  {
    term: "Orbital Bus",
    abbrev: null,
    category: "Architecture",
    definition: "STARCHITECT's NATS-based event bus for external physics-engine injection. Allows MATLAB, STK, GMAT, and prime-supplied physics models to publish state directly into the live simulation runtime via NATS topics — without translation overhead.",
    seeAlso: "NATS, FMI/FMU, MATLAB"
  },
  {
    term: "Orekit",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source, low-level, aerospace-grade space dynamics library written in Java. Used by ESA, academic institutions, and defense programs worldwide. STARCHITECT's primary numerical propagation engine.",
    seeAlso: "Numerical Propagator, FOSS, poliastro"
  },
  {
    term: "OTA",
    abbrev: "Other Transaction Authority",
    category: "Acquisition",
    definition: "Authority granted to specific Department of Defense components to enter into transactions other than traditional contracts, grants, or cooperative agreements. OTAs allow much faster contract award than FAR-based contracting. STARCHITECT is acquisition-ready under existing OTA vehicles.",
    seeAlso: "CSO, SBIR"
  },

  // ===== P =====
  {
    term: "PACE",
    abbrev: "Primary, Alternate, Contingency, Emergency",
    category: "Doctrine",
    definition: "A military communications planning framework specifying redundant pathways for sustained operations. STARCHITECT's five-tier National Survivability Architecture maps directly to PACE — ensuring BMC4I functions continue across progressive infrastructure degradation, from full constellation down to client-only emergency operations.",
    seeAlso: "DDIL, CRDT"
  },
  {
    term: "Player Pod",
    abbrev: null,
    category: "Architecture",
    definition: "STARCHITECT's isolated Linux namespace for executing prime-supplied FMU binaries. Each Player Pod is sandboxed with no network egress and is governed by a central Simulation Time Authority (ST-Auth) ensuring synchronization with the global simulation clock.",
    seeAlso: "FMI/FMU, Sandbox Vaulting"
  },
  {
    term: "poliastro",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source astrodynamics library written in Python, optimized for interactive analysis and rapid prototyping. STARCHITECT pairs poliastro (planning) with Orekit (high-fidelity propagation).",
    seeAlso: "Orekit, Numerical Propagator"
  },
  {
    term: "PROPIN",
    abbrev: "Proprietary Information",
    category: "Doctrine",
    definition: "A handling caveat applied to information that, while unclassified, is proprietary to a contractor or program and requires restricted distribution. STARCHITECT documentation is marked PROPIN where appropriate.",
    seeAlso: "ITAR"
  },
  {
    term: "PWSA",
    abbrev: "Proliferated Warfighter Space Architecture",
    category: "Doctrine",
    definition: "The U.S. Space Development Agency's program to deploy a proliferated low-Earth orbit constellation of tracking, transport, and battle management satellites. STARCHITECT is engineered to fuse PWSA sensor data with terrestrial network telemetry.",
    seeAlso: "SDA OCT, LEO, Golden Dome"
  },

  // ===== Q =====
  {
    term: "Qdrant",
    abbrev: null,
    category: "Architecture",
    definition: "An open-source vector database used for high-performance semantic search and similarity retrieval. STARCHITECT uses Qdrant for local vector-database semantic correlation across multi-domain telemetry — operating entirely within the secure network.",
    seeAlso: "MCP, AI Correlator, FOSS"
  },

  // ===== R =====
  {
    term: "Rancher",
    abbrev: null,
    category: "Architecture",
    definition: "A Kubernetes management platform that orchestrates clusters across diverse environments. STARCHITECT uses Rancher to manage its K3s mesh — scaling from $200 homelab nodes to national-scale super-clusters.",
    seeAlso: "K3s, Helm"
  },
  {
    term: "ROE",
    abbrev: "Rules of Engagement",
    category: "Doctrine",
    definition: "Directives issued by competent military authority that delineate the circumstances and limitations under which forces may initiate or continue combat engagement. STARCHITECT's UI surfaces ROE constraints inline with proposed maneuvers and prevents unauthorized actions through a 5-level escalation gauge.",
    seeAlso: "Escalation Gauge, COA"
  },
  {
    term: "RPO / ZPO",
    abbrev: "Rendezvous and Proximity Operations / Zero-effort Proximity Operations",
    category: "Operations",
    definition: "Tactical operations in which one spacecraft maneuvers in close proximity to another. STARCHITECT manages RPO/ZPO via LVLH-frame tactical transitions and glideslope monitors — switching the operator interface from a strategic globe view to a tactical relative-motion cockpit.",
    seeAlso: "LVLH, Three Burns, DSO"
  },

  // ===== S =====
  {
    term: "SBIR",
    abbrev: "Small Business Innovation Research",
    category: "Acquisition",
    definition: "A U.S. government program providing non-dilutive funding to small businesses developing innovative technologies. SBIR Phase II and Phase III pathways are open to STARCHITECT for technology maturation and scaling capital.",
    seeAlso: "OTA, STRATFI"
  },
  {
    term: "SDA OCT",
    abbrev: "Space Development Agency Optical Communications Terminal",
    category: "Standards",
    definition: "A standard for optical inter-satellite communication links in proliferated LEO constellations. STARCHITECT is built from day one for SDA OCT v4.0 interoperability.",
    seeAlso: "PWSA, OMS/UCI, Link 16"
  },
  {
    term: "SiL",
    abbrev: "Software-in-the-Loop",
    category: "Operations",
    definition: "A testing methodology in which software is exercised against simulated hardware before deployment. STARCHITECT's Phase 2 deployment posture supports defense primes using the platform to validate edge flight software and physics binaries prior to launch.",
    seeAlso: "M&S, Digital Twin, LVC"
  },
  {
    term: "STK",
    abbrev: "Systems Tool Kit",
    category: "Architecture",
    definition: "AGI's commercial space domain analysis tool, the industry-standard physics and visualization platform. STARCHITECT operates alongside STK — ingesting STK-derived models and providing the operational integration layer STK was never built to deliver.",
    seeAlso: "GMAT, AFSIM, MATLAB"
  },
  {
    term: "STRATFI",
    abbrev: "Strategic Funding Increase",
    category: "Acquisition",
    definition: "A SpaceWERX program providing scaling capital for strategically important space technologies that have completed earlier SBIR phases. A natural pathway for STARCHITECT.",
    seeAlso: "SBIR, SpaceWERX"
  },
  {
    term: "Submarine Cable",
    abbrev: null,
    category: "Architecture",
    definition: "Undersea fiber-optic cables that carry the majority of global Internet traffic. STARCHITECT models actual seafloor routes from TeleGeography data — critical for calculating end-to-end command-link latency in geopolitically constrained routing scenarios.",
    seeAlso: "IXP"
  },

  // ===== T =====
  {
    term: "Three Burns",
    abbrev: null,
    category: "Operations",
    definition: "STARCHITECT's canonical DSO kill-chain workflow. Burn 1 — plane change to match Red's orbital plane at the line of nodes. Burn 2 — altitude raise to match Red's apogee. Burn 3 — circularization burn with LVLH-frame ingress planning. Each burn carries delta-V cost, fuel-loss penalty, and time-of-flight.",
    seeAlso: "DSO, Lambert Solver, LVLH"
  },
  {
    term: "TLE",
    abbrev: "Two-Line Element set",
    category: "Operations",
    definition: "A standardized, compact representation of orbital elements at a specific epoch. TLEs use simplified Keplerian math that breaks the moment a satellite maneuvers. STARCHITECT replaces TLE-based propagation with numerical propagators driven by an Extended Kalman Filter.",
    seeAlso: "Numerical Propagator, EKF"
  },
  {
    term: "Track Quality Score",
    abbrev: "TQS",
    category: "Operations",
    definition: "A composite confidence metric (0.0–1.0) representing the operator's confidence in a sensor track. STARCHITECT computes TQS from path diversity, signal-to-noise ratio, and latency margins — and auto-escalates engagement authority when TQS crosses configurable thresholds.",
    seeAlso: "EKF, Link 16, Fog of War"
  },

  // ===== U =====
  {
    term: "USSF",
    abbrev: "United States Space Force",
    category: "Doctrine",
    definition: "The independent U.S. armed service responsible for space operations, established 2019. USSF is one of STARCHITECT's primary intended customers, particularly for Phase 1 wargaming and M&S deployments.",
    seeAlso: "SPACECOM, Golden Dome"
  }
];
