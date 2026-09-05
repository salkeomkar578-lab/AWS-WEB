/**
 * AWS SBG VPKBIET - Official Platform Data Store
 */

export const PROJECTS_DATA = [
  {
    id: "econutri-ai",
    title: "EcoNutri AI",
    category: "agtech",
    tagline: "Cloud-Native Precision Agriculture & Soil Nutrient Diagnostics",
    summary: "Solar-powered IoT sensors deployed across Baramati agricultural fields transmit real-time N-P-K soil metrics. An AWS serverless pipeline analyzes nutrient deficiency and generates hyper-localized Marathi/English fertilizer schedules via Amazon Bedrock.",
    badge: "Regional Impact",
    badgeType: "eco",
    awsServices: ["AWS IoT Core", "AWS Lambda", "Amazon DynamoDB", "Amazon Bedrock", "Amazon SNS"],
    metrics: [
      { label: "Fertilizer Waste Reduction", val: "22%" },
      { label: "Active Baramati Farms", val: "45+" },
      { label: "Diagnostic Latency", val: "<1.2s" }
    ],
    architecture: {
      diagramSteps: [
        { title: "IoT Field Sensors", desc: "Solar-powered ESP32 sensors sample soil moisture, pH, and N-P-K levels in grape & sugarcane farms." },
        { title: "AWS IoT Core", desc: "Secure MQTT ingestion channel with X.509 device certificates and rule-based topic routing." },
        { title: "AWS Lambda & DynamoDB", desc: "Serverless data validation, time-series logging, and threshold anomaly detection." },
        { title: "Amazon Bedrock (Claude 3.5)", desc: "Generative AI agronomist agent synthesizes soil data into conversational Marathi advisory." },
        { title: "Amazon SNS & WhatsApp Gateway", desc: "Automated SMS/WhatsApp alerts delivered straight to the farmer's mobile handset." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/econutri-ai",
    demoUrl: "https://econutri.vpkbiet.ac.in",
    contributors: ["Omkar (AI/ML Lead)", "Pooja D. (IoT Systems)", "Sanket M. (Cloud Ops)"]
  },
  {
    id: "skipshop-ai",
    title: "SkipShop AI",
    category: "genai",
    tagline: "Edge Computer Vision & Serverless Autonomous Retail Checkout",
    summary: "Frictionless checkout experience tailored for local semi-urban grocery stores and college campus marts. Edge cameras track items with computer vision, synchronizing with AWS AppSync GraphQL for instant queue-free payment.",
    badge: "Flagship",
    badgeType: "aws-orange",
    awsServices: ["Amazon Rekognition", "AWS AppSync", "AWS Lambda", "Amazon DynamoDB", "Amazon S3"],
    metrics: [
      { label: "Queue Time Reduction", val: "78%" },
      { label: "Checkout Speed", val: "4.5 sec" },
      { label: "Item Accuracy", val: "99.2%" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Edge Camera Stream", desc: "Dual overhead high-fps RTSP cameras capture shopper cart interaction." },
        { title: "Amazon Rekognition & SageMaker", desc: "Real-time object classification and bounding-box detection matching retail SKUs." },
        { title: "AWS AppSync (GraphQL)", desc: "Bi-directional WebSocket connection pushing live cart line items to the student's phone." },
        { title: "DynamoDB & Stripe/UPI Lambda", desc: "Atomic balance ledger updates and serverless payment webhooks." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/skipshop-ai",
    demoUrl: "https://skipshop.vpkbiet.ac.in",
    contributors: ["Omkar (Lead Architect)", "Aditya K. (Computer Vision)", "Neha P. (Full Stack)"]
  },
  {
    id: "skipline-go",
    title: "Skipline Go",
    category: "serverless",
    tagline: "Event-Driven Campus Dining Queue & Pre-Ordering Engine",
    summary: "Built for the VPKBIET campus cafeteria to eliminate peak lunch rushes. Students pre-order and receive real-time prep status with serverless WebSocket broadcasts via AWS API Gateway and Amazon EventBridge.",
    badge: "Campus Live",
    badgeType: "aws-blue",
    awsServices: ["AWS API Gateway", "Amazon EventBridge", "AWS Lambda", "Amazon DynamoDB", "Amazon CloudWatch"],
    metrics: [
      { label: "Daily Campus Orders", val: "650+" },
      { label: "Average Wait Time", val: "2 mins" },
      { label: "Zero Server Downtime", val: "99.99%" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Next.js PWA Client", desc: "Progressive Web App with offline menu caching and instant biometric login." },
        { title: "WebSocket API Gateway", desc: "Persistent two-way connection for real-time kitchen order ticketing." },
        { title: "Amazon EventBridge", desc: "Decoupled choreography routing orders from kitchen prep -> packing -> collection." },
        { title: "DynamoDB Streams", desc: "Change data capture triggering instant push notifications upon order ready." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/skipline-go",
    demoUrl: "https://skipline.vpkbiet.ac.in",
    contributors: ["Rohan S. (Backend)", "Omkar (Systems Advisor)", "Tanvi J. (UI/UX)"]
  },
  {
    id: "cloudguard-sentinel",
    title: "CloudGuard Sentinel",
    category: "serverless",
    tagline: "Automated AWS Free-Tier Cost Anomaly & Compliance Hunter",
    summary: "A student-designed AWS Lambda utility that audits student AWS accounts for orphaned EBS volumes, idle NAT gateways, and unencrypted S3 buckets, preventing surprise cloud bills.",
    badge: "Utility",
    badgeType: "aws-orange",
    awsServices: ["AWS Cost Explorer API", "AWS Lambda", "Amazon SNS", "Amazon CloudWatch", "AWS IAM"],
    metrics: [
      { label: "Credits Saved", val: "$3,400+" },
      { label: "Audited Accounts", val: "85+" },
      { label: "Compliance Score", val: "96%" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Daily CloudWatch Cron", desc: "Scheduled event triggers multi-region scanner Lambda function." },
        { title: "Cost & Resource APIs", desc: "Queries AWS Cost Explorer, EC2, and S3 APIs across ap-south-1 and us-east-1." },
        { title: "Heuristic Anomaly Engine", desc: "Detects unattached volumes, idle load balancers, and public bucket ACLs." },
        { title: "Discord Webhook Bot", desc: "Sends instant remediation alerts to the student's project channel." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/cloudguard-sentinel",
    demoUrl: "https://github.com/aws-sbg-vpkbiet/cloudguard-sentinel",
    contributors: ["Prashant T. (Cloud Security)", "Omkar (Mentor)"]
  },
  {
    id: "campusgrid-iot",
    title: "CampusGrid Smart Energy",
    category: "iot",
    tagline: "VPKBIET Green Campus Micro-Grid Analytics",
    summary: "Real-time energy telemetry across VPKBIET academic buildings. Visualizes solar generation and HVAC load to reduce peak institutional electricity tariffs.",
    badge: "Eco-Tech",
    badgeType: "eco",
    awsServices: ["AWS IoT Greengrass", "Amazon Timestream", "Amazon QuickSight", "AWS Lambda"],
    metrics: [
      { label: "Solar Energy Tracked", val: "450 kWh/day" },
      { label: "Peak Load Cut", val: "14%" },
      { label: "Live Sub-Meters", val: "28 Nodes" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Smart Energy Meters", desc: "Modbus RTU electricity meters in academic buildings 1, 2, and 3." },
        { title: "AWS IoT Greengrass", desc: "Campus edge gateway aggregating high-frequency current and voltage signals." },
        { title: "Amazon Timestream", desc: "Purpose-built time-series database ingesting 100,000 metrics daily." },
        { title: "Amazon QuickSight", desc: "Executive dashboards visualizing live grid balance for faculty administration." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/campusgrid-iot",
    demoUrl: "https://campusgrid.vpkbiet.ac.in",
    contributors: ["Shubham G. (IoT Lead)", "Omkar (Architecture)"]
  },
  {
    id: "pulsemed-ai",
    title: "PulseMed AI",
    category: "genai",
    tagline: "Multilingual Clinical Triage Assistant for Rural Clinics",
    summary: "Built for primary healthcare sub-centers in rural Pune. Uses Amazon Transcribe Medical and Bedrock to translate local Marathi voice symptom descriptions into structured clinical summaries.",
    badge: "Healthcare",
    badgeType: "aws-blue",
    awsServices: ["Amazon Bedrock", "Amazon Transcribe", "Amazon S3", "AWS Step Functions"],
    metrics: [
      { label: "Voice Translation Accuracy", val: "94.8%" },
      { label: "Triage Time Saved", val: "6 mins/pt" },
      { label: "Rural Doctors Piloting", val: "8" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Mobile Audio Capture", desc: "Doctor or ASHA worker records voice note in Marathi/Hindi." },
        { title: "Amazon Transcribe", desc: "Converts speech-to-text with specialized Indian regional phonetic models." },
        { title: "AWS Step Functions", desc: "Orchestrates clinical entity extraction and symptom severity classification." },
        { title: "Amazon Bedrock LLM", desc: "Formats symptoms into ICD-10 medical summary for referral hospitals." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/pulsemed-ai",
    demoUrl: "https://pulsemed.vpkbiet.ac.in",
    contributors: ["Omkar (AI/ML Lead)", "Kavita S. (BioTech/NLP)"]
  },
  {
    id: "cloudforge-cdk",
    title: "CloudForge CDK",
    category: "devops",
    tagline: "Production-Ready AWS CDK v2 Infrastructure Templates for Students",
    summary: "Curated open-source collection of reusable AWS CDK v2 constructs tailored for collegiate hackathons and capstones: Serverless microservices, VPC peering, and Bedrock RAG pipelines.",
    badge: "Open Source",
    badgeType: "aws-orange",
    awsServices: ["AWS CloudFormation", "AWS CodePipeline", "Amazon S3", "AWS IAM", "Amazon Route 53"],
    metrics: [
      { label: "GitHub Stars", val: "180+" },
      { label: "Verified Blueprints", val: "12" },
      { label: "Student Deployments", val: "420+" }
    ],
    architecture: {
      diagramSteps: [
        { title: "CLI Starter Tool", desc: "npx create-cloudforge-app bootstraps multi-stack CDK projects in seconds." },
        { title: "Stack Synthesis", desc: "Synthesizes secure CloudFormation templates with built-in cdk-nag security audits." },
        { title: "Automated CI/CD", desc: "GitHub Actions workflow deploys into ephemeral preview environments." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/cloudforge-cdk",
    demoUrl: "https://cdk.vpkbiet.ac.in",
    contributors: ["Pooja N. (DevOps Lead)", "Omkar (Architect)", "Prashant B. (DevRel)"]
  },
  {
    id: "bedrock-campus-rag",
    title: "Bedrock Campus RAG",
    category: "genai",
    tagline: "Student Academic Handbook & Cloud Curriculum AI Knowledge Engine",
    summary: "Indexes VPKBIET academic regulations and official AWS documentation into Amazon OpenSearch Serverless, answering queries via Claude 3.5 Sonnet.",
    badge: "GenAI Pilot",
    badgeType: "aws-blue",
    awsServices: ["Amazon Bedrock", "Amazon OpenSearch Serverless", "AWS Lambda", "Amazon S3"],
    metrics: [
      { label: "Queries Answered", val: "2,400+" },
      { label: "Citation Accuracy", val: "98.5%" },
      { label: "Retrieval Latency", val: "850ms" }
    ],
    architecture: {
      diagramSteps: [
        { title: "Document Parsing", desc: "S3 ingestion bucket triggers Lambda text extraction and chunking." },
        { title: "Titan Multimodal Embeddings", desc: "Amazon Titan Embeddings models generate 1536-dim semantic vectors." },
        { title: "OpenSearch Vector Search", desc: "k-NN retrieval pulls top 5 relevant document chunks." },
        { title: "Claude 3.5 Synthesis", desc: "Amazon Bedrock synthesizes strict grounded responses with source citations." }
      ]
    },
    githubUrl: "https://github.com/aws-sbg-vpkbiet/bedrock-campus-rag",
    demoUrl: "https://rag.vpkbiet.ac.in",
    contributors: ["Aditya K. (AI Lead)", "Omkar (Architect)", "Neha P. (Full Stack)"]
  }
];

export const MEMBERS_DATA = [
  {
    id: "mem-faculty-advisor",
    name: "Dr. Sachin S. Patil",
    role: "Faculty Advisor & Institutional Mentor",
    tier: "Faculty Coordination",
    domain: "Advisory & Institutional",
    bio: "Guiding AWS SBG VPKBIET student builders with academic alignment, cloud curriculum integration, and institutional infrastructure support.",
    branch: "Department of Computer Engineering",
    year: "Faculty / Associate Professor",
    certifications: ["AWS Academy Accredited Educator", "PhD in Distributed Cloud Systems"],
    avatarColor: "#FF9900",
    skills: ["Distributed Systems", "Cloud Governance", "Research Guidance"],
    github: "https://github.com/vpkbiet-cloud",
    linkedin: "https://linkedin.com/in/dr-sachin-patil-vpkbiet"
  },
  {
    id: "mem-omkar-deshmukh",
    name: "Omkar S. Deshmukh",
    role: "Student Community Lead & Cloud Architect",
    tier: "Team Leadership",
    domain: "Executive & Architecture",
    bio: "Full-stack cloud engineer and AI/ML builder coordinating technical roadmaps, hands-on AWS bootcamps, and regional open-source initiatives.",
    branch: "Computer Engineering",
    year: "TE (Third Year)",
    certifications: ["AWS Certified Solutions Architect – Associate", "AWS Certified AI Practitioner"],
    avatarColor: "#FF9900",
    skills: ["AWS Cloud Architecture", "Amazon Bedrock", "Full-Stack Web", "Serverless"],
    github: "https://github.com/omkar-deshmukh-builder",
    linkedin: "https://linkedin.com/in/omkar-deshmukh-cloud"
  },
  {
    id: "mem-pooja-jagtap",
    name: "Pooja N. Jagtap",
    role: "Cloud & DevOps Lead",
    tier: "Domain Leads",
    domain: "Cloud & DevOps",
    bio: "Specializes in Infrastructure as Code with AWS CDK and Terraform, multi-stage CI/CD deployment pipelines, and Docker containerization.",
    branch: "Computer Engineering",
    year: "TE (Third Year)",
    certifications: ["AWS Certified Solutions Architect – Associate", "Docker Certified"],
    avatarColor: "#00A4E4",
    skills: ["AWS CDK v2", "Terraform", "Docker", "AWS Lambda", "GitHub Actions"],
    github: "https://github.com/pooja-jagtap-devops",
    linkedin: "https://linkedin.com/in/pooja-jagtap-cloud"
  },
  {
    id: "mem-aditya-shinde",
    name: "Aditya K. Shinde",
    role: "AI & Machine Learning Lead",
    tier: "Domain Leads",
    domain: "AI & Machine Learning",
    bio: "Directs student AI hackathons, foundation model orchestration on Amazon Bedrock, and RAG architectures with vector databases.",
    branch: "AI & Data Science",
    year: "TE (Third Year)",
    certifications: ["AWS Certified AI Practitioner", "PyTorch Specialist"],
    avatarColor: "#8B5CF6",
    skills: ["Amazon Bedrock", "Python", "LangChain", "OpenSearch Vector DB"],
    github: "https://github.com/aditya-shinde-ai",
    linkedin: "https://linkedin.com/in/aditya-shinde-aiml"
  },
  {
    id: "mem-neha-patil",
    name: "Neha R. Patil",
    role: "Software Engineering Lead",
    tier: "Domain Leads",
    domain: "Software Engineering",
    bio: "Full-stack developer architecting reactive web applications, GraphQL interfaces with AWS AppSync, and DynamoDB single-table designs.",
    branch: "Information Technology",
    year: "TE (Third Year)",
    certifications: ["AWS Certified Developer – Associate (In Prep)"],
    avatarColor: "#06B6D4",
    skills: ["Next.js / React", "TypeScript", "AWS AppSync", "Amazon DynamoDB"],
    github: "https://github.com/neha-patil-code",
    linkedin: "https://linkedin.com/in/neha-patil-swe"
  },
  {
    id: "mem-tanvi-joshi",
    name: "Tanvi V. Joshi",
    role: "Creative Tech & UI/UX Lead",
    tier: "Domain Leads",
    domain: "UI/UX & Creative Tech",
    bio: "Crafting premium design systems, accessible developer console interfaces, 3D WebGL user interactions, and visual brand identity.",
    branch: "Computer Engineering",
    year: "SE (Second Year)",
    certifications: ["Google UX Design Professional"],
    avatarColor: "#EC4899",
    skills: ["Figma Design Systems", "Three.js / WebGL", "Vanilla CSS", "Wireframing"],
    github: "https://github.com/tanvi-joshi-ui",
    linkedin: "https://linkedin.com/in/tanvi-joshi-design"
  },
  {
    id: "mem-sanket-ghadge",
    name: "Sanket M. Ghadge",
    role: "Data & Telemetry Lead",
    tier: "Domain Leads",
    domain: "Data & Analytics",
    bio: "Architecting real-time streaming telemetry pipelines with AWS IoT Greengrass, Amazon Timestream, Glue ETL, and QuickSight dashboards.",
    branch: "Computer Engineering",
    year: "TE (Third Year)",
    certifications: ["AWS Certified Data Analytics (In Prep)"],
    avatarColor: "#06B6D4",
    skills: ["Amazon Athena", "AWS Glue", "Amazon Timestream", "QuickSight"],
    github: "https://github.com/sanket-ghadge-data",
    linkedin: "https://linkedin.com/in/sanket-ghadge-data"
  },
  {
    id: "mem-prashant-thorat",
    name: "Prashant B. Thorat",
    role: "Cloud Security & DevRel Lead",
    tier: "Domain Leads",
    domain: "Community & DevRel",
    bio: "DevRel speaker and cloud security enthusiast. Focuses on IAM least-privilege policies, CloudWatch anomaly alerting, and student workshops.",
    branch: "Computer Engineering",
    year: "TE (Third Year)",
    certifications: ["AWS Certified Cloud Practitioner", "HashiCorp Terraform Associate"],
    avatarColor: "#10B981",
    skills: ["Cloud Security", "AWS IAM", "Technical Writing", "Public Speaking"],
    github: "https://github.com/prashant-thorat-cloud",
    linkedin: "https://linkedin.com/in/prashant-thorat-devrel"
  },
  {
    id: "mem-kavita-salunkhe",
    name: "Kavita D. Salunkhe",
    role: "Events & Operations Lead",
    tier: "Domain Leads",
    domain: "Events & Operations",
    bio: "Managing student hackathon logistics, certification study groups, community Discord engagement, and technical workshop execution.",
    branch: "Computer Engineering",
    year: "SE (Second Year)",
    certifications: ["AWS Skill Builder Active Participant"],
    avatarColor: "#F59E0B",
    skills: ["Event Management", "Agile Coordination", "Community Engagement"],
    github: "https://github.com/kavita-salunkhe-ops",
    linkedin: "https://linkedin.com/in/kavita-salunkhe-community"
  }
];

export const UPCOMING_EVENTS = [
  {
    id: "aws-community-day-prep",
    title: "AWS Community Day & Cloud Practitioner Bootcamp",
    date: "OCTOBER 14, 2026",
    time: "10:00 AM - 4:00 PM IST",
    location: "VPKBIET Main Auditorium & Live Stream",
    type: "Flagship Bootcamp",
    badge: "Hands-on Lab",
    description: "Intensive 1-day crash course covering AWS Global Infrastructure, IAM best practices, VPC networking, and free voucher distribution for AWS Certified Cloud Practitioner.",
    agenda: ["09:30 AM - Welcome Keynote by AWS Community Hero", "10:30 AM - Architecture Foundations: EC2, S3, & RDS", "01:00 PM - Hands-on Lab: Deploy your first Serverless API", "03:00 PM - Certification Exam Strategy & Voucher Quiz"],
    rsvpLink: "#onboarding"
  },
  {
    id: "genai-bedrock-hackathon",
    title: "BuildOn AI: Amazon Bedrock 24-Hour Hackathon",
    date: "NOVEMBER 06 - 07, 2026",
    time: "Overnight Hackathon",
    location: "Computer Dept Labs, VPKBIET",
    type: "Hackathon",
    badge: "$1,500 AWS Credits",
    description: "Design and deploy GenAI solutions tackling regional agriculture, healthcare, or education challenges using Claude 3.5, Llama 3, and Titan models on Amazon Bedrock.",
    agenda: ["Track 1: Smart Agriculture & Rural Development", "Track 2: Local Commerce & Queue-Busting", "Track 3: Intelligent Campus Automation"],
    rsvpLink: "#onboarding"
  },
  {
    id: "serverless-microservices-deepdive",
    title: "Mastering AWS Lambda & EventBridge Architecture",
    date: "NOVEMBER 21, 2026",
    time: "3:00 PM - 5:30 PM IST",
    location: "Virtual Hands-on Workshop (Discord Stage)",
    type: "Virtual Workshop",
    badge: "Intermediate",
    description: "Deep dive into decoupled microservice architectures using EventBridge Pipes, Step Functions, and DynamoDB single-table design.",
    agenda: ["Event-Driven Mindset vs REST Monoliths", "DynamoDB Partition Key Strategies", "Live CDK Deployment with TypeScript"],
    rsvpLink: "#onboarding"
  }
];

export const PAST_WORKSHOPS = [
  {
    title: "Docker to AWS ECS & Fargate in 90 Minutes",
    date: "August 2026",
    speaker: "Omkar (SBG Lead) & AWS User Group Pune",
    slidesUrl: "#",
    repoUrl: "https://github.com/aws-sbg-vpkbiet/workshop-ecs-fargate",
    recordingUrl: "#",
    attendees: 110
  },
  {
    title: "Securing the Cloud: IAM Policies, MFA & Least Privilege",
    date: "July 2026",
    speaker: "VPKBIET Cloud Security Alumni",
    slidesUrl: "#",
    repoUrl: "https://github.com/aws-sbg-vpkbiet/workshop-iam-hardening",
    recordingUrl: "#",
    attendees: 95
  },
  {
    title: "Intro to Cloud Architecture & AWS Free Tier Zero-Dollar Mastery",
    date: "June 2026",
    speaker: "AWS Student Builder Team",
    slidesUrl: "#",
    repoUrl: "https://github.com/aws-sbg-vpkbiet/aws-free-tier-starter",
    recordingUrl: "#",
    attendees: 160
  }
];

export const BADGES_DATA = [
  {
    id: "cloud-explorer",
    name: "Cloud Explorer",
    tier: "Tier 1: Novice",
    gradient: "linear-gradient(135deg, #00A4E4 0%, #0284C7 100%)",
    glowColor: "rgba(0, 164, 228, 0.4)",
    icon: "Compass",
    criteria: "Attend at least 2 SBG hands-on workshops and register your AWS Skill Builder ID.",
    perks: "Access to private Discord engineering channels & starter CloudFormation templates.",
    status: "Open to all students"
  },
  {
    id: "serverless-builder",
    name: "Serverless Builder",
    tier: "Tier 2: Intermediate",
    gradient: "linear-gradient(135deg, #FF9900 0%, #D97706 100%)",
    glowColor: "rgba(255, 153, 0, 0.4)",
    icon: "Zap",
    criteria: "Deploy a production full-stack serverless app on AWS Amplify or Lambda + write a technical dev.to writeup.",
    perks: "Priority selection for AWS Community Day student sponsorships & $100 AWS Credit vouchers.",
    status: "28 Active Holders"
  },
  {
    id: "baramati-innovator",
    name: "Baramati Innovator",
    tier: "Tier 3: Advanced",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    glowColor: "rgba(16, 185, 129, 0.4)",
    icon: "Sprout",
    criteria: "Contribute code or architecture to an approved regional impact project (EcoNutri AI, SkipShop AI).",
    perks: "Induction into the VPKBIET Innovation Wall of Fame + 1-on-1 industry mentor session.",
    status: "9 Certified Champions"
  },
  {
    id: "solutions-apprentice",
    name: "Solutions Architect Apprentice",
    tier: "Tier 4: Elite",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    glowColor: "rgba(139, 92, 246, 0.4)",
    icon: "Award",
    criteria: "Earn an official AWS Certification (Cloud Practitioner, AI Practitioner, or Solutions Architect Associate).",
    perks: "Lead workshop instructor status, club leadership eligibility, and official recommendation letters.",
    status: "15 VPKBIET Achievers"
  }
];

export const SCOUT_KNOWLEDGE = {
  greetings: [
    "Hello Builder! I'm **SBG Scout**, your AI cloud mentor for AWS Student Builder Group at VPKBIET Baramati. How can I assist your cloud journey today?",
    "Welcome to AWS SBG VPKBIET! I'm **SBG Scout**. Whether you want to know about our Baramati regional projects, upcoming hackathons, or AWS certifications, ask away!"
  ],
  topics: {
    join: "### How to Join AWS SBG VPKBIET\nJoining is simple and free for all VPKBIET students:\n1. Scroll down to our **Recruitment Portal** on this page (or click **Join SBG** in the navbar).\n2. Complete the 4-step wizard: Verify your Student PRN, select your technical track (Cloud DevOps, GenAI, Web Systems, or DevRel), and paste your AWS Builder ID.\n3. Upon submission, you will instantly receive an invite link to our private Discord engineering channels and our starter AWS CDK kit!",
    
    econutri: "### EcoNutri AI (Baramati Regional Impact)\n**EcoNutri AI** is our precision agriculture initiative developed by VPKBIET student builders:\n- **Problem:** Farmers in the Baramati agricultural belt face declining soil health due to over-fertilization.\n- **Architecture:** Solar ESP32 IoT sensors -> **AWS IoT Core** -> **AWS Lambda** -> **Amazon DynamoDB** -> **Amazon Bedrock (Claude 3.5 Sonnet)**.\n- **Outcome:** Generates customized fertilizer advisories in Marathi sent via SMS, already reducing fertilizer costs by 22% across 45+ local test farms!",
    
    skipshop: "### SkipShop AI (Autonomous Retail)\n**SkipShop AI** is our smart checkout system designed for college marts and local grocery stores:\n- **Tech Stack:** Edge computer-vision cameras + **Amazon Rekognition** + **AWS AppSync GraphQL** + **DynamoDB**.\n- **Performance:** Reduces checkout time from minutes to **4.5 seconds** per shopper with 99.2% object accuracy.",
    
    certifications: "### AWS Certification Roadmap for Students\nWe recommend following this proven pathway:\n1. **AWS Certified Cloud Practitioner (CLF-C02):** Foundational. Covers cloud fundamentals, security, and pricing. (We run free bootcamps and share voucher opportunities!)\n2. **AWS Certified AI Practitioner (AIF-C01):** Ideal for students focusing on GenAI, Bedrock, and SageMaker.\n3. **AWS Certified Solutions Architect – Associate (SAA-C03):** Industry gold-standard. Deep dive into VPC, HA architectures, and resiliency.\n\nVisit our `/community` section for past workshop slides and mock exam repos.",
    
    events: "### Upcoming SBG VPKBIET Events\n1. **AWS Community Day & Cloud Practitioner Bootcamp** - Oct 14, 2026 at VPKBIET Auditorium.\n2. **BuildOn AI: Amazon Bedrock 24-Hour Hackathon** - Nov 06–07, 2026 (With $1,500 AWS Credits pool).\n3. **Mastering AWS Lambda & EventBridge Architecture** - Nov 21, 2026 (Virtual workshop).\n\nCheck the **Events & Knowledge Hub** section on this page to RSVP!",
    
    values: "### AWS SBG VPKBIET Core Pillars\n1. **Innovation:** Building real systems, not just theoretical models.\n2. **Hands-on Learning:** Every session features live code, terminal CLI, and architecture diagrams.\n3. **Eco-Sustainability:** Developing green tech for Baramati's agriculture, solar grids, and smart campus.\n4. **AWS Proficiency:** Mastering industry cloud architectures on the AWS global backbone."
  }
};

export const DOMAINS_DATA = [
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    shortDesc: "Cloud-native architectures, infrastructure as code, serverless computing, and CI/CD automation.",
    technologies: ["AWS Cloud", "Docker", "Terraform", "AWS CDK", "GitHub Actions", "Lambda"],
    responsibilities: [
      "Architecting resilient, cost-effective AWS infrastructure",
      "Managing multi-environment deployment pipelines",
      "Conducting cloud architecture reviews and Well-Architected labs"
    ],
    leadPlaceholder: "Domain Lead — Cloud & DevOps",
    status: "Active Domain"
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    shortDesc: "Generative AI applications, foundation models on Amazon Bedrock, and applied deep learning.",
    technologies: ["Amazon Bedrock", "SageMaker", "Python", "LangChain", "Vector DBs", "PyTorch"],
    responsibilities: [
      "Prototyping generative AI applications with LLMs and RAG",
      "Exploring computer vision and natural language processing models",
      "Hosting AI hands-on hackathons and model tuning workshops"
    ],
    leadPlaceholder: "Domain Lead — AI & ML",
    status: "Active Domain"
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    shortDesc: "Modern data pipelines, stream processing, data warehousing, and telemetry visualization.",
    technologies: ["Amazon Athena", "AWS Glue", "Kinesis", "PostgreSQL", "Amazon QuickSight"],
    responsibilities: [
      "Designing scalable data ingestion pipelines",
      "Managing analytical datasets and cloud queries",
      "Building real-time telemetry dashboards"
    ],
    leadPlaceholder: "Domain Lead — Data & Analytics",
    status: "Active Domain"
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    shortDesc: "Full-stack web applications, microservices, distributed systems, and API design.",
    technologies: ["TypeScript", "Next.js", "Node.js", "AWS AppSync", "GraphQL", "DynamoDB"],
    responsibilities: [
      "Building robust community web platforms and tools",
      "Developing event-driven microservices",
      "Maintaining technical documentation and code standards"
    ],
    leadPlaceholder: "Domain Lead — Software Engineering",
    status: "Active Domain"
  },
  {
    id: "open-source",
    name: "Open Source & Systems",
    shortDesc: "Open-source development, community toolkits, starter templates, and Linux systems.",
    technologies: ["Git", "Linux", "Rust", "Go", "OpenSSF", "Markdown"],
    responsibilities: [
      "Maintaining official community open-source repositories",
      "Guiding students through their first pull requests",
      "Promoting open collaboration and permissive licensing"
    ],
    leadPlaceholder: "Domain Lead — Open Source",
    status: "Active Domain"
  },
  {
    id: "ui-ux",
    name: "UI/UX & Creative Tech",
    shortDesc: "Design systems, accessible interfaces, human-computer interaction, and technical branding.",
    technologies: ["Figma", "Design Tokens", "CSS3 / Canvas", "Three.js", "Tailwind", "Motion"],
    responsibilities: [
      "Designing intuitive user experiences and design systems",
      "Creating interactive data visualizations and diagrams",
      "Ensuring high accessibility and responsive visual consistency"
    ],
    leadPlaceholder: "Domain Lead — UI/UX",
    status: "Active Domain"
  },
  {
    id: "community-devrel",
    name: "Community & DevRel",
    shortDesc: "Developer advocacy, technical writing, workshop facilitation, and student outreach.",
    technologies: ["Technical Writing", "Public Speaking", "Community Ops", "Discord", "Dev.to"],
    responsibilities: [
      "Organizing technical talks and industry speaker sessions",
      "Writing tutorials and workshop documentation",
      "Engaging new student builders and fostering inclusion"
    ],
    leadPlaceholder: "Domain Lead — Community & DevRel",
    status: "Active Domain"
  },
  {
    id: "events-operations",
    name: "Events & Operations",
    shortDesc: "Hackathon logistics, venue coordination, timeline management, and builder onboarding.",
    technologies: ["Agile Planning", "Event Tooling", "Notion", "Logistics", "Operations"],
    responsibilities: [
      "Planning end-to-end event execution and participant support",
      "Managing student hackathon logistics and schedules",
      "Coordinating institutional facilities and certifications"
    ],
    leadPlaceholder: "Domain Lead — Events & Operations",
    status: "Active Domain"
  }
];

