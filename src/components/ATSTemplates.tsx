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
    description: "Clean, traditional format perfect for corporate roles",
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
    description: "Contemporary layout with clear sections for tech roles",
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
    description: "Senior-level format emphasizing leadership and impact",
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
    description: "Ideal for recent graduates and career starters",
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
    // Create a printable HTML page and trigger print dialog for PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${template.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              max-width: 8.5in;
              margin: 0.75in auto;
              padding: 0 0.5in;
              color: #1a1a1a;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Arial, sans-serif;
              font-size: 11pt;
              margin: 0;
            }
            @media print {
              body { margin: 0; padding: 0.5in; }
            }
          </style>
        </head>
        <body>
          <pre>${template.content}</pre>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Print dialog opened - Save as PDF");
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
