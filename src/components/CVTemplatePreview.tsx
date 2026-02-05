import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: "classic" | "modern" | "executive" | "minimal";
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
  
  // minimal style
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

export function CVTemplatePreview() {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const downloadAsText = (template: CVTemplate) => {
    const content = generateDownloadContent(template.style);
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

  const downloadAsWord = (template: CVTemplate) => {
    const content = generateDownloadContent(template.style);
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

  const downloadAsPdf = (template: CVTemplate) => {
    const content = generateDownloadContent(template.style);
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
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Arial, sans-serif;
              font-size: 11pt;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
          <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Print dialog opened - Save as PDF");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">ATS-Friendly CV Templates</h2>
        <p className="mt-2 text-muted-foreground">
          Professional templates designed to pass Applicant Tracking Systems
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
          >
            {/* Preview thumbnail */}
            <div className="relative bg-gray-100 p-4 h-64 overflow-hidden">
              <div className="transform scale-[0.35] origin-top-left w-[280%]">
                <CVPreview style={template.style} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100" />
              
              {/* Preview overlay button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all group-hover:bg-black/20">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
                  <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                  </div>
                  <div className="p-4">
                    <div className="border rounded-lg shadow-lg overflow-hidden">
                      <CVPreview style={template.style} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Info and actions */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{template.description}</p>
              
              <div className="flex gap-2">
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
                  onClick={() => downloadAsWord(template)}
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
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-accent/50 p-4 text-center">
        <p className="text-sm text-accent-foreground">
          <strong>Pro tip:</strong> These templates use simple formatting, standard fonts, and avoid tables/graphics for maximum ATS compatibility.
        </p>
      </div>
    </div>
  );
}
