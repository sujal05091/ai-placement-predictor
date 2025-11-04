// Mock Gemini Service (Fallback)
// Use this temporarily while setting up the real Gemini API

export const runChat = async (history = [], newMessage) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if it's a role explorer query (contains company/role keywords)
  if (newMessage.includes('Act as an expert career coach')) {
    return generateMockRoleExplorerResponse(newMessage);
  }
  
  return `This is a mock response. To use the real Gemini AI:

1. Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Enable the "Generative Language API"
3. Wait 1-2 minutes
4. Try again

Your message was: "${newMessage.substring(0, 100)}..."`;
};

function generateMockRoleExplorerResponse(prompt) {
  // Extract company and role from prompt
  const companyMatch = prompt.match(/work at "([^"]+)"/);
  const roleMatch = prompt.match(/as a "([^"]+)"/);
  
  const company = companyMatch ? companyMatch[1] : 'the company';
  const role = roleMatch ? roleMatch[1] : 'this role';
  
  return `### 1. Key Technical Skills Required
* **Programming Languages:** Python, JavaScript, SQL
* **Frameworks:** React, Node.js, Django
* **Tools:** Git, Docker, VS Code
* **Databases:** PostgreSQL, MongoDB, Redis
* **Cloud Platforms:** AWS, Azure, Google Cloud

### 2. Essential Soft Skills
* **Communication:** Ability to explain technical concepts to non-technical stakeholders
* **Problem-Solving:** Analytical thinking and debugging skills
* **Teamwork:** Collaboration with cross-functional teams
* **Time Management:** Prioritizing tasks and meeting deadlines
* **Adaptability:** Learning new technologies quickly

### 3. Recommended YouTube Learning Path
* **Topic:** Full Stack Development Basics
    * **Link:** [FreeCodeCamp - Full Course](https://www.youtube.com/watch?v=nu_pCVPKzTk)
* **Topic:** ${role} Interview Preparation
    * **Link:** [Tech Interview Handbook](https://www.youtube.com/c/TechInterviewHandbook)
* **Topic:** ${company} Engineering Culture
    * **Link:** [${company} Tech Talks](https://www.youtube.com/@GoogleTechTalks)

### 4. Suggested Online Courses
* **Course Name:** Complete ${role} Bootcamp 2024
    * **Platform:** Udemy
* **Course Name:** ${company} Professional Certificates
    * **Platform:** Coursera
* **Course Name:** Advanced ${role} Specialization
    * **Platform:** Coursera

### 5. Overall Analysis
Based on the role of **${role}** at **${company}**, you'll need a strong foundation in both technical and soft skills. The salary expectations are competitive for this role. Focus on building projects that demonstrate your skills, contribute to open source, and practice coding interviews regularly.

**Note:** This is a MOCK response. To get real AI-powered analysis:
1. Enable Generative Language API at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Update the import in RoleExplorerPage.jsx to use the real geminiService`;
}

export const runMockInterview = async (history = [], newMessage) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const message = newMessage.toLowerCase();
  
  // Generate contextual mock responses
  if (message.includes('begin') || message.includes('start') || message.includes('ready')) {
    return `Excellent! Let's start with a warm-up question.

**Question:** Tell me about yourself and why you're interested in software development?

Take your time to think about your answer. Focus on:
- Your educational background
- Relevant projects or experience
- What motivates you in tech
- Your career goals

*Note: This is a mock interview. Enable Generative Language API for real AI-powered interviews.*`;
  }
  
  if (message.includes('data structure') || message.includes('algorithm')) {
    return `Great topic! Here's a technical question:

**Question:** Can you explain the difference between an array and a linked list? When would you choose one over the other?

Think about:
- Memory allocation
- Access time complexity
- Insertion/deletion operations
- Real-world use cases

*Mock response - Enable the API for dynamic AI questions*`;
  }
  
  if (message.includes('project')) {
    return `That's a good start! Let me ask a follow-up:

**Question:** What was the biggest technical challenge you faced in that project, and how did you overcome it?

Interviewers love to hear about:
- Problem-solving approach
- Technical decisions
- Learning from challenges
- Team collaboration

*Mock interview mode - Get real AI feedback by enabling the API*`;
  }
  
  // Default response
  return `Thank you for that response! Here's my feedback:

**Strengths:**
- Good communication
- Clear thought process
- Relevant examples

**Areas to improve:**
- Add more specific technical details
- Quantify your achievements
- Connect your answer to the role

**Next Question:** Can you describe a time when you had to learn a new technology quickly?

*This is a mock interview. For real AI-powered interviews with dynamic questions, please enable the Generative Language API.*`;
};

export const getCareerGuidance = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const q = query.toLowerCase();
  
  // Handle greetings
  if (q.match(/^(hi|hii|hello|hey|helo|hola)[\s!]*$/i)) {
    return `Hello! 👋 I'm your AI Career Assistant. I'm here to help you with:

💼 **What I can help with:**
- Resume and CV tips
- Interview preparation
- Skills and learning roadmap
- Salary negotiation
- Career advice
- Technical guidance

**Try asking me:**
- "How to prepare for interviews?"
- "What skills should I learn?"
- "Resume tips for freshers"
- "How to negotiate salary?"

What would you like to know today?

*Note: I'm currently in mock mode. For advanced AI responses, enable the Generative Language API!*`;
  }
  
  // Generate contextual responses based on query
  if (q.includes('resume') || q.includes('cv')) {
    return `Here are key tips for creating a strong tech resume:

📄 **Resume Best Practices:**
1. Keep it to 1-2 pages maximum
2. Use action verbs (Developed, Implemented, Optimized)
3. Quantify achievements (Improved performance by 40%)
4. Include relevant projects with GitHub links
5. List technical skills prominently
6. Add certifications and courses

**ATS-Friendly Tips:**
- Use standard section headings
- Avoid tables and graphics
- Include relevant keywords from job description
- Use PDF format

*Get personalized AI advice by enabling the Generative Language API!*`;
  }
  
  if (q.includes('interview') || q.includes('preparation')) {
    return `Here's a comprehensive interview preparation guide:

🎯 **Interview Preparation Checklist:**

**Technical Preparation:**
- Practice DSA on LeetCode/HackerRank
- Review system design concepts
- Brush up on your project details
- Understand time/space complexity

**Behavioral Preparation:**
- Use STAR method (Situation, Task, Action, Result)
- Prepare stories about challenges, teamwork, leadership
- Research the company culture
- Prepare questions to ask the interviewer

**Day Before:**
- Review your resume thoroughly
- Test your internet/equipment
- Get good sleep
- Prepare professional attire

*For personalized interview tips, enable the Generative Language API!*`;
  }
  
  if (q.includes('skill') || q.includes('learn') || q.includes('technology')) {
    return `Here are trending skills for 2024-2025:

💻 **High-Demand Technical Skills:**

**Programming:**
- Python (AI/ML, Backend)
- JavaScript/TypeScript (Full-stack)
- Java (Enterprise)
- Go (Cloud/DevOps)

**Frameworks & Tools:**
- React/Next.js (Frontend)
- Node.js/Django (Backend)
- Docker/Kubernetes (DevOps)
- AWS/Azure/GCP (Cloud)

**Emerging Technologies:**
- AI/Machine Learning
- Blockchain
- Cloud Native Development
- Cybersecurity

**Learning Path:**
1. Start with fundamentals
2. Build projects
3. Contribute to open source
4. Get certifications
5. Create a portfolio

*Enable the API for personalized learning recommendations!*`;
  }
  
  if (q.includes('salary') || q.includes('package') || q.includes('offer')) {
    return `Let me help you understand tech compensation:

💰 **Salary Negotiation Tips:**

**Research Phase:**
- Use Glassdoor, Levels.fyi, Ambitionbox
- Consider location and company size
- Factor in total compensation (base + bonus + equity)

**Negotiation Strategy:**
- Always negotiate (most offers have 10-20% flexibility)
- Know your minimum acceptable offer
- Express enthusiasm for the role
- Provide data to support your ask
- Consider non-salary benefits

**Typical Ranges (India 2024-2025):**
- Fresher: 3-8 LPA
- 1-3 years: 6-15 LPA
- 3-5 years: 12-25 LPA
- Senior: 25+ LPA

*Get company-specific advice with real Gemini AI!*`;
  }
  
  // Default career guidance
  return `Thank you for your question! Here's some general career advice:

🚀 **Career Success Framework:**

**Short-term (0-6 months):**
- Master fundamentals
- Build 2-3 strong projects
- Practice coding daily
- Network on LinkedIn

**Mid-term (6-12 months):**
- Apply for internships/jobs
- Attend tech meetups
- Contribute to open-source
- Get certified

**Long-term (1-2 years):**
- Specialize in a domain
- Mentor others
- Build a personal brand
- Consider advanced degrees/certifications

**Key Success Factors:**
- Consistent learning
- Building in public
- Networking
- Problem-solving skills

Your specific question was: "${query.substring(0, 100)}..."

*For personalized AI-powered career guidance, please enable the Generative Language API at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com*`;
};
