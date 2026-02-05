import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, Edit3, Trash2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

interface CVData {
  name: string;
  title: string;
  contact: string;
  summary: string;
  skills: string[];
  experience: {
    jobTitle: string;
    company: string;
    dates: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    dates: string;
    details: string;
  }[];
}

interface CVEditorProps {
  content: string;
  style: "classic" | "modern" | "executive" | "minimal";
  templateName: string;
  onDownloadTxt: (content: string) => void;
  onDownloadWord: (content: string) => void;
  onDownloadPdf: (content: string) => void;
  onBack: () => void;
}

function parseOptimizedCV(content: string): CVData {
  const lines = content.split('\n');
  const nonEmptyLines = lines.map(l => l.trim()).filter(Boolean);
  
  // Default structure
  const data: CVData = {
    name: "",
    title: "",
    contact: "",
    summary: "",
    skills: [],
    experience: [],
    education: []
  };
  
  // Try to extract name from first line (usually uppercase or title case, no special chars)
  if (nonEmptyLines[0] && !nonEmptyLines[0].toLowerCase().includes('@') && !nonEmptyLines[0].includes('|') && !nonEmptyLines[0].includes(':')) {
    data.name = nonEmptyLines[0];
  }
  
  // Find sections by keywords
  let currentSection = "";
  let currentContent: string[] = [];
  let unsortedContent: string[] = [];
  
  const sectionKeywords = {
    summary: ["summary", "profile", "objective", "about", "introduction", "overview"],
    skills: ["skills", "competencies", "expertise", "technical skills", "core competencies", "key skills", "technologies", "tools"],
    experience: ["experience", "work history", "employment", "professional experience", "career history", "work experience", "professional background"],
    education: ["education", "qualifications", "academic", "certifications", "training", "courses"]
  };
  
  for (let i = 1; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const lowerLine = line.toLowerCase().replace(/[:\-_]/g, ' ');
    
    // Check if this is a section header (short line with section keyword)
    let foundSection = "";
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(kw => {
        const isMatch = lowerLine.includes(kw);
        const isShortLine = line.length < 60;
        const looksLikeHeader = /^[A-Z\s]+$/.test(line) || line.endsWith(':') || isShortLine;
        return isMatch && looksLikeHeader;
      })) {
        foundSection = section;
        break;
      }
    }
    
    if (foundSection) {
      // Save previous section content
      if (currentSection && currentContent.length > 0) {
        saveSectionContent(data, currentSection, currentContent);
      }
      currentSection = foundSection;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    } else {
      // Content before any section - try to categorize
      if (!data.contact && (line.includes('@') || (line.includes('|') && line.length < 100) || line.match(/\d{5,}/))) {
        data.contact = data.contact ? `${data.contact} | ${line}` : line;
      } else if (!data.title && i <= 2 && line.length < 60 && !line.includes('@')) {
        data.title = line;
      } else {
        unsortedContent.push(line);
      }
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    saveSectionContent(data, currentSection, currentContent);
  }
  
  // Add unsorted content to summary if summary is empty
  if (unsortedContent.length > 0) {
    const unsortedText = unsortedContent.join('\n');
    data.summary = data.summary ? `${data.summary}\n\n${unsortedText}` : unsortedText;
  }
  
  // If still no structured content found, parse the whole content more aggressively
  if (!data.summary && !data.skills.length && !data.experience.length && !data.education.length) {
    // Put all content into summary for manual editing
    data.summary = content;
  }
  
  // If no experience found but there are bullet points in summary, try to extract them
  if (data.experience.length === 0 && data.summary) {
    const bulletLines = data.summary.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));
    if (bulletLines.length > 3) {
      // Looks like experience, create a placeholder
      data.experience.push({
        jobTitle: "Position",
        company: "Company",
        dates: "",
        achievements: bulletLines.map(l => l.replace(/^[•\-*]\s*/, '').trim())
      });
    }
  }
  
  return data;
}

function saveSectionContent(data: CVData, section: string, content: string[]) {
  switch (section) {
    case "summary":
      data.summary = content.join('\n');
      break;
    case "skills":
      data.skills = content.flatMap(line => 
        line.split(/[,•|]/).map(s => s.trim()).filter(Boolean)
      );
      break;
    case "experience":
      // Parse experience entries
      let currentExp: CVData['experience'][0] | null = null;
      for (const line of content) {
        if (line.match(/\d{4}/) && !line.startsWith('•') && !line.startsWith('-')) {
          if (currentExp) data.experience.push(currentExp);
          const parts = line.split(/[—–-]|(\d{4})/).map(s => s?.trim()).filter(Boolean);
          currentExp = {
            jobTitle: parts[0] || line,
            company: parts[1] || "",
            dates: parts.find(p => p?.match(/\d{4}/)) || "",
            achievements: []
          };
        } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
          currentExp.achievements.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (currentExp) {
          currentExp.achievements.push(line);
        }
      }
      if (currentExp) data.experience.push(currentExp);
      break;
    case "education":
      data.education.push({
        degree: content[0] || "",
        institution: content[1] || "",
        dates: content.find(l => l.match(/\d{4}/)) || "",
        details: content.slice(1).join('\n')
      });
      break;
  }
}

function CVPreviewStyled({ data, style }: { data: CVData; style: string }) {
  if (style === "classic") {
    return (
      <div className="w-full bg-white text-gray-900 p-8 font-serif text-sm leading-relaxed min-h-[600px]">
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-widest text-gray-800 mb-2">{data.name || "YOUR NAME"}</h1>
          {data.title && <p className="text-gray-500 uppercase tracking-wider text-sm mb-3">{data.title}</p>}
          {data.contact && <p className="text-gray-600 text-xs">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">SUMMARY</h2>
            <p className="text-gray-600 leading-relaxed text-xs">{data.summary}</p>
          </section>
        )}
        
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">SKILLS</h2>
            <div className="grid grid-cols-3 gap-2 text-gray-600 text-xs">
              {data.skills.slice(0, 12).map((skill, i) => (
                <span key={i}>• {skill}</span>
              ))}
            </div>
          </section>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="italic text-gray-700">{exp.jobTitle}</span>
                    {exp.company && <span className="text-gray-500 ml-2">{exp.company}</span>}
                  </div>
                  {exp.dates && <span className="text-gray-500 text-xs">{exp.dates}</span>}
                </div>
                <ul className="list-disc list-inside text-gray-600 text-xs space-y-1 ml-2">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-700 border-b border-gray-200 pb-2 mb-3">EDUCATION</h2>
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="italic text-gray-700">{edu.degree}</span>
                  {edu.dates && <span className="text-gray-500 text-xs">{edu.dates}</span>}
                </div>
                {edu.institution && <p className="text-gray-500 text-xs">{edu.institution}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }
  
  if (style === "modern") {
    return (
      <div className="w-full bg-white text-gray-900 p-8 font-sans text-sm leading-relaxed min-h-[600px]">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-1">{data.name || "Your Name"}</h1>
          {data.title && <p className="text-teal-600 font-medium mb-3">{data.title}</p>}
          {data.contact && <p className="text-gray-500 text-xs">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <div className="border-l-2 border-teal-600 pl-4 mb-6">
            <p className="text-gray-600 text-sm">{data.summary}</p>
          </div>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-800">{exp.jobTitle}{exp.company && ` — ${exp.company}`}</span>
                  {exp.dates && <span className="text-gray-500 text-xs">{exp.dates}</span>}
                </div>
                <ul className="text-gray-600 text-xs space-y-1">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>• {ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{skill}</span>
              ))}
            </div>
          </section>
        )}
        
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-800">{edu.degree}{edu.institution && ` — ${edu.institution}`}</span>
                {edu.dates && <span className="text-gray-500 text-xs">{edu.dates}</span>}
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }
  
  if (style === "executive") {
    return (
      <div className="w-full bg-white text-gray-900 p-8 font-serif text-sm leading-relaxed min-h-[600px]">
        <div className="text-center mb-8 pb-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">{data.name || "YOUR NAME"}</h1>
          {data.title && <p className="text-gray-600 mt-1">{data.title}</p>}
          {data.contact && <p className="text-gray-500 text-xs mt-2">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <section className="mb-6 bg-gray-50 p-4 border-l-4 border-gray-800">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2">EXECUTIVE PROFILE</h2>
            <p className="text-gray-600 text-sm">{data.summary}</p>
          </section>
        )}
        
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">KEY ACHIEVEMENTS</h2>
            <ul className="text-gray-600 text-sm space-y-2">
              {data.skills.slice(0, 4).map((skill, i) => (
                <li key={i}>• {skill}</li>
              ))}
            </ul>
          </section>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-800">{exp.jobTitle}{exp.company && ` — ${exp.company}`}</span>
                  {exp.dates && <span className="text-gray-500 text-xs">{exp.dates}</span>}
                </div>
                <ul className="text-gray-600 text-xs space-y-1 ml-2">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>• {ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-1">EDUCATION & CREDENTIALS</h2>
            <p className="text-gray-600 text-sm">
              {data.education.map(edu => `${edu.degree}${edu.institution ? ` — ${edu.institution}` : ''}`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    );
  }
  
  // minimal
  return (
    <div className="w-full bg-white text-gray-900 p-8 font-sans text-sm leading-relaxed min-h-[600px]">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">{data.name || "Your Name"}</h1>
        {data.contact && <p className="text-gray-500 text-sm mt-1">{data.contact}</p>}
      </div>
      
      {(data.summary || data.title) && (
        <section className="mb-5">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Objective</h2>
          <p className="text-gray-700 text-sm">{data.summary || data.title}</p>
        </section>
      )}
      
      {data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-800">{edu.degree}{edu.institution && ` — ${edu.institution}`}</span>
              {edu.dates && <span className="text-gray-500">{edu.dates}</span>}
            </div>
          ))}
        </section>
      )}
      
      {data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-800">{exp.jobTitle}{exp.company && ` — ${exp.company}`}</span>
                {exp.dates && <span className="text-gray-500">{exp.dates}</span>}
              </div>
              <ul className="text-gray-600 text-xs space-y-1">
                {exp.achievements.map((ach, j) => (
                  <li key={j}>• {ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Skills</h2>
          <p className="text-gray-600 text-sm">{data.skills.join(' • ')}</p>
        </section>
      )}
    </div>
  );
}

function generateFormattedContent(data: CVData, style: string): string {
  let content = "";
  
  if (style === "classic") {
    content = `${data.name.toUpperCase()}
${data.title ? data.title.toUpperCase() : ''}

${data.contact}

═══════════════════════════════════════════════════════════════════════════════

SUMMARY

${data.summary}

═══════════════════════════════════════════════════════════════════════════════

SKILLS

${data.skills.map(s => `• ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════

EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle}
${exp.company}${exp.dates ? `                                                          ${exp.dates}` : ''}

${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════════════════

EDUCATION

${data.education.map(edu => `${edu.degree} | ${edu.institution}${edu.dates ? `                    ${edu.dates}` : ''}
${edu.details || ''}`).join('\n')}`;
  } else if (style === "modern") {
    content = `${data.name}
${data.title}

${data.contact}

───────────────────────────────────────────────────────────────────────────────

${data.summary}

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle} — ${exp.company}                               ${exp.dates}
${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

───────────────────────────────────────────────────────────────────────────────

SKILLS

Technical: ${data.skills.join(', ')}

───────────────────────────────────────────────────────────────────────────────

EDUCATION

${data.education.map(edu => `${edu.degree} — ${edu.institution}                       ${edu.dates}`).join('\n')}`;
  } else if (style === "executive") {
    content = `${data.name.toUpperCase()}
${data.title}

${data.contact}

═══════════════════════════════════════════════════════════════════════════════

EXECUTIVE PROFILE

${data.summary}

═══════════════════════════════════════════════════════════════════════════════

KEY ACHIEVEMENTS

${data.skills.slice(0, 4).map(s => `• ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

${data.experience.map(exp => `${exp.company.toUpperCase()}
${exp.jobTitle}                                                   ${exp.dates}

${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════════════════

EDUCATION & CREDENTIALS

${data.education.map(edu => `${edu.degree} — ${edu.institution}`).join('\n')}`;
  } else {
    // minimal
    content = `${data.name}

${data.contact}

───────────────────────────────────────────────────────────────────────────────

OBJECTIVE

${data.summary || data.title}

───────────────────────────────────────────────────────────────────────────────

EDUCATION

${data.education.map(edu => `${edu.degree} — ${edu.institution}                       ${edu.dates}
${edu.details || ''}`).join('\n')}

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle} — ${exp.company}                               ${exp.dates}
${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

───────────────────────────────────────────────────────────────────────────────

SKILLS

${data.skills.join(' • ')}`;
  }
  
  return content.trim();
}

export function CVEditor({ content, style, templateName, onDownloadTxt, onDownloadWord, onDownloadPdf, onBack }: CVEditorProps) {
  const [mode, setMode] = useState<"preview" | "edit" | "raw">("preview");
  const [cvData, setCvData] = useState<CVData>(() => parseOptimizedCV(content));
  const [rawContent, setRawContent] = useState(content);
  
  const updateField = (field: keyof CVData, value: any) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateExperience = (index: number, field: keyof CVData['experience'][0], value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const updateEducation = (index: number, field: keyof CVData['education'][0], value: any) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { jobTitle: "", company: "", dates: "", achievements: [""] }]
    }));
  };
  
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", dates: "", details: "" }]
    }));
  };
  
  const deleteExperience = (index: number) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    toast.success("Experience entry removed");
  };
  
  const deleteEducation = (index: number) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    toast.success("Education entry removed");
  };
  
  const formattedContent = generateFormattedContent(cvData, style);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to templates
        </Button>
        <div className="flex gap-2">
          <Tabs value={mode} onValueChange={(v) => setMode(v as "preview" | "edit" | "raw")}>
            <TabsList>
              <TabsTrigger value="preview">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                Design
              </TabsTrigger>
              <TabsTrigger value="raw">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Raw
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{templateName}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Full Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
              <VisuallyHidden>
                <DialogTitle>Full CV Preview</DialogTitle>
              </VisuallyHidden>
              <div className="sticky top-0 bg-background border-b p-4">
                <h3 className="font-semibold">Full Preview: {templateName}</h3>
              </div>
              <div className="p-4">
                <div className="border rounded-lg shadow-lg overflow-hidden">
                  <CVPreviewStyled data={cvData} style={style} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {mode === "preview" && (
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="aspect-[8.5/11] overflow-hidden">
              <div className="transform scale-[0.5] origin-top-left w-[200%]">
                <CVPreviewStyled data={cvData} style={style} />
              </div>
            </div>
          </div>
        )}
        
        {mode === "raw" && (
          <div className="space-y-4">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This is the original optimized CV content from the AI. You can copy it or edit it directly.
              </p>
            </div>
            <Textarea 
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="min-h-[400px] font-mono text-xs"
              placeholder="Your optimized CV content..."
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(rawContent);
                  toast.success("Copied to clipboard");
                }}
              >
                Copy All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCvData(parseOptimizedCV(rawContent));
                  toast.success("Re-parsed CV content");
                  setMode("edit");
                }}
              >
                Re-parse & Edit
              </Button>
            </div>
          </div>
        )}
        
        {mode === "edit" && (
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {/* Personal Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-foreground border-b pb-1">Personal Information</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input 
                    value={cvData.name} 
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label className="text-xs">Professional Title</Label>
                  <Input 
                    value={cvData.title} 
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Contact Details</Label>
                <Input 
                  value={cvData.contact} 
                  onChange={(e) => updateField('contact', e.target.value)}
                  placeholder="email@example.com | +44 7700 900000 | London, UK"
                />
              </div>
            </div>
            
            {/* Summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground border-b pb-1">Summary</h4>
              <Textarea 
                value={cvData.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="Brief professional summary..."
                rows={3}
              />
            </div>
            
            {/* Skills */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground border-b pb-1">Skills</h4>
              <Textarea 
                value={cvData.skills.join(', ')}
                onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Skill 1, Skill 2, Skill 3..."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>
            
            {/* Experience */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1">
                <h4 className="font-medium text-sm text-foreground">Experience</h4>
                <Button variant="ghost" size="sm" onClick={addExperience}>+ Add</Button>
              </div>
              {cvData.experience.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No experience entries. Click "+ Add" to add one.</p>
              )}
              {cvData.experience.map((exp, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg space-y-2 relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid gap-2 sm:grid-cols-2 flex-1">
                      <Input 
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(i, 'jobTitle', e.target.value)}
                        placeholder="Job Title"
                      />
                      <Input 
                        value={exp.company}
                        onChange={(e) => updateExperience(i, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteExperience(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input 
                    value={exp.dates}
                    onChange={(e) => updateExperience(i, 'dates', e.target.value)}
                    placeholder="2020 - Present"
                  />
                  <Textarea 
                    value={exp.achievements.join('\n')}
                    onChange={(e) => updateExperience(i, 'achievements', e.target.value.split('\n').filter(Boolean))}
                    placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                    rows={4}
                  />
                </div>
              ))}
            </div>
            
            {/* Education */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1">
                <h4 className="font-medium text-sm text-foreground">Education</h4>
                <Button variant="ghost" size="sm" onClick={addEducation}>+ Add</Button>
              </div>
              {cvData.education.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No education entries. Click "+ Add" to add one.</p>
              )}
              {cvData.education.map((edu, i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid gap-2 sm:grid-cols-2 flex-1">
                      <Input 
                        value={edu.degree}
                        onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                        placeholder="Degree / Course"
                      />
                      <Input 
                        value={edu.institution}
                        onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                        placeholder="University / Institution"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteEducation(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input 
                    value={edu.dates}
                    onChange={(e) => updateEducation(i, 'dates', e.target.value)}
                    placeholder="2015 - 2019"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Download buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadTxt(formattedContent)}
            className="flex-1"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            TXT
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadWord(formattedContent)}
            className="flex-1"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Word
          </Button>
          <Button
            size="sm"
            onClick={() => onDownloadPdf(formattedContent)}
            className="flex-1"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
