import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
}

const templates: Template[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Clean, traditional format perfect for corporate roles (1 page)",
    content: `[YOUR NAME]
[City, State] | [Phone] | [Email] | [LinkedIn URL]

PROFESSIONAL SUMMARY
[2-3 sentences highlighting your experience, key skills, and career goals relevant to the target position]

WORK EXPERIENCE

[Job Title]
[Company Name] | [City, State] | [Start Date] - [End Date]
• [Achievement with quantifiable result - e.g., Increased sales by 25% through strategic client outreach]
• [Achievement with quantifiable result]
• [Achievement with quantifiable result]

[Job Title]
[Company Name] | [City, State] | [Start Date] - [End Date]
• [Achievement with quantifiable result]
• [Achievement with quantifiable result]
• [Achievement with quantifiable result]

EDUCATION

[Degree] in [Field of Study]
[University Name] | [City, State] | [Graduation Year]

SKILLS
[Skill 1] | [Skill 2] | [Skill 3] | [Skill 4] | [Skill 5]
[Skill 6] | [Skill 7] | [Skill 8] | [Skill 9] | [Skill 10]

CERTIFICATIONS
• [Certification Name] - [Issuing Organization] - [Year]
• [Certification Name] - [Issuing Organization] - [Year]`,
  },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Contemporary layout with clear sections for tech roles (1 page)",
    content: `[YOUR NAME]
[Email] | [Phone] | [LinkedIn] | [Portfolio/GitHub]

---

SUMMARY
[Concise 2-line summary of your expertise and what you bring to the role]

---

EXPERIENCE

[COMPANY NAME] — [Job Title]
[Start Date] - [End Date]

• [Action verb] + [Task] + [Result with metrics]
• [Action verb] + [Task] + [Result with metrics]
• [Action verb] + [Task] + [Result with metrics]

[COMPANY NAME] — [Job Title]
[Start Date] - [End Date]

• [Action verb] + [Task] + [Result with metrics]
• [Action verb] + [Task] + [Result with metrics]

---

PROJECTS

[Project Name]
• [Brief description of project and your role]
• [Technologies used: Tech 1, Tech 2, Tech 3]

---

EDUCATION

[UNIVERSITY NAME]
[Degree], [Major] — [Year]

---

SKILLS

Technical: [Skill], [Skill], [Skill], [Skill]
Tools: [Tool], [Tool], [Tool], [Tool]
Languages: [Language], [Language]`,
  },
  {
    id: "executive",
    name: "Executive Brief",
    description: "Senior-level format emphasizing leadership and impact (1 page)",
    content: `[YOUR NAME]
[Title/Role] | [Location]
[Phone] | [Email] | [LinkedIn]

═══════════════════════════════════════════════════════════

EXECUTIVE PROFILE

[3-4 line summary highlighting years of experience, industry expertise, leadership accomplishments, and strategic vision]

═══════════════════════════════════════════════════════════

KEY ACHIEVEMENTS

• [Major achievement with business impact - revenue, growth, transformation]
• [Major achievement with business impact]
• [Major achievement with business impact]

═══════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

[COMPANY NAME]
[Title] | [Dates]

[1-line company description if not well-known]

• Led [initiative] resulting in [quantified outcome]
• Directed team of [X] professionals across [functions/regions]
• [Strategic accomplishment with measurable impact]

[COMPANY NAME]
[Title] | [Dates]

• [Leadership accomplishment]
• [Strategic initiative and result]

═══════════════════════════════════════════════════════════

EDUCATION & CREDENTIALS

[Degree], [Institution]
[Executive Education/Certifications if relevant]

═══════════════════════════════════════════════════════════

CORE COMPETENCIES

Strategic Planning | P&L Management | Team Leadership | [Industry Expertise]
[Competency] | [Competency] | [Competency] | [Competency]`,
  },
  {
    id: "entry",
    name: "Entry Level",
    description: "Ideal for recent graduates and career starters (1 page)",
    content: `[YOUR NAME]
[Address Line] | [Phone] | [Email]
[LinkedIn Profile URL]

OBJECTIVE
[1-2 sentences about your career goals and what you hope to contribute to the organization]

EDUCATION

[University Name]
[Degree] in [Major], [Minor if applicable]
Expected Graduation: [Month Year] | GPA: [X.XX]

Relevant Coursework: [Course], [Course], [Course], [Course]

EXPERIENCE

[Job Title/Internship Title]
[Company/Organization] | [Location] | [Dates]
• [Responsibility or achievement]
• [Responsibility or achievement]
• [Responsibility or achievement]

[Job Title/Volunteer Role]
[Organization] | [Location] | [Dates]
• [Responsibility or achievement]
• [Responsibility or achievement]

PROJECTS

[Project Name] | [Date]
• [What you built/accomplished and technologies used]
• [Outcome or skills demonstrated]

SKILLS

Technical: [Skill], [Skill], [Skill], [Skill]
Software: [Software], [Software], [Software]
Languages: [Language - Proficiency Level]

ACTIVITIES & LEADERSHIP

• [Club/Organization] - [Role] | [Dates]
• [Award or Honor] | [Year]`,
  },
  {
    id: "elegant",
    name: "Elegant Professional",
    description: "Sophisticated layout with centred headers and clean sections (1 page)",
    content: `[YOUR NAME]
[Professional Title]

═══════════════════════════════════════════════════════════
                    PROFESSIONAL SUMMARY
═══════════════════════════════════════════════════════════

Showcase your top achievements upfront, emphasising measurable impact with numbers whenever possible. Use either bullet points or concise paragraphs to highlight key successes—avoid generic objective statements. Instead, focus on demonstrating how your skills and experience can drive results and add value to the company.

═══════════════════════════════════════════════════════════
                      WORK EXPERIENCE
═══════════════════════════════════════════════════════════

[POSITION TITLE]                                    [Date] - Present
[Company Name], [Location]

• Showcase your achievements by using strong, dynamic action verbs like "managed" and "spearheaded" instead of passive phrases like "responsible for."
• Go beyond listing job duties—highlight the impact you made! How did your work drive revenue, cut costs, or improve efficiency? Show potential employers why your contributions matter.
• Lead with your most impressive and relevant accomplishments. Numbers speak volumes, so whenever possible, quantify your results to add credibility and impact.

[POSITION TITLE]                                    [Date] - [Date]
[Company Name], [Location]

• Showcase your achievements by using strong, dynamic action verbs like "managed" and "spearheaded" instead of passive phrases like "responsible for."
• Go beyond listing job duties—highlight the impact you made! How did your work drive revenue, cut costs, or improve efficiency?
• Lead with your most impressive and relevant accomplishments. Quantify your results to add credibility and impact.

═══════════════════════════════════════════════════════════
                         EDUCATION
═══════════════════════════════════════════════════════════

[Degree] in [Field of Study]
[University Name] | [Graduation Year]

═══════════════════════════════════════════════════════════
                           SKILLS
═══════════════════════════════════════════════════════════

[Skill 1] | [Skill 2] | [Skill 3] | [Skill 4] | [Skill 5]
[Skill 6] | [Skill 7] | [Skill 8] | [Skill 9] | [Skill 10]`,
  },
  {
    id: "comprehensive-2page",
    name: "Comprehensive Professional (2 Pages)",
    description: "Detailed A4 format for experienced professionals with extensive history",
    content: `[YOUR NAME]
[Professional Title]
[City, Country] | [Phone Number] | [Email Address]
[LinkedIn URL] | [Portfolio/Website]

═══════════════════════════════════════════════════════════════════════════════
                           PROFESSIONAL PROFILE
═══════════════════════════════════════════════════════════════════════════════

[Write a compelling 4-5 line professional summary that showcases your expertise, years of experience, industry knowledge, and the unique value you bring. Focus on your most significant achievements and how they align with your target role. Include quantifiable results where possible.]

═══════════════════════════════════════════════════════════════════════════════
                              KEY SKILLS
═══════════════════════════════════════════════════════════════════════════════

Core Competencies:        [Skill 1] | [Skill 2] | [Skill 3] | [Skill 4]
Technical Skills:         [Tech 1] | [Tech 2] | [Tech 3] | [Tech 4]
Management Skills:        [Mgmt 1] | [Mgmt 2] | [Mgmt 3] | [Mgmt 4]
Industry Knowledge:       [Industry 1] | [Industry 2] | [Industry 3]

═══════════════════════════════════════════════════════════════════════════════
                         PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════════════════════════════════════════

[CURRENT/MOST RECENT JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - Present

[Brief company description if not well-known - 1 line]

Key Responsibilities & Achievements:
• [Achievement with specific metrics - e.g., Led digital transformation initiative resulting in 40% increase in operational efficiency]
• [Achievement demonstrating leadership - e.g., Managed cross-functional team of 15 professionals across 3 departments]
• [Achievement showing innovation - e.g., Developed and implemented new customer engagement strategy, increasing retention by 25%]
• [Achievement with cost/revenue impact - e.g., Negotiated vendor contracts saving £500K annually]
• [Achievement showing process improvement - e.g., Streamlined reporting processes, reducing time-to-insight by 60%]

[PREVIOUS JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - [Month Year]

Key Responsibilities & Achievements:
• [Achievement with quantifiable result]
• [Achievement demonstrating skills relevant to target role]
• [Achievement showing problem-solving abilities]
• [Achievement highlighting collaboration or leadership]

[EARLIER JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - [Month Year]

Key Responsibilities & Achievements:
• [Achievement with measurable outcome]
• [Achievement relevant to career progression]
• [Achievement demonstrating core competencies]

═══════════════════════════════════════════════════════════════════════════════
                                PAGE 2
═══════════════════════════════════════════════════════════════════════════════

[ADDITIONAL EXPERIENCE - If applicable]
[Company Name] | [City, Country]                           [Month Year] - [Month Year]

• [Key achievement or responsibility]
• [Key achievement or responsibility]

═══════════════════════════════════════════════════════════════════════════════
                          EDUCATION & QUALIFICATIONS
═══════════════════════════════════════════════════════════════════════════════

[Degree Title] in [Field of Study]
[University Name] | [City, Country]                                    [Year]
• [Relevant honours, dissertation topic, or notable achievements]
• [Relevant coursework if applicable to target role]

[Additional Degree/Diploma if applicable]
[Institution Name] | [City, Country]                                   [Year]

═══════════════════════════════════════════════════════════════════════════════
                      PROFESSIONAL CERTIFICATIONS
═══════════════════════════════════════════════════════════════════════════════

• [Certification Name] - [Issuing Body]                                [Year]
• [Certification Name] - [Issuing Body]                                [Year]
• [Certification Name] - [Issuing Body]                                [Year]

═══════════════════════════════════════════════════════════════════════════════
                           PROJECTS & ACHIEVEMENTS
═══════════════════════════════════════════════════════════════════════════════

[Project/Initiative Name]                                         [Year]
• [Description of project scope, your role, and measurable outcomes achieved]
• [Technologies, methodologies, or frameworks used]

[Project/Initiative Name]                                         [Year]
• [Description and key results]

═══════════════════════════════════════════════════════════════════════════════
                       PROFESSIONAL AFFILIATIONS
═══════════════════════════════════════════════════════════════════════════════

• [Professional Body Name] - [Membership Level]                   [Year - Present]
• [Industry Association] - [Role if applicable]                   [Year - Present]

═══════════════════════════════════════════════════════════════════════════════
                              LANGUAGES
═══════════════════════════════════════════════════════════════════════════════

[Language 1] - Native/Fluent
[Language 2] - Professional Working Proficiency
[Language 3] - Conversational

═══════════════════════════════════════════════════════════════════════════════
                       ADDITIONAL INFORMATION
═══════════════════════════════════════════════════════════════════════════════

Availability: [Immediate / Notice Period]
References: Available upon request`,
  },
  {
    id: "academic-2page",
    name: "Academic & Research (2 Pages)",
    description: "A4 format for academic positions with publications and research",
    content: `[YOUR NAME], [Credentials - PhD, MSc, etc.]
[Current Position/Title]

[Department/Faculty]
[University/Institution Name]
[Full Address]
[Phone] | [Email] | [ORCID ID]

═══════════════════════════════════════════════════════════════════════════════
                              RESEARCH INTERESTS
═══════════════════════════════════════════════════════════════════════════════

[Primary Research Area 1] | [Primary Research Area 2] | [Primary Research Area 3]
[Specific focus areas or methodologies]

═══════════════════════════════════════════════════════════════════════════════
                                 EDUCATION
═══════════════════════════════════════════════════════════════════════════════

[Highest Degree - PhD/Doctorate]                                       [Year]
[University Name], [City, Country]
Thesis: "[Thesis Title]"
Supervisor: [Professor Name]
• [Key achievement or award]

[Masters Degree]                                                       [Year]
[University Name], [City, Country]
• [Distinction/Honours if applicable]

[Undergraduate Degree]                                                 [Year]
[University Name], [City, Country]
• [Class of degree/GPA]

═══════════════════════════════════════════════════════════════════════════════
                           ACADEMIC APPOINTMENTS
═══════════════════════════════════════════════════════════════════════════════

[Current Position Title]                                    [Year] - Present
[Department], [University Name]
• [Key responsibilities and achievements]
• [Courses taught, students supervised]

[Previous Position Title]                              [Year] - [Year]
[Department], [University Name]
• [Key responsibilities and achievements]

[Postdoctoral Position/Research Fellow]                [Year] - [Year]
[Institution Name]
• [Research focus and key outcomes]

═══════════════════════════════════════════════════════════════════════════════
                          SELECTED PUBLICATIONS
═══════════════════════════════════════════════════════════════════════════════

Peer-Reviewed Journal Articles:

[1] [Author(s)] ([Year]). "[Article Title]". Journal Name, Volume(Issue), 
    Pages. DOI: [DOI number]

[2] [Author(s)] ([Year]). "[Article Title]". Journal Name, Volume(Issue), 
    Pages. DOI: [DOI number]

[3] [Author(s)] ([Year]). "[Article Title]". Journal Name, Volume(Issue), 
    Pages. DOI: [DOI number]

Book Chapters:

[1] [Author(s)] ([Year]). "[Chapter Title]". In [Editor(s)] (Eds.), 
    Book Title (pp. XX-XX). Publisher.

═══════════════════════════════════════════════════════════════════════════════
                                PAGE 2
═══════════════════════════════════════════════════════════════════════════════

Conference Presentations:

[1] [Author(s)] ([Year]). "[Presentation Title]". Paper presented at 
    [Conference Name], [Location].

[2] [Author(s)] ([Year]). "[Presentation Title]". Poster presented at 
    [Conference Name], [Location].

═══════════════════════════════════════════════════════════════════════════════
                           RESEARCH GRANTS & FUNDING
═══════════════════════════════════════════════════════════════════════════════

[Grant Title]                                              [Year] - [Year]
[Funding Body] | Role: [PI/Co-I]                          Value: £[Amount]
• [Brief project description]

[Grant Title]                                              [Year] - [Year]
[Funding Body] | Role: [PI/Co-I]                          Value: £[Amount]
• [Brief project description]

═══════════════════════════════════════════════════════════════════════════════
                                  TEACHING
═══════════════════════════════════════════════════════════════════════════════

Courses Taught:
• [Course Code]: [Course Name] - [Level: UG/PG]           [Years taught]
• [Course Code]: [Course Name] - [Level: UG/PG]           [Years taught]

Supervision:
• PhD Students Supervised: [Number] (Completed: [X], Current: [Y])
• Masters Students Supervised: [Number]

═══════════════════════════════════════════════════════════════════════════════
                          AWARDS & HONOURS
═══════════════════════════════════════════════════════════════════════════════

• [Award Name] - [Awarding Body]                                      [Year]
• [Award Name] - [Awarding Body]                                      [Year]
• [Award Name] - [Awarding Body]                                      [Year]

═══════════════════════════════════════════════════════════════════════════════
                          SERVICE & LEADERSHIP
═══════════════════════════════════════════════════════════════════════════════

Editorial Roles:
• [Journal Name] - [Role: Editor/Reviewer]                    [Year] - Present

Committee Membership:
• [Committee Name] - [University/Organisation]                [Year] - Present
• [Committee Name] - [University/Organisation]                [Year] - [Year]

Professional Memberships:
• [Professional Society] - [Membership Level]                 [Year] - Present

═══════════════════════════════════════════════════════════════════════════════
                              REFERENCES
═══════════════════════════════════════════════════════════════════════════════

[Reference 1 Name], [Title]
[Department], [University]
Email: [email] | Phone: [phone]

[Reference 2 Name], [Title]
[Department], [University]
Email: [email] | Phone: [phone]`,
  },
  {
    id: "technical-2page",
    name: "Technical Specialist (2 Pages)",
    description: "A4 format for IT, engineering, and technical roles with project details",
    content: `[YOUR NAME]
[Job Title / Technical Specialty]
[City, Country] | [Phone] | [Email]
[LinkedIn] | [GitHub] | [Portfolio]

═══════════════════════════════════════════════════════════════════════════════
                          TECHNICAL SUMMARY
═══════════════════════════════════════════════════════════════════════════════

[3-4 line summary highlighting your technical expertise, years of experience, specialisation areas, and key achievements. Focus on technologies, systems, and the business value you've delivered.]

═══════════════════════════════════════════════════════════════════════════════
                          TECHNICAL SKILLS
═══════════════════════════════════════════════════════════════════════════════

Programming Languages:    [Language 1], [Language 2], [Language 3], [Language 4]
Frameworks & Libraries:   [Framework 1], [Framework 2], [Framework 3]
Databases:               [DB 1], [DB 2], [DB 3], [DB 4]
Cloud Platforms:         [AWS/Azure/GCP] - [Specific Services]
DevOps & Tools:          [Tool 1], [Tool 2], [Tool 3], [Tool 4]
Methodologies:           Agile, Scrum, CI/CD, TDD, [Other]

═══════════════════════════════════════════════════════════════════════════════
                       PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════════════════════════════════════════

[CURRENT JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - Present

Project: [Project Name]
• [Technical achievement with metrics - e.g., Architected microservices platform handling 10M+ daily transactions with 99.99% uptime]
• [Achievement showing technical leadership - e.g., Led migration from monolith to cloud-native architecture, reducing infrastructure costs by 45%]
• [Achievement demonstrating problem-solving - e.g., Optimised database queries resulting in 70% improvement in response times]

Project: [Project Name]
• [Technical implementation and outcome]
• [Technologies used and business impact]

Technologies: [Tech Stack used in this role]

[PREVIOUS JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - [Month Year]

Project: [Project Name]
• [Technical achievement with quantifiable results]
• [System or feature developed and its impact]

Project: [Project Name]
• [Technical contribution and outcome]
• [Problem solved and approach taken]

Technologies: [Tech Stack used in this role]

═══════════════════════════════════════════════════════════════════════════════
                                PAGE 2
═══════════════════════════════════════════════════════════════════════════════

[EARLIER JOB TITLE]
[Company Name] | [City, Country]                           [Month Year] - [Month Year]

• [Key technical achievement]
• [Relevant system or feature developed]

Technologies: [Tech Stack]

═══════════════════════════════════════════════════════════════════════════════
                          KEY PROJECTS
═══════════════════════════════════════════════════════════════════════════════

[PROJECT NAME]                                                        [Year]
[Brief Description]
• Role: [Your role - Lead Developer, Architect, etc.]
• Challenge: [Technical problem addressed]
• Solution: [Your approach and implementation]
• Results: [Quantifiable outcomes]
• Tech Stack: [Technologies used]

[PROJECT NAME]                                                        [Year]
[Brief Description]
• Role: [Your role]
• Key Achievement: [Main technical accomplishment]
• Tech Stack: [Technologies used]

═══════════════════════════════════════════════════════════════════════════════
                    OPEN SOURCE & PERSONAL PROJECTS
═══════════════════════════════════════════════════════════════════════════════

[Project Name] | [GitHub URL]
• [Description of project and its purpose]
• [Number of stars/forks/contributors if notable]

[Project Name] | [GitHub URL]
• [Description and key features]

═══════════════════════════════════════════════════════════════════════════════
                               EDUCATION
═══════════════════════════════════════════════════════════════════════════════

[Degree] in [Field - e.g., Computer Science, Software Engineering]
[University Name] | [City, Country]                                    [Year]
• [Relevant coursework, thesis, or achievements]

═══════════════════════════════════════════════════════════════════════════════
                    CERTIFICATIONS & TRAINING
═══════════════════════════════════════════════════════════════════════════════

• [AWS/Azure/GCP Certification] - [Certification Name]                [Year]
• [Professional Certification] - [Issuing Body]                       [Year]
• [Technical Certification] - [Issuing Body]                          [Year]

═══════════════════════════════════════════════════════════════════════════════
                      CONFERENCE & PUBLICATIONS
═══════════════════════════════════════════════════════════════════════════════

• [Conference Talk Title] - [Conference Name]                         [Year]
• [Technical Blog Post/Article Title] - [Publication]                 [Year]

═══════════════════════════════════════════════════════════════════════════════
                        ADDITIONAL INFORMATION
═══════════════════════════════════════════════════════════════════════════════

Languages: [Language] (Native), [Language] (Professional)
Work Authorisation: [Status]
References: Available upon request`,
  },
  {
    id: "creative-2page",
    name: "Creative Professional (2 Pages)",
    description: "A4 format for marketing, design, and creative roles",
    content: `[YOUR NAME]
[Creative Title - e.g., Senior Brand Designer, Creative Director]

[Email] | [Phone] | [City, Country]
[Portfolio URL] | [LinkedIn] | [Behance/Dribbble]

═══════════════════════════════════════════════════════════════════════════════
                          CREATIVE PROFILE
═══════════════════════════════════════════════════════════════════════════════

[4-5 line profile highlighting your creative philosophy, years of experience, industry expertise, and signature achievements. Mention notable brands or campaigns you've worked on and your unique creative approach.]

═══════════════════════════════════════════════════════════════════════════════
                            EXPERTISE
═══════════════════════════════════════════════════════════════════════════════

Creative Skills:          [Brand Strategy] | [Visual Design] | [Art Direction]
                         [UX/UI Design] | [Motion Graphics] | [Typography]

Software Proficiency:     Adobe Creative Suite (Photoshop, Illustrator, InDesign,
                         After Effects, Premiere Pro) | Figma | Sketch

Specialisations:          [Brand Identity] | [Digital Marketing] | [Packaging]
                         [Social Media Content] | [Print Design]

═══════════════════════════════════════════════════════════════════════════════
                       PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════════════════════════════════════════

[CURRENT JOB TITLE]
[Company/Agency Name] | [City, Country]                    [Month Year] - Present

Key Campaigns & Projects:

[Campaign/Project Name] - [Client Name]
• [Creative achievement - e.g., Developed brand identity system for global product launch reaching 50M+ consumers]
• [Strategic contribution - e.g., Led creative strategy resulting in 200% increase in social engagement]
• [Award or recognition if applicable]

[Campaign/Project Name] - [Client Name]
• [Creative solution and execution]
• [Measurable outcomes and impact]

[PREVIOUS JOB TITLE]
[Company/Agency Name] | [City, Country]                    [Month Year] - [Month Year]

Key Campaigns & Projects:

[Campaign/Project Name] - [Client Name]
• [Creative achievement with results]
• [Skills demonstrated and impact]

[Campaign/Project Name] - [Client Name]
• [Creative contribution and outcome]

═══════════════════════════════════════════════════════════════════════════════
                                PAGE 2
═══════════════════════════════════════════════════════════════════════════════

[EARLIER JOB TITLE]
[Company/Agency Name] | [City, Country]                    [Month Year] - [Month Year]

• [Key creative achievement]
• [Notable project or campaign]
• [Skills developed or demonstrated]

═══════════════════════════════════════════════════════════════════════════════
                        SELECTED WORK & PORTFOLIO
═══════════════════════════════════════════════════════════════════════════════

[PROJECT NAME] - [Client/Brand]                                       [Year]
Type: [Brand Identity / Campaign / Digital / Print]
• [Brief description of project scope and creative challenge]
• [Your role and creative contribution]
• [Results achieved - metrics, awards, recognition]
Portfolio Link: [URL or "Available on request"]

[PROJECT NAME] - [Client/Brand]                                       [Year]
Type: [Brand Identity / Campaign / Digital / Print]
• [Description and creative approach]
• [Impact and results]

[PROJECT NAME] - [Client/Brand]                                       [Year]
Type: [Brand Identity / Campaign / Digital / Print]
• [Description and key achievements]

═══════════════════════════════════════════════════════════════════════════════
                         AWARDS & RECOGNITION
═══════════════════════════════════════════════════════════════════════════════

• [Award Name] - [Category] - [Campaign/Project]                      [Year]
  [Awarding Body - e.g., D&AD, Cannes Lions, One Show]

• [Award Name] - [Category] - [Campaign/Project]                      [Year]
  [Awarding Body]

• [Award Name] - [Category]                                           [Year]
  [Awarding Body]

═══════════════════════════════════════════════════════════════════════════════
                               EDUCATION
═══════════════════════════════════════════════════════════════════════════════

[Degree] in [Field - e.g., Graphic Design, Fine Arts, Visual Communication]
[University/College Name] | [City, Country]                           [Year]
• [Relevant honours or notable projects]

[Additional Qualification if applicable]
[Institution Name]                                                    [Year]

═══════════════════════════════════════════════════════════════════════════════
                   PROFESSIONAL DEVELOPMENT
═══════════════════════════════════════════════════════════════════════════════

• [Course/Workshop Name] - [Institution/Platform]                     [Year]
• [Course/Workshop Name] - [Institution/Platform]                     [Year]

═══════════════════════════════════════════════════════════════════════════════
                         SPEAKING & PUBLICATIONS
═══════════════════════════════════════════════════════════════════════════════

• [Talk Title] - [Conference/Event Name]                              [Year]
• [Article Title] - [Publication Name]                                [Year]

═══════════════════════════════════════════════════════════════════════════════
                      PROFESSIONAL MEMBERSHIPS
═══════════════════════════════════════════════════════════════════════════════

• [Design Organisation] - Member                              [Year] - Present
• [Industry Association] - Member                             [Year] - Present

═══════════════════════════════════════════════════════════════════════════════

References and full portfolio available upon request`,
  },
  {
    id: "healthcare-2page",
    name: "Healthcare Professional (2 Pages)",
    description: "A4 format for medical, nursing, and healthcare roles",
    content: `[YOUR NAME], [Credentials - RN, MD, PhD, etc.]
[Professional Title/Specialty]

[Full Address]
[Phone] | [Email] | [Professional Registration Number]

═══════════════════════════════════════════════════════════════════════════════
                        PROFESSIONAL PROFILE
═══════════════════════════════════════════════════════════════════════════════

[3-4 line summary highlighting your clinical expertise, years of experience, specialisations, and commitment to patient care. Include key achievements and areas of special interest.]

═══════════════════════════════════════════════════════════════════════════════
                          REGISTRATION & LICENSING
═══════════════════════════════════════════════════════════════════════════════

• [Primary Registration] - [Registration Body]           Reg No: [Number]
• [Additional License/Registration if applicable]        Reg No: [Number]
• [Specialist Registration if applicable]               Valid until: [Date]

═══════════════════════════════════════════════════════════════════════════════
                          CLINICAL SKILLS
═══════════════════════════════════════════════════════════════════════════════

Clinical Competencies:    [Skill 1] | [Skill 2] | [Skill 3] | [Skill 4]
Specialisations:          [Specialty 1] | [Specialty 2] | [Specialty 3]
Technical Skills:         [Equipment/Procedure 1] | [Equipment/Procedure 2]
Languages:               [Language 1] | [Language 2]

═══════════════════════════════════════════════════════════════════════════════
                       PROFESSIONAL EXPERIENCE
═══════════════════════════════════════════════════════════════════════════════

[CURRENT JOB TITLE]
[Hospital/Healthcare Facility] | [City, Country]           [Month Year] - Present
[Department/Ward]

Key Responsibilities & Achievements:
• [Clinical achievement - e.g., Managed complex patient caseload of 15+ patients daily with 98% satisfaction scores]
• [Quality improvement - e.g., Led initiative reducing medication errors by 30%]
• [Leadership - e.g., Supervised team of 8 healthcare assistants and junior staff]
• [Patient care achievement]
• [Collaboration or multidisciplinary achievement]

[PREVIOUS JOB TITLE]
[Hospital/Healthcare Facility] | [City, Country]           [Month Year] - [Month Year]
[Department/Ward]

Key Responsibilities & Achievements:
• [Clinical responsibility and achievement]
• [Quality or safety improvement]
• [Team contribution]
• [Patient outcome achievement]

═══════════════════════════════════════════════════════════════════════════════
                                PAGE 2
═══════════════════════════════════════════════════════════════════════════════

[EARLIER JOB TITLE]
[Hospital/Healthcare Facility] | [City, Country]           [Month Year] - [Month Year]

• [Key clinical experience]
• [Notable achievement or responsibility]

═══════════════════════════════════════════════════════════════════════════════
                               EDUCATION
═══════════════════════════════════════════════════════════════════════════════

[Primary Clinical Qualification - e.g., MBBS, BSc Nursing, etc.]
[University/College Name] | [City, Country]                            [Year]
• [Honours or notable achievements]

[Postgraduate Qualification if applicable]
[University/College Name] | [City, Country]                            [Year]
• [Specialisation or thesis topic]

═══════════════════════════════════════════════════════════════════════════════
                PROFESSIONAL CERTIFICATIONS & TRAINING
═══════════════════════════════════════════════════════════════════════════════

• [Clinical Certification - e.g., BLS, ACLS, PALS]                    [Year]
  [Certifying Body] - Valid until: [Date]

• [Specialist Certification]                                          [Year]
  [Certifying Body] - Valid until: [Date]

• [Advanced Training Course]                                          [Year]
  [Institution]

• [Mandatory Training - e.g., Safeguarding, Infection Control]        [Year]
  [Provider] - Valid until: [Date]

═══════════════════════════════════════════════════════════════════════════════
                      CONTINUING PROFESSIONAL DEVELOPMENT
═══════════════════════════════════════════════════════════════════════════════

• [CPD Course/Conference] - [Provider]                       [Date] - [X Hours]
• [CPD Course/Workshop] - [Provider]                         [Date] - [X Hours]
• [CPD Course/Seminar] - [Provider]                          [Date] - [X Hours]

Total CPD Hours: [XX] hours in past [X] years

═══════════════════════════════════════════════════════════════════════════════
                      RESEARCH & PUBLICATIONS
═══════════════════════════════════════════════════════════════════════════════

[If applicable - otherwise remove this section]

• [Author(s)] ([Year]). "[Article Title]". Journal Name, Volume(Issue).
• [Poster/Presentation Title] - [Conference Name]                     [Year]

═══════════════════════════════════════════════════════════════════════════════
                    QUALITY IMPROVEMENT PROJECTS
═══════════════════════════════════════════════════════════════════════════════

[Project Title]                                                       [Year]
• [Description of initiative and your role]
• [Outcome and impact on patient care]

═══════════════════════════════════════════════════════════════════════════════
                    PROFESSIONAL MEMBERSHIPS
═══════════════════════════════════════════════════════════════════════════════

• [Professional Body - e.g., RCN, BMA] - [Membership Level]   [Year] - Present
• [Specialist Association] - Member                            [Year] - Present

═══════════════════════════════════════════════════════════════════════════════
                             REFERENCES
═══════════════════════════════════════════════════════════════════════════════

[Reference 1 Name], [Title/Position]
[Department], [Hospital/Institution]
Email: [email] | Phone: [phone]

[Reference 2 Name], [Title/Position]
[Department], [Hospital/Institution]
Email: [email] | Phone: [phone]`,
  },
];

export function ATSTemplates() {
  const downloadAsText = (template: Template) => {
    const blob = new Blob([template.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}-template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${template.name} downloaded as TXT`);
  };

  const downloadAsDocx = async (template: Template) => {
    // Create a simple RTF format that Word can open
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f0\\fs22
${template.content.replace(/\n/g, "\\par\n").replace(/•/g, "\\bullet ")}
}`;
    
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}-template.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${template.name} downloaded as RTF (opens in Word)`);
  };

  const downloadAsPdf = (template: Template) => {
    // Create a printable HTML page with A4 sizing and page break support
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Check if template has page break marker
      const hasPageBreak = template.content.includes("PAGE 2");
      const pages = hasPageBreak 
        ? template.content.split(/═+\s*PAGE 2\s*═+/)
        : [template.content];
      
      const pagesHtml = pages.map((page, index) => `
        <div class="page ${index > 0 ? 'page-break' : ''}">
          <pre>${page.trim()}</pre>
        </div>
      `).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${template.name}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm 15mm 20mm 15mm;
            }
            * {
              box-sizing: border-box;
            }
            html, body {
              margin: 0;
              padding: 0;
              font-family: 'Arial', 'Helvetica Neue', sans-serif;
              font-size: 10pt;
              line-height: 1.4;
              color: #1a1a1a;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm 15mm;
              margin: 0 auto;
              background: white;
            }
            .page-break {
              page-break-before: always;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: 'Arial', 'Helvetica Neue', sans-serif;
              font-size: 10pt;
              line-height: 1.4;
              margin: 0;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
              .page {
                width: 100%;
                min-height: auto;
                padding: 0;
                margin: 0;
                page-break-after: always;
              }
              .page:last-child {
                page-break-after: auto;
              }
            }
            @media screen {
              body {
                background: #f0f0f0;
                padding: 20px;
              }
              .page {
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                margin-bottom: 20px;
              }
            }
          </style>
        </head>
        <body>
          ${pagesHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Print dialog opened - Save as PDF (A4 format)");
    }
  };

  const copyToClipboard = (template: Template) => {
    navigator.clipboard.writeText(template.content);
    toast.success("Template copied to clipboard");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">ATS-Friendly Templates</h2>
        <p className="mt-2 text-muted-foreground">
          Clean, optimised templates designed to pass Applicant Tracking Systems
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </div>

            <div className="mb-4 max-h-32 overflow-hidden rounded-lg bg-muted/50 p-3">
              <pre className="text-xs text-muted-foreground line-clamp-6 whitespace-pre-wrap">
                {template.content.slice(0, 300)}...
              </pre>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(template)}
                className="flex-1"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsText(template)}
                className="flex-1"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsDocx(template)}
                className="flex-1"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Word
              </Button>
              <Button
                size="sm"
                onClick={() => downloadAsPdf(template)}
                className="flex-1"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-accent/50 p-4 text-center">
        <p className="text-sm text-accent-foreground">
          <strong>Pro tip:</strong> Use simple formatting, standard fonts, and avoid tables, 
          graphics, or headers/footers for best ATS compatibility.
        </p>
      </div>
    </div>
  );
}
