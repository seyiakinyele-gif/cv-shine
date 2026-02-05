import { Download, Eye, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { CVEditor } from "./CVEditor";

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: "classic" | "modern" | "executive" | "minimal" | "academic" | "technical" | "creative" | "healthcare" | "compact" | "elegant";
}

interface CVTemplatePreviewProps {
  optimizedContent?: string | null;
  onClearOptimizedContent?: () => void;
}

const templates: CVTemplate[] = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Traditional layout perfect for corporate roles",
    style: "classic",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean contemporary design for tech roles",
    style: "modern",
  },
  {
    id: "executive-brief",
    name: "Executive Brief",
    description: "Senior-level format emphasising leadership",
    style: "executive",
  },
  {
    id: "simple-clean",
    name: "Simple Clean",
    description: "Entry-level friendly, easy to customise",
    style: "minimal",
  },
  {
    id: "academic-research",
    name: "Academic & Research",
    description: "Perfect for academics and researchers",
    style: "academic",
  },
  {
    id: "technical-specialist",
    name: "Technical Specialist",
    description: "Highlight technical skills and projects",
    style: "technical",
  },
  {
    id: "creative-professional",
    name: "Creative Professional",
    description: "Stand out with a creative layout",
    style: "creative",
  },
  {
    id: "healthcare-professional",
    name: "Healthcare Professional",
    description: "Ideal for medical and healthcare roles",
    style: "healthcare",
  },
  {
    id: "compact-efficient",
    name: "Compact Efficient",
    description: "Maximum information in minimal space",
    style: "compact",
  },
  {
    id: "elegant-professional",
    name: "Elegant Professional",
    description: "Sophisticated design for senior roles",
    style: "elegant",
  },
];

function CVPreview({ style }: { style: string }) {
  const baseClasses = "w-full bg-white text-gray-900 p-8 font-serif text-sm leading-relaxed";
  
  if (style === "classic") {
    return (
      <div className={baseClasses}>
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-widest text-gray-800 mb-2">ROBERT MATTHEWS</h1>
          <p className="text-gray-500 uppercase tracking-wider text-sm mb-3">Insert Professional Title</p>
          <p className="text-gray-600 text-xs">07777 777777 | robertmatthews@gmail.com | LinkedIn.com/username | Los Angeles, United States</p>
        </div>
        
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">SUMMARY</h2>
          <p className="text-gray-600 leading-relaxed">
            As one of the first opportunities to make a great first impression, the summary aims to show how you are the ideal candidate for the job. Personalise the summary to the particular job requirements. It could include a brief introduction about yourself, some essential skills, along with key achievements.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">SKILLS</h2>
          <div className="grid grid-cols-3 gap-2 text-gray-600 text-xs">
            <span>Excellent communication skills</span>
            <span>Presentation skills</span>
            <span>Accuracy, attention to detail</span>
            <span>Tact and diplomacy</span>
            <span>MS Office</span>
            <span>Report writing</span>
            <span>Planning and organising</span>
            <span>Working to deadlines</span>
            <span>Team development</span>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">EXPERIENCE</h2>
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <span className="italic text-gray-700">Job Title</span>
                <span className="text-gray-500 ml-2">Company name</span>
              </div>
              <span className="text-gray-500 text-xs">2019-2021</span>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1 ml-2">
              <li>Highlight your achievements and successes using action words, timescales and factual data</li>
              <li>Increased social media followers by 15% over 6 months as team supervisor</li>
              <li>Focus on relevant achievements that relate to the requirements of the job you are applying for</li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <span className="italic text-gray-700">Job Title</span>
                <span className="text-gray-500 ml-2">Company name</span>
              </div>
              <span className="text-gray-500 text-xs">2017-2019</span>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1 ml-2">
              <li>Highlight your achievements using action words and quantifiable results</li>
              <li>Experience should be written in reverse chronological order</li>
            </ul>
          </div>
        </section>
        
        <section>
          <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">EDUCATION</h2>
          <div className="flex justify-between items-baseline">
            <div>
              <span className="italic text-gray-700">Degree / course title</span>
              <span className="text-gray-500 ml-2">| University or College name</span>
            </div>
            <span className="text-gray-500 text-xs">2015-2018</span>
          </div>
          <p className="text-gray-600 text-xs mt-1">Brief information about the course using keywords relevant to the post applied for.</p>
        </section>
      </div>
    );
  }
  
  if (style === "modern") {
    return (
      <div className={`${baseClasses} font-sans`}>
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-1">Sarah Johnson</h1>
          <p className="text-primary font-medium mb-3">Software Engineer</p>
          <p className="text-gray-500 text-xs">sarah@email.com • +44 7700 900000 • London, UK • github.com/sarah</p>
        </div>
        
        <div className="border-l-2 border-primary pl-4 mb-6">
          <p className="text-gray-600">
            Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.
          </p>
        </div>
        
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Experience</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-800">Senior Developer — Tech Company</span>
              <span className="text-gray-500 text-xs">2021 - Present</span>
            </div>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• Led team of 5 developers on microservices architecture migration</li>
              <li>• Reduced API response time by 40% through optimisation</li>
              <li>• Implemented CI/CD pipeline reducing deployment time by 60%</li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-800">Developer — Startup Inc</span>
              <span className="text-gray-500 text-xs">2019 - 2021</span>
            </div>
            <ul className="text-gray-600 text-xs space-y-1">
              <li>• Built React dashboard serving 10,000+ daily users</li>
              <li>• Developed RESTful APIs with Node.js and PostgreSQL</li>
            </ul>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Git"].map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{skill}</span>
            ))}
          </div>
        </section>
        
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Education</h2>
          <div className="flex justify-between">
            <span className="text-gray-800">BSc Computer Science — University of London</span>
            <span className="text-gray-500 text-xs">2015 - 2019</span>
          </div>
        </section>
      </div>
    );
  }
  
  if (style === "executive") {
    return (
      <div className={baseClasses}>
        <div className="text-center mb-8 pb-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">JAMES ANDERSON</h1>
          <p className="text-gray-600 mt-1">Chief Technology Officer</p>
          <p className="text-gray-500 text-xs mt-2">London, UK | james.anderson@email.com | +44 7700 900000</p>
        </div>
        
        <section className="mb-6 bg-gray-50 p-4 border-l-4 border-gray-800">
          <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2">EXECUTIVE PROFILE</h2>
          <p className="text-gray-600 text-sm">
            Visionary technology leader with 15+ years driving digital transformation for FTSE 100 companies. Proven track record of building high-performing teams and delivering £50M+ revenue growth through innovative solutions.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">KEY ACHIEVEMENTS</h2>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>• Led £30M digital transformation programme, achieving 200% ROI within 18 months</li>
            <li>• Built and scaled engineering organisation from 20 to 150+ professionals</li>
            <li>• Established strategic partnerships generating £15M annual recurring revenue</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-800">CTO — Global Tech Corp</span>
              <span className="text-gray-500 text-xs">2018 - Present</span>
            </div>
            <ul className="text-gray-600 text-xs space-y-1 ml-2">
              <li>• Directed technology strategy for £500M revenue business unit</li>
              <li>• Led M&A technical due diligence for 3 successful acquisitions</li>
            </ul>
          </div>
        </section>
        
        <section>
          <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">EDUCATION & CREDENTIALS</h2>
          <p className="text-gray-600 text-sm">MBA, London Business School • BSc Computer Science, Imperial College London</p>
        </section>
      </div>
    );
  }
  
  if (style === "academic") {
    return (
      <div className={baseClasses}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dr. Michael Chen</h1>
          <p className="text-gray-600 text-sm">Associate Professor of Computer Science</p>
          <p className="text-gray-500 text-xs mt-1">m.chen@university.edu | +44 20 7123 4567</p>
        </div>
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-2">RESEARCH INTERESTS</h2>
          <p className="text-gray-600 text-sm">Machine Learning, Natural Language Processing, Human-Computer Interaction</p>
        </section>
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-2">PUBLICATIONS</h2>
          <p className="text-gray-600 text-xs">Chen, M. et al. (2023). "Deep Learning for NLP" - Nature AI, Vol 12</p>
          <p className="text-gray-600 text-xs">Chen, M. (2022). "Transformer Architectures" - ACM Computing Surveys</p>
        </section>
        <section>
          <h2 className="text-xs font-bold tracking-wider text-gray-700 border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
          <p className="text-gray-600 text-sm">PhD Computer Science — MIT, 2015</p>
        </section>
      </div>
    );
  }
  
  if (style === "technical") {
    return (
      <div className={`${baseClasses} font-mono`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Alex Rodriguez</h1>
          <p className="text-primary text-sm">Full Stack Developer</p>
          <p className="text-gray-500 text-xs">alex@dev.io | GitHub: @alexr | London</p>
        </div>
        <section className="mb-5">
          <h2 className="text-xs font-bold text-primary mb-2">// TECH STACK</h2>
          <div className="flex flex-wrap gap-1">
            {["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"].map(skill => (
              <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-mono">{skill}</span>
            ))}
          </div>
        </section>
        <section className="mb-5">
          <h2 className="text-xs font-bold text-primary mb-2">// PROJECTS</h2>
          <p className="text-gray-600 text-xs">• Built microservices platform handling 1M+ requests/day</p>
          <p className="text-gray-600 text-xs">• Open-source contributor to React ecosystem</p>
        </section>
      </div>
    );
  }
  
  if (style === "creative") {
    return (
      <div className={`${baseClasses} font-sans`}>
        <div className="mb-6 border-l-4 border-primary pl-4">
          <h1 className="text-3xl font-light text-gray-900">Sophie Laurent</h1>
          <p className="text-primary font-medium">Creative Director</p>
          <p className="text-gray-500 text-xs mt-1">sophie@creative.co | Portfolio: sophiel.design</p>
        </div>
        <section className="mb-5">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-2">Vision</h2>
          <p className="text-gray-600 text-sm italic">Award-winning creative leader with 10+ years crafting memorable brand experiences.</p>
        </section>
        <section className="mb-5">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-2">Selected Work</h2>
          <p className="text-gray-600 text-xs">• Nike — Global campaign, 50M impressions</p>
          <p className="text-gray-600 text-xs">• Apple — Product launch visual identity</p>
        </section>
      </div>
    );
  }
  
  if (style === "healthcare") {
    return (
      <div className={baseClasses}>
        <div className="text-center mb-6 pb-4 border-b-2 border-primary">
          <h1 className="text-2xl font-bold text-gray-900">Dr. Rachel Green</h1>
          <p className="text-gray-600">Registered Nurse, BSN, RN</p>
          <p className="text-gray-500 text-xs mt-1">rachel.green@nhs.uk | GMC: 7654321</p>
        </div>
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-gray-700 mb-2">CERTIFICATIONS</h2>
          <p className="text-gray-600 text-sm">BLS, ACLS, PALS Certified | NMC Registration Active</p>
        </section>
        <section className="mb-5">
          <h2 className="text-xs font-bold tracking-wider text-gray-700 mb-2">CLINICAL EXPERIENCE</h2>
          <p className="text-gray-600 text-xs">Senior Staff Nurse — St. Mary's Hospital (2019-Present)</p>
          <p className="text-gray-600 text-xs">Emergency Department — Managing 30+ patients per shift</p>
        </section>
      </div>
    );
  }
  
  if (style === "compact") {
    return (
      <div className={`${baseClasses} font-sans text-xs`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">David Kim</h1>
            <p className="text-gray-600">Project Manager</p>
          </div>
          <p className="text-gray-500 text-right text-xs">d.kim@email.com<br/>+44 7890 123456</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <section>
            <h2 className="font-bold text-gray-700 mb-1">Experience</h2>
            <p className="text-gray-600">PM Lead — Tech Corp (2020-Now)</p>
            <p className="text-gray-600">PM — StartupXYZ (2018-2020)</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-700 mb-1">Skills</h2>
            <p className="text-gray-600">Agile, Scrum, JIRA, MS Project, Stakeholder Management</p>
          </section>
        </div>
      </div>
    );
  }
  
  if (style === "elegant") {
    return (
      <div className={baseClasses}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-[0.2em] text-gray-800">VICTORIA PRICE</h1>
          <div className="w-16 h-0.5 bg-primary mx-auto my-3"></div>
          <p className="text-gray-500 text-sm tracking-wider">Senior Marketing Director</p>
          <p className="text-gray-400 text-xs mt-2">victoria@email.com | London | LinkedIn</p>
        </div>
        <section className="mb-6">
          <h2 className="text-center text-xs tracking-[0.3em] text-gray-500 mb-3">PROFILE</h2>
          <p className="text-gray-600 text-sm text-center">Strategic marketing leader with 12+ years driving brand growth for luxury brands.</p>
        </section>
        <section>
          <h2 className="text-center text-xs tracking-[0.3em] text-gray-500 mb-3">EXPERIENCE</h2>
          <p className="text-gray-700 text-sm text-center">Burberry • Louis Vuitton • Chanel</p>
        </section>
      </div>
    );
  }
  
  // minimal style (default)
  return (
    <div className={`${baseClasses} font-sans`}>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Emma Wilson</h1>
        <p className="text-gray-500 text-sm mt-1">emma.wilson@email.com | 07700 900000 | Manchester, UK</p>
      </div>
      
      <section className="mb-5">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Objective</h2>
        <p className="text-gray-700 text-sm">
          Recent marketing graduate seeking entry-level position to apply digital marketing skills and creative problem-solving abilities in a dynamic team environment.
        </p>
      </section>
      
      <section className="mb-5">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Education</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-800">BA Marketing — University of Manchester</span>
          <span className="text-gray-500">2020 - 2024</span>
        </div>
        <p className="text-gray-600 text-xs mt-1">First Class Honours • Relevant modules: Digital Marketing, Consumer Behaviour, Brand Management</p>
      </section>
      
      <section className="mb-5">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Experience</h2>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-800">Marketing Intern — Local Agency</span>
            <span className="text-gray-500">Summer 2023</span>
          </div>
          <ul className="text-gray-600 text-xs space-y-1">
            <li>• Managed social media accounts, growing Instagram following by 25%</li>
            <li>• Assisted with email marketing campaigns reaching 5,000+ subscribers</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Skills</h2>
        <p className="text-gray-600 text-sm">Google Analytics • Adobe Creative Suite • Social Media Management • Content Writing • SEO Basics</p>
      </section>
    </div>
  );
}

function generateDownloadContent(style: string): string {
  const contents: Record<string, string> = {
    classic: `ROBERT MATTHEWS
INSERT PROFESSIONAL TITLE

07777 777777 | robertmatthews@gmail.com | LinkedIn.com/username | Los Angeles, United States

═══════════════════════════════════════════════════════════════════════════════

SUMMARY

As one of the first opportunities to make a great first impression, the summary aims to show how you are the ideal candidate for the job. Personalise the summary to the particular job requirements. It could include a brief introduction about yourself, some essential skills, along with key achievements. It should be clear and concise, focusing on what you can offer the company, rather than what the company can offer you.

═══════════════════════════════════════════════════════════════════════════════

SKILLS

• Excellent communication skills          • Presentation skills
• Accuracy, attention to detail           • Tact and diplomacy
• MS Office                               • Report writing
• Planning and organising                 • Working to deadlines
• Team development

═══════════════════════════════════════════════════════════════════════════════

EXPERIENCE

JOB TITLE
Company name                                                          2019-2021

• Highlight your achievements and successes using action words, timescales and factual data where possible
• For example: Increased social media followers by 15% over 6 months as team supervisor
• Focus on relevant achievements that relate to the requirements of the job you are applying for
• Show how you were an asset to the company and the positive impact you made
• Experience should be written in reverse chronological order, with the most recent first

JOB TITLE
Company name                                                          2017-2019

• Highlight your achievements and successes using action words
• Focus on relevant achievements that relate to the job requirements
• Experience should be written in reverse chronological order

═══════════════════════════════════════════════════════════════════════════════

EDUCATION

Degree / course title | University or College name                    2015-2018

Brief information about the course using keywords relevant to the post applied for, including any essential education and qualifications. Aim to start with the most recent first.`,

    modern: `SARAH JOHNSON
Software Engineer

sarah@email.com • +44 7700 900000 • London, UK • github.com/sarah

───────────────────────────────────────────────────────────────────────────────

Full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

Senior Developer — Tech Company                                   2021 - Present
• Led team of 5 developers on microservices architecture migration
• Reduced API response time by 40% through query optimisation
• Implemented CI/CD pipeline reducing deployment time by 60%

Developer — Startup Inc                                           2019 - 2021
• Built React dashboard serving 10,000+ daily users
• Developed RESTful APIs with Node.js and PostgreSQL
• Collaborated with UX team to improve conversion rate by 25%

───────────────────────────────────────────────────────────────────────────────

SKILLS

Technical: TypeScript, React, Node.js, Python, PostgreSQL, MongoDB
Tools: AWS, Docker, Kubernetes, Git, Jenkins
Methodologies: Agile, Scrum, TDD

───────────────────────────────────────────────────────────────────────────────

EDUCATION

BSc Computer Science — University of London                       2015 - 2019
First Class Honours`,

    executive: `JAMES ANDERSON
Chief Technology Officer

London, UK | james.anderson@email.com | +44 7700 900000 | LinkedIn.com/in/jamesanderson

═══════════════════════════════════════════════════════════════════════════════

EXECUTIVE PROFILE

Visionary technology leader with 15+ years driving digital transformation for FTSE 100 companies. Proven track record of building high-performing teams of 150+ professionals and delivering £50M+ revenue growth through innovative technology solutions. Expert in cloud architecture, data strategy, and agile methodologies.

═══════════════════════════════════════════════════════════════════════════════

KEY ACHIEVEMENTS

• Led £30M digital transformation programme, achieving 200% ROI within 18 months
• Built and scaled engineering organisation from 20 to 150+ professionals across 3 regions
• Established strategic technology partnerships generating £15M annual recurring revenue
• Reduced operational costs by £8M annually through cloud migration and automation

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

GLOBAL TECH CORP
Chief Technology Officer                                          2018 - Present

• Direct technology strategy and execution for £500M revenue business unit
• Lead M&A technical due diligence for 3 successful acquisitions valued at £100M+
• Established AI/ML centre of excellence, launching 5 revenue-generating products

ENTERPRISE SOLUTIONS LTD
VP Engineering                                                    2014 - 2018

• Scaled engineering team from 30 to 80 professionals
• Delivered SaaS platform migration, improving system reliability to 99.99%

═══════════════════════════════════════════════════════════════════════════════

EDUCATION & CREDENTIALS

MBA — London Business School
BSc Computer Science — Imperial College London
AWS Solutions Architect Professional | Certified Scrum Master

═══════════════════════════════════════════════════════════════════════════════

CORE COMPETENCIES

Strategic Planning | P&L Management | Digital Transformation | Team Leadership
Cloud Architecture | Stakeholder Management | M&A Integration | Agile Methodologies`,

    minimal: `EMMA WILSON

emma.wilson@email.com | 07700 900000 | Manchester, UK | linkedin.com/in/emmawilson

───────────────────────────────────────────────────────────────────────────────

OBJECTIVE

Recent marketing graduate seeking entry-level position to apply digital marketing skills and creative problem-solving abilities in a dynamic team environment.

───────────────────────────────────────────────────────────────────────────────

EDUCATION

BA Marketing — University of Manchester                           2020 - 2024
First Class Honours

Relevant Coursework: Digital Marketing, Consumer Behaviour, Brand Management, Market Research

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

Marketing Intern — Local Agency                                   Summer 2023
• Managed social media accounts, growing Instagram following by 25%
• Assisted with email marketing campaigns reaching 5,000+ subscribers
• Created content calendar and scheduled posts across multiple platforms

Student Ambassador — University of Manchester                     2022 - 2024
• Represented university at open days, presenting to groups of 50+ visitors
• Mentored first-year students, improving retention rates

───────────────────────────────────────────────────────────────────────────────

PROJECTS

Digital Marketing Campaign — Final Year Project
• Developed integrated marketing strategy for local business
• Achieved 40% increase in website traffic over 3-month period

───────────────────────────────────────────────────────────────────────────────

SKILLS

Technical: Google Analytics, Adobe Creative Suite, Hootsuite, Mailchimp
Marketing: Social Media Management, Content Writing, SEO, Email Marketing
Soft Skills: Communication, Teamwork, Time Management, Problem Solving`
  };
  
  return contents[style] || contents.classic;
}

export function CVTemplatePreview({ optimizedContent, onClearOptimizedContent }: CVTemplatePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [selectedTemplateForOptimized, setSelectedTemplateForOptimized] = useState<CVTemplate | null>(null);
  const [styleFilters, setStyleFilters] = useState<string[]>([]);
  const [layoutFilters, setLayoutFilters] = useState<string[]>([]);

  const styleOptions = ["Modern", "Traditional", "Creative", "Executive"];
  const layoutOptions = ["1 Column", "2 Column", "Mixed"];

  // Map templates to style categories
  const getTemplateStyleCategory = (style: string): string => {
    const styleMap: Record<string, string> = {
      modern: "Modern",
      technical: "Modern",
      minimal: "Modern",
      classic: "Traditional",
      executive: "Executive",
      elegant: "Executive",
      academic: "Traditional",
      healthcare: "Traditional",
      creative: "Creative",
      compact: "Modern",
    };
    return styleMap[style] || "Traditional";
  };

  // Filter templates based on selected filters
  const filteredTemplates = templates.filter((template) => {
    if (styleFilters.length === 0) return true;
    return styleFilters.includes(getTemplateStyleCategory(template.style));
  });

  const toggleStyleFilter = (style: string) => {
    setStyleFilters((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleLayoutFilter = (layout: string) => {
    setLayoutFilters((prev) =>
      prev.includes(layout) ? prev.filter((l) => l !== layout) : [...prev, layout]
    );
  };

  const downloadAsText = (template: CVTemplate, customContent?: string) => {
    const content = customContent || generateDownloadContent(template.style);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}-cv.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${template.name} downloaded`);
  };

  const downloadAsWord = (template: CVTemplate, customContent?: string) => {
    const content = customContent || generateDownloadContent(template.style);
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
\\f0\\fs22
${content.replace(/\n/g, "\\par\n").replace(/•/g, "\\bullet ").replace(/═/g, "-").replace(/─/g, "-")}
}`;
    
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, "-")}-cv.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${template.name} downloaded (opens in Word)`);
  };

  const downloadAsPdf = (template: CVTemplate, customContent?: string) => {
    const content = customContent || generateDownloadContent(template.style);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${template.name} CV</title>
          <style>
            @page { margin: 0.75in; }
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #1a1a1a;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleUseTemplateWithOptimized = (template: CVTemplate) => {
    setSelectedTemplateForOptimized(template);
    setSelectedTemplate(null);
  };

  // If editing optimized content, show editor fullscreen
  if (optimizedContent && selectedTemplateForOptimized) {
    return (
      <div className="animate-fade-in">
        <CVEditor
          content={optimizedContent}
          style={selectedTemplateForOptimized.style}
          templateName={selectedTemplateForOptimized.name}
          onDownloadTxt={(content) => downloadAsText(selectedTemplateForOptimized, content)}
          onDownloadWord={(content) => downloadAsWord(selectedTemplateForOptimized, content)}
          onDownloadPdf={(content) => downloadAsPdf(selectedTemplateForOptimized, content)}
          onBack={() => setSelectedTemplateForOptimized(null)}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Template Library</h2>
        </div>
        {selectedTemplate && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
              Close
            </Button>
            <Button size="sm" onClick={() => downloadAsPdf(selectedTemplate)}>
              Use Template
            </Button>
          </div>
        )}
      </div>

      {/* Optimized CV Banner */}
      {optimizedContent && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Your Optimized CV is ready</p>
              <p className="text-sm text-muted-foreground">Select a template to format and download</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearOptimizedContent}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-40 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-medium text-foreground mb-3">Styles</h3>
            <div className="space-y-2">
              {styleOptions.map((style) => (
                <label key={style} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styleFilters.includes(style)}
                    onChange={() => toggleStyleFilter(style)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">{style}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-foreground mb-3">Layouts</h3>
            <div className="space-y-2">
              {layoutOptions.map((layout) => (
                <label key={layout} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layoutFilters.includes(layout)}
                    onChange={() => toggleLayoutFilter(layout)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">{layout}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Thumbnail Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`group relative rounded-lg border overflow-hidden transition-all hover:border-primary/50 hover:shadow-md ${
                  selectedTemplate?.id === template.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                {/* Small thumbnail preview */}
                <div className="relative bg-white h-32 overflow-hidden">
                  <div className="transform scale-[0.18] origin-top-left w-[555%]">
                    <CVPreview style={template.style} />
                  </div>
                </div>
                
                {/* Template name */}
                <div className="p-2 bg-card border-t border-border">
                  <p className="text-xs font-medium text-foreground truncate">{template.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Preview */}
        {selectedTemplate && (
          <div className="w-80 flex-shrink-0 border-l border-border pl-6">
            <div className="sticky top-24">
              {/* Template header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary uppercase tracking-wide">
                  {selectedTemplate.name.split(' ')[0]}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              {/* Full preview */}
              <div className="border border-border rounded-lg bg-white overflow-hidden mb-4 max-h-[400px] overflow-y-auto">
                <div className="transform scale-[0.45] origin-top-left w-[222%]">
                  <CVPreview style={selectedTemplate.style} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                {optimizedContent && (
                  <Button
                    className="w-full"
                    onClick={() => handleUseTemplateWithOptimized(selectedTemplate)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Use with My CV
                  </Button>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsText(selectedTemplate)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    TXT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsWord(selectedTemplate)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Word
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadAsPdf(selectedTemplate)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
