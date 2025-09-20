// Sample data for the prototype
let ideas = [
    {
        id: 1,
        title: "Smart Home Integration Platform",
        category: "living",
        scope: "internal",
        description: "Develop an integrated platform that connects all smart home devices, creating seamless living experiences for our customers.",
        impact: "Expected to increase customer engagement by 60% and create new revenue streams through smart home partnerships.",
        implementation: "Phase 1: Partner with IoT device manufacturers. Phase 2: Develop unified app interface. Phase 3: Launch with pilot customers.",
        author: "Sarah Johnson",
        department: "Engineering",
        date: "2024-01-15",
        votes: 45,
        comments: 12,
        financialImpact: 250000
    },
    {
        id: 2,
        title: "AI-Powered Health Monitoring Service",
        category: "new-business",
        scope: "spin-off",
        description: "Launch a new business line offering AI-powered health monitoring services for elderly care and chronic disease management.",
        impact: "Open new market segment worth $2B annually, targeting aging population and healthcare providers.",
        implementation: "Develop AI algorithms, partner with healthcare providers, obtain necessary certifications, and launch pilot program.",
        author: "Mike Chen",
        department: "Product",
        date: "2024-01-12",
        votes: 38,
        comments: 8,
        financialImpact: 1800000
    },
    {
        id: 3,
        title: "Community Impact Investment Fund",
        category: "community",
        scope: "spin-off",
        description: "Create a community investment fund that supports local businesses and social enterprises in underserved areas.",
        impact: "Strengthen community relationships, improve brand reputation, and generate positive social impact while maintaining financial returns.",
        implementation: "Establish fund structure, partner with community organizations, develop investment criteria, and launch with initial $5M capital.",
        author: "Emily Rodriguez",
        department: "Operations",
        date: "2024-01-10",
        votes: 52,
        comments: 15,
        financialImpact: 500000
    },
    {
        id: 4,
        title: "Sustainable Living Marketplace",
        category: "living",
        scope: "spin-off",
        description: "Create an online marketplace focused on sustainable living products, connecting eco-conscious consumers with green businesses.",
        impact: "Tap into growing sustainability market, improve brand positioning, and create new revenue streams through marketplace fees.",
        implementation: "Develop platform, onboard sustainable product suppliers, implement verification processes, and launch marketing campaign.",
        author: "David Kim",
        department: "Sales",
        date: "2024-01-08",
        votes: 41,
        comments: 9,
        financialImpact: 320000
    },
    {
        id: 5,
        title: "Digital Skills Training Program",
        category: "community",
        scope: "internal",
        description: "Launch free digital skills training programs for underserved communities, focusing on technology literacy and job readiness.",
        impact: "Strengthen community ties, improve brand reputation, and potentially identify future talent while addressing digital divide.",
        implementation: "Partner with community centers, develop curriculum, recruit volunteer instructors, and establish measurement framework.",
        author: "Lisa Wang",
        department: "HR",
        date: "2024-01-05",
        votes: 29,
        comments: 6,
        financialImpact: 150000
    }
];

let currentUser = {
    name: "John Doe",
    department: "Engineering",
    avatar: "JD"
};

let userVotes = new Set();
let comments = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadIdeas();
    setupEventListeners();
    updateStats();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            showSection(target);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Idea form submission
    document.getElementById('ideaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitIdea();
    });

    // Filter controls
    document.getElementById('categoryFilter').addEventListener('change', filterIdeas);
    document.getElementById('scopeFilter').addEventListener('change', filterIdeas);
    document.getElementById('sortFilter').addEventListener('change', sortIdeas);

    // Leaderboard tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchLeaderboardTab(tab);
        });
    });

    // Leaderboard filters
    document.getElementById('leaderboardThemeFilter').addEventListener('change', filterLeaderboard);
    document.getElementById('leaderboardDepartmentFilter').addEventListener('change', filterLeaderboard);
    document.getElementById('leaderboardTimeFilter').addEventListener('change', filterLeaderboard);
    document.getElementById('leaderboardSortFilter').addEventListener('change', sortLeaderboard);

    // Program category tabs
    document.querySelectorAll('.category-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchProgramCategory(category);
            
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Modal close on outside click
    document.getElementById('ideaModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    document.getElementById('programModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProgramModal();
        }
    });
}

// Show/hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Show idea form
function showIdeaForm() {
    document.getElementById('idea-form').style.display = 'block';
    document.getElementById('idea-form').scrollIntoView({ behavior: 'smooth' });
}

// Hide idea form
function hideIdeaForm() {
    document.getElementById('idea-form').style.display = 'none';
    document.getElementById('ideaForm').reset();
}

// Submit new idea
function submitIdea() {
    const formData = new FormData(document.getElementById('ideaForm'));
    
    const newIdea = {
        id: ideas.length + 1,
        title: formData.get('title'),
        category: formData.get('category'),
        scope: formData.get('scope'),
        description: formData.get('description'),
        impact: formData.get('impact'),
        implementation: formData.get('implementation'),
        author: currentUser.name,
        department: currentUser.department,
        date: new Date().toISOString().split('T')[0],
        votes: 0,
        comments: 0,
        financialImpact: Math.floor(Math.random() * 500000) + 50000 // Random for demo
    };
    
    ideas.unshift(newIdea); // Add to beginning
    loadIdeas();
    hideIdeaForm();
    
    // Show success message
    showMessage('Idea submitted successfully!', 'success');
}

// Load ideas into the grid
function loadIdeas() {
    const grid = document.getElementById('ideasGrid');
    grid.innerHTML = '';
    
    ideas.forEach(idea => {
        const ideaCard = createIdeaCard(idea);
        grid.appendChild(ideaCard);
    });
}

// Create idea card element
function createIdeaCard(idea) {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.onclick = () => openIdeaModal(idea);
    
    const categoryLabels = {
        'living': 'Living',
        'new-business': 'New Business Horizons',
        'community': 'Community Centricity'
    };
    
    const scopeLabels = {
        'internal': 'Internal Only',
        'spin-off': 'Spin-off Opportunity'
    };
    
    card.innerHTML = `
        <div class="idea-header">
            <div>
                <div class="idea-title">${idea.title}</div>
                <div class="idea-category">${categoryLabels[idea.category]}</div>
                <div class="idea-scope">${scopeLabels[idea.scope]}</div>
            </div>
        </div>
        <div class="idea-description">${idea.description}</div>
        <div class="idea-meta">
            <span>By ${idea.author}</span>
            <span>${formatDate(idea.date)}</span>
        </div>
        <div class="idea-actions">
            <button class="vote-btn" onclick="event.stopPropagation(); voteIdea(${idea.id})">
                <i class="fas fa-thumbs-up"></i>
                <span>${idea.votes}</span>
            </button>
            <button class="comment-btn" onclick="event.stopPropagation(); openIdeaModal(${idea.id})">
                <i class="fas fa-comment"></i>
                <span>${idea.comments}</span>
            </button>
        </div>
    `;
    
    return card;
}

// Open idea modal
function openIdeaModal(ideaId) {
    const idea = typeof ideaId === 'number' ? ideas.find(i => i.id === ideaId) : ideaId;
    if (!idea) return;
    
    const modal = document.getElementById('ideaModal');
    const categoryLabels = {
        'living': 'Living',
        'new-business': 'New Business Horizons',
        'community': 'Community Centricity'
    };
    
    const scopeLabels = {
        'internal': 'Internal Only',
        'spin-off': 'Spin-off Opportunity'
    };
    
    document.getElementById('modalTitle').textContent = idea.title;
    document.getElementById('modalCategory').textContent = categoryLabels[idea.category];
    document.getElementById('modalScope').textContent = scopeLabels[idea.scope];
    document.getElementById('modalAuthor').textContent = `By ${idea.author}`;
    document.getElementById('modalDate').textContent = formatDate(idea.date);
    document.getElementById('modalDescription').textContent = idea.description;
    document.getElementById('modalImpact').textContent = idea.impact;
    document.getElementById('modalImplementation').textContent = idea.implementation;
    document.getElementById('voteCount').textContent = idea.votes;
    document.getElementById('commentCount').textContent = idea.comments;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    document.getElementById('ideaModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Vote for idea
function voteIdea(ideaId) {
    if (userVotes.has(ideaId)) {
        showMessage('You have already voted for this idea!', 'error');
        return;
    }
    
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
        idea.votes++;
        userVotes.add(ideaId);
        loadIdeas();
        showMessage('Thank you for voting!', 'success');
    }
}

// Toggle comments section
function toggleComments() {
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

// Filter ideas by category and scope
function filterIdeas() {
    const category = document.getElementById('categoryFilter').value;
    const scope = document.getElementById('scopeFilter').value;
    
    let filteredIdeas = ideas;
    
    if (category) {
        filteredIdeas = filteredIdeas.filter(idea => idea.category === category);
    }
    
    if (scope) {
        filteredIdeas = filteredIdeas.filter(idea => idea.scope === scope);
    }
    
    const grid = document.getElementById('ideasGrid');
    grid.innerHTML = '';
    
    filteredIdeas.forEach(idea => {
        const ideaCard = createIdeaCard(idea);
        grid.appendChild(ideaCard);
    });
}

// Sort ideas
function sortIdeas() {
    const sortBy = document.getElementById('sortFilter').value;
    let sortedIdeas = [...ideas];
    
    switch(sortBy) {
        case 'popular':
            sortedIdeas.sort((a, b) => b.votes - a.votes);
            break;
        case 'impact':
            sortedIdeas.sort((a, b) => b.financialImpact - a.financialImpact);
            break;
        case 'recent':
        default:
            sortedIdeas.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
    
    const grid = document.getElementById('ideasGrid');
    grid.innerHTML = '';
    
    sortedIdeas.forEach(idea => {
        const ideaCard = createIdeaCard(idea);
        grid.appendChild(ideaCard);
    });
}

// Switch leaderboard tab
function switchLeaderboardTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // For demo purposes, we'll just show the individual leaderboard
    // In a real app, you'd load different data based on the tab
}

// Update stats
function updateStats() {
    const totalIdeas = ideas.length;
    const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
    const totalParticipants = new Set(ideas.map(idea => idea.author)).size;
    
    document.querySelector('.stat:nth-child(1) .stat-number').textContent = totalIdeas;
    document.querySelector('.stat:nth-child(2) .stat-number').textContent = totalVotes;
    document.querySelector('.stat:nth-child(3) .stat-number').textContent = totalParticipants;
}

// Show message
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the main content
    const main = document.querySelector('.main');
    main.insertBefore(message, main.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Generate sample leaderboard data
function generateLeaderboardData() {
    const departments = ['Engineering', 'Product', 'Sales', 'Marketing', 'HR', 'Operations'];
    const names = ['John Doe', 'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Wang', 'Alex Thompson', 'Maria Garcia', 'James Wilson', 'Anna Martinez'];
    const themes = ['Living', 'New Business Horizons', 'Community Centricity'];
    const themeKeys = ['living', 'new-business', 'community'];
    
    return names.map((name, index) => {
        const themeIndex = Math.floor(Math.random() * themes.length);
        const recentActivity = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within last 30 days
        
        return {
            name: name,
            department: departments[index % departments.length],
            ideas: Math.floor(Math.random() * 20) + 5,
            votes: Math.floor(Math.random() * 300) + 50,
            impact: Math.floor(Math.random() * 3000000) + 500000, // Raw number for sorting
            impactFormatted: `$${(Math.random() * 3 + 0.5).toFixed(1)}M`,
            topTheme: themes[themeIndex],
            topThemeKey: themeKeys[themeIndex],
            recentActivity: recentActivity,
            ideasThisMonth: Math.floor(Math.random() * 5),
            votesThisMonth: Math.floor(Math.random() * 50)
        };
    }).sort((a, b) => b.votes - a.votes);
}

let leaderboardData = generateLeaderboardData();

// Load leaderboard
function loadLeaderboard(data = leaderboardData) {
    const leaderboardList = document.querySelector('.leaderboard-list');
    
    leaderboardList.innerHTML = '';
    
    data.forEach((person, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        
        item.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="user-info">
                <div class="avatar">${person.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="details">
                    <span class="name">${person.name}</span>
                    <span class="department">${person.department}</span>
                    <span class="top-theme">Top Theme: ${person.topTheme}</span>
                </div>
            </div>
            <div class="metrics">
                <div class="metric">
                    <span class="value">${person.ideas}</span>
                    <span class="label">Ideas</span>
                </div>
                <div class="metric">
                    <span class="value">${person.votes}</span>
                    <span class="label">Votes</span>
                </div>
                <div class="metric">
                    <span class="value">${person.impactFormatted}</span>
                    <span class="label">Impact</span>
                </div>
            </div>
        `;
        
        leaderboardList.appendChild(item);
    });
}

// Filter leaderboard
function filterLeaderboard() {
    const themeFilter = document.getElementById('leaderboardThemeFilter').value;
    const departmentFilter = document.getElementById('leaderboardDepartmentFilter').value;
    const timeFilter = document.getElementById('leaderboardTimeFilter').value;
    
    let filteredData = [...leaderboardData];
    
    // Filter by theme
    if (themeFilter) {
        filteredData = filteredData.filter(person => person.topThemeKey === themeFilter);
    }
    
    // Filter by department
    if (departmentFilter) {
        filteredData = filteredData.filter(person => person.department === departmentFilter);
    }
    
    // Filter by time period
    if (timeFilter !== 'all-time') {
        const now = new Date();
        const filterDate = new Date();
        
        switch(timeFilter) {
            case 'this-year':
                filterDate.setMonth(0, 1);
                break;
            case 'this-quarter':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                filterDate.setMonth(currentQuarter * 3, 1);
                break;
            case 'this-month':
                filterDate.setDate(1);
                break;
        }
        
        filteredData = filteredData.filter(person => person.recentActivity >= filterDate);
    }
    
    // Apply current sort
    const sortBy = document.getElementById('leaderboardSortFilter').value;
    filteredData = sortLeaderboardData(filteredData, sortBy);
    
    loadLeaderboard(filteredData);
}

// Sort leaderboard
function sortLeaderboard() {
    const sortBy = document.getElementById('leaderboardSortFilter').value;
    const themeFilter = document.getElementById('leaderboardThemeFilter').value;
    const departmentFilter = document.getElementById('leaderboardDepartmentFilter').value;
    const timeFilter = document.getElementById('leaderboardTimeFilter').value;
    
    let dataToSort = [...leaderboardData];
    
    // Apply filters first
    if (themeFilter) {
        dataToSort = dataToSort.filter(person => person.topThemeKey === themeFilter);
    }
    if (departmentFilter) {
        dataToSort = dataToSort.filter(person => person.department === departmentFilter);
    }
    if (timeFilter !== 'all-time') {
        const now = new Date();
        const filterDate = new Date();
        
        switch(timeFilter) {
            case 'this-year':
                filterDate.setMonth(0, 1);
                break;
            case 'this-quarter':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                filterDate.setMonth(currentQuarter * 3, 1);
                break;
            case 'this-month':
                filterDate.setDate(1);
                break;
        }
        
        dataToSort = dataToSort.filter(person => person.recentActivity >= filterDate);
    }
    
    // Apply sorting
    dataToSort = sortLeaderboardData(dataToSort, sortBy);
    loadLeaderboard(dataToSort);
}

// Sort leaderboard data
function sortLeaderboardData(data, sortBy) {
    return data.sort((a, b) => {
        switch(sortBy) {
            case 'votes':
                return b.votes - a.votes;
            case 'ideas':
                return b.ideas - a.ideas;
            case 'impact':
                return b.impact - a.impact;
            case 'recent':
                return b.recentActivity - a.recentActivity;
            default:
                return b.votes - a.votes;
        }
    });
}

// Program data
const programs = {
    'solution-design': {
        title: 'Solution Design',
        status: 'active',
        description: 'Master the art of designing comprehensive solutions that address real business challenges and create value. This program covers systematic approaches to solution architecture, user experience design, and implementation planning.',
        schedule: [
            { week: 1, topic: 'Understanding Problem-Solution Fit', date: 'March 1, 2024', time: '2:00 PM - 4:30 PM' },
            { week: 2, topic: 'Solution Architecture Fundamentals', date: 'March 8, 2024', time: '2:00 PM - 4:30 PM' },
            { week: 3, topic: 'User Experience & Interface Design', date: 'March 15, 2024', time: '2:00 PM - 4:30 PM' },
            { week: 4, topic: 'Technical Feasibility & Constraints', date: 'March 22, 2024', time: '2:00 PM - 4:30 PM' },
            { week: 5, topic: 'Implementation Planning & Roadmaps', date: 'March 29, 2024', time: '2:00 PM - 4:30 PM' },
            { week: 6, topic: 'Solution Validation & Testing', date: 'April 5, 2024', time: '2:00 PM - 4:30 PM' }
        ],
        curriculum: [
            { module: 'Module 1', title: 'Problem Analysis', description: 'Deep dive into problem understanding and solution requirements' },
            { module: 'Module 2', title: 'Design Thinking', description: 'Human-centered design principles and methodologies' },
            { module: 'Module 3', title: 'Solution Architecture', description: 'System design and technical architecture planning' },
            { module: 'Module 4', title: 'User Experience', description: 'UX/UI design principles and best practices' },
            { module: 'Module 5', title: 'Implementation Strategy', description: 'Planning and executing solution delivery' },
            { module: 'Module 6', title: 'Validation & Iteration', description: 'Testing, feedback, and continuous improvement' }
        ]
    },
    'prototyping': {
        title: 'Prototyping',
        status: 'upcoming',
        description: 'Learn rapid prototyping techniques to quickly test and validate ideas before full implementation. Master both digital and physical prototyping methods to accelerate innovation cycles.',
        schedule: [
            { week: 1, topic: 'Prototyping Fundamentals & Tools', date: 'March 20, 2024', time: '2:00 PM - 5:00 PM' },
            { week: 2, topic: 'Digital Prototyping & Wireframing', date: 'March 27, 2024', time: '2:00 PM - 5:00 PM' },
            { week: 3, topic: 'Physical Prototyping & 3D Modeling', date: 'April 3, 2024', time: '2:00 PM - 5:00 PM' },
            { week: 4, topic: 'User Testing & Iteration', date: 'April 10, 2024', time: '2:00 PM - 5:00 PM' }
        ],
        curriculum: [
            { module: 'Week 1', title: 'Prototyping Basics', description: 'Introduction to prototyping concepts and tools' },
            { module: 'Week 2', title: 'Digital Prototyping', description: 'Software tools and digital mockup techniques' },
            { module: 'Week 3', title: 'Physical Prototyping', description: 'Hands-on creation and 3D modeling' },
            { module: 'Week 4', title: 'Testing & Validation', description: 'User testing methodologies and iteration cycles' }
        ]
    },
    'stakeholder-mapping': {
        title: 'Stakeholder Mapping',
        status: 'upcoming',
        description: 'Identify, analyze, and engage stakeholders effectively to ensure innovation success and adoption. Learn to build stakeholder networks and manage complex relationships.',
        schedule: [
            { week: 1, topic: 'Stakeholder Identification & Analysis', date: 'April 15, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 2, topic: 'Power-Interest Mapping & Prioritization', date: 'April 22, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 3, topic: 'Engagement Strategies & Communication', date: 'April 29, 2024', time: '2:00 PM - 4:00 PM' }
        ],
        curriculum: [
            { module: 'Week 1', title: 'Stakeholder Analysis', description: 'Identifying and categorizing stakeholders' },
            { module: 'Week 2', title: 'Mapping & Prioritization', description: 'Power-interest matrices and influence mapping' },
            { module: 'Week 3', title: 'Engagement Planning', description: 'Communication strategies and relationship building' }
        ]
    },
    'problem-discovery': {
        title: 'Problem Discovery',
        status: 'completed',
        description: 'Master techniques for identifying, analyzing, and framing problems to drive meaningful innovation. Learn systematic approaches to problem research and validation.',
        schedule: [
            { week: 1, topic: 'Problem Identification Techniques', date: 'February 1, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 2, topic: 'Research Methods & Data Collection', date: 'February 8, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 3, topic: 'Problem Analysis & Root Cause Analysis', date: 'February 15, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 4, topic: 'Problem Framing & Opportunity Mapping', date: 'February 22, 2024', time: '2:00 PM - 4:00 PM' },
            { week: 5, topic: 'Validation & Prioritization', date: 'March 1, 2024', time: '2:00 PM - 4:00 PM' }
        ],
        curriculum: [
            { module: 'Week 1', title: 'Problem Identification', description: 'Techniques for discovering and defining problems' },
            { module: 'Week 2', title: 'Research Methods', description: 'Data collection and analysis techniques' },
            { module: 'Week 3', title: 'Problem Analysis', description: 'Root cause analysis and problem decomposition' },
            { module: 'Week 4', title: 'Problem Framing', description: 'Reframing problems as opportunities' },
            { module: 'Week 5', title: 'Validation', description: 'Testing problem assumptions and prioritizing opportunities' }
        ]
    }
};

// Program functions
function showProgramDetails(programId) {
    const program = programs[programId];
    if (!program) return;
    
    const modal = document.getElementById('programModal');
    
    document.getElementById('programModalTitle').textContent = program.title;
    document.getElementById('programModalDescription').textContent = program.description;
    
    // Set status badge
    const statusBadge = document.getElementById('programModalStatus');
    statusBadge.textContent = program.status;
    statusBadge.className = `program-status-badge ${program.status}`;
    
    // Load schedule
    const scheduleList = document.getElementById('programScheduleList');
    scheduleList.innerHTML = '';
    program.schedule.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <i class="fas fa-calendar"></i>
            <div>
                <strong>${item.week || item.day}: ${item.topic}</strong>
                <div>${item.date} at ${item.time}</div>
            </div>
        `;
        scheduleList.appendChild(scheduleItem);
    });
    
    // Load curriculum
    const curriculumList = document.getElementById('programCurriculumList');
    curriculumList.innerHTML = '';
    program.curriculum.forEach(item => {
        const curriculumItem = document.createElement('div');
        curriculumItem.className = 'curriculum-item';
        curriculumItem.innerHTML = `
            <i class="fas fa-book"></i>
            <div>
                <strong>${item.module}: ${item.title}</strong>
                <div>${item.description}</div>
            </div>
        `;
        curriculumList.appendChild(curriculumItem);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProgramModal() {
    document.getElementById('programModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function signUpProgram(programId) {
    const program = programs[programId];
    if (!program) return;
    
    showMessage(`Successfully signed up for ${program.title}!`, 'success');
}

function signUpProgramFromModal() {
    const programTitle = document.getElementById('programModalTitle').textContent;
    showMessage(`Successfully signed up for ${programTitle}!`, 'success');
    closeProgramModal();
}

function watchRecordings(programId) {
    const program = programs[programId];
    if (!program) return;
    
    showMessage(`Opening recordings for ${program.title}...`, 'success');
}

function addToCalendar() {
    showMessage('Calendar event added successfully!', 'success');
}

function switchProgramCategory(category) {
    // For demo purposes, we'll just show a message
    // In a real app, this would filter the programs by category
    const categoryNames = {
        'all': 'All Programs',
        'leadership': 'Leadership',
        'methodology': 'Methodology',
        'tools': 'Tools & Technology',
        'business': 'Business Strategy'
    };
    
    showMessage(`Filtering by ${categoryNames[category]}...`, 'success');
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
});
