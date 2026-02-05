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
  coreSkillsGroups: {
    category: string;
    skills: string[];
  }[];
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    dates: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    dates: string;
    details: string;
  }[];
  keyAchievements: string[];
}

interface CVEditorProps {
  content: string;
  style: "classic" | "modern" | "executive" | "minimal" | "academic" | "technical" | "creative" | "healthcare" | "compact" | "elegant";
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
    coreSkillsGroups: [],
    experience: [],
    education: [],
    keyAchievements: []
  };
  
  // Try to extract name from first line
  if (nonEmptyLines[0] && !nonEmptyLines[0].toLowerCase().includes('@') && !nonEmptyLines[0].includes('|') && !nonEmptyLines[0].includes(':')) {
    data.name = nonEmptyLines[0];
  }
  
  // Find sections by keywords
  let currentSection = "";
  let currentContent: string[] = [];
  let unsortedContent: string[] = [];
  
  const sectionKeywords = {
    summary: ["summary", "profile", "objective", "about", "introduction", "overview", "professional summary"],
    skills: ["skills", "competencies", "expertise", "technical skills", "core competencies", "key skills", "technologies", "tools", "core skills"],
    experience: ["experience", "work history", "employment", "professional experience", "career history", "work experience", "professional background"],
    education: ["education", "qualifications", "academic", "certifications", "training", "courses", "education & certifications"],
    achievements: ["key achievements", "achievements", "accomplishments", "highlights"]
  };
  
  for (let i = 1; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const lowerLine = line.toLowerCase().replace(/[:\-_]/g, ' ').trim();
    
    // Check if this is a section header
    let foundSection = "";
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(kw => {
        const isMatch = lowerLine.includes(kw) || lowerLine === kw;
        const isShortLine = line.length < 80;
        const looksLikeHeader = /^[A-Z\s&]+$/.test(line) || line.endsWith(':') || isShortLine;
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
      // Content before any section
      if (!data.contact && (line.includes('@') || (line.includes('|') && line.length < 120) || line.match(/\d{5,}/))) {
        data.contact = data.contact ? `${data.contact} | ${line}` : line;
      } else if (!data.title && i <= 2 && line.length < 80 && !line.includes('@')) {
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
  
  // If still no structured content found, parse the whole content
  if (!data.summary && !data.skills.length && !data.experience.length && !data.education.length) {
    data.summary = content;
  }
  
  return data;
}

function saveSectionContent(data: CVData, section: string, content: string[]) {
  switch (section) {
    case "summary":
      data.summary = content.join('\n');
      break;
    case "skills":
      // Parse skills with potential subcategories
      let currentCategory = "";
      let currentCategorySkills: string[] = [];
      
      for (const line of content) {
        // Check if this is a category header (ends with colon or is short text without bullets)
        if (line.endsWith(':') || (line.length < 50 && !line.startsWith('-') && !line.startsWith('•') && line.includes('&'))) {
          if (currentCategory && currentCategorySkills.length > 0) {
            data.coreSkillsGroups.push({ category: currentCategory, skills: currentCategorySkills });
          }
          currentCategory = line.replace(/:$/, '').trim();
          currentCategorySkills = [];
        } else if (line.startsWith('-') || line.startsWith('•')) {
          const skill = line.replace(/^[-•]\s*/, '').trim();
          if (skill) {
            currentCategorySkills.push(skill);
            data.skills.push(skill);
          }
        } else {
          // Flat skills separated by commas or pipes
          const skills = line.split(/[,|]/).map(s => s.trim()).filter(Boolean);
          currentCategorySkills.push(...skills);
          data.skills.push(...skills);
        }
      }
      if (currentCategory && currentCategorySkills.length > 0) {
        data.coreSkillsGroups.push({ category: currentCategory, skills: currentCategorySkills });
      }
      break;
    case "experience":
      // Parse experience entries - look for job title patterns
      let currentExp: CVData['experience'][0] | null = null;
      
      for (let i = 0; i < content.length; i++) {
        const line = content[i];
        const nextLine = content[i + 1] || "";
        
        // Check for job title line (contains date range pattern like "Month Year – Present" or "Month Year - Month Year")
        const datePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[–-]\s*(?:Present|(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/i;
        const hasDateInLine = datePattern.test(line);
        const hasDateInNextLine = datePattern.test(nextLine);
        
        // Also check for simpler patterns like "2020 - Present"
        const simpleDatePattern = /\d{4}\s*[–-]\s*(?:Present|\d{4})/i;
        const hasSimpleDateInLine = simpleDatePattern.test(line);
        
        if ((hasDateInLine || hasSimpleDateInLine) && !line.startsWith('-') && !line.startsWith('•')) {
          if (currentExp) data.experience.push(currentExp);
          
          // Extract date from line
          const dateMatch = line.match(datePattern) || line.match(simpleDatePattern);
          const dates = dateMatch ? dateMatch[0] : "";
          const titlePart = line.replace(datePattern, '').replace(simpleDatePattern, '').trim();
          
          // Parse "Job Title – Company (Location)" or "Job Title | Location"
          const parts = titlePart.split(/[–—-]|\|/).map(s => s.trim()).filter(Boolean);
          
          currentExp = {
            jobTitle: parts[0] || titlePart,
            company: "",
            location: "",
            dates: dates,
            achievements: []
          };
        } else if (!currentExp && line.length < 100 && !line.startsWith('-') && !line.startsWith('•') && hasDateInNextLine) {
          // This line is likely the job title, next line has the date
          if (currentExp) data.experience.push(currentExp);
          currentExp = {
            jobTitle: line,
            company: "",
            location: "",
            dates: "",
            achievements: []
          };
        } else if (currentExp && (hasDateInLine || hasSimpleDateInLine) && !line.startsWith('-') && !line.startsWith('•') && line.includes('|')) {
          // This is a date + location line like "June 2023 – Present | Leeds"
          const dateMatch = line.match(datePattern) || line.match(simpleDatePattern);
          currentExp.dates = dateMatch ? dateMatch[0] : currentExp.dates;
          const locationMatch = line.split('|').pop()?.trim();
          if (locationMatch && !locationMatch.match(/\d{4}/)) {
            currentExp.location = locationMatch;
          }
        } else if (currentExp && (line.startsWith('-') || line.startsWith('•'))) {
          currentExp.achievements.push(line.replace(/^[-•]\s*/, '').trim());
        } else if (currentExp && line.length < 80 && !line.match(/^\d/) && !currentExp.company) {
          // Likely company name or additional info
          if (line.includes('|')) {
            const parts = line.split('|').map(s => s.trim());
            currentExp.company = parts[0] || "";
            currentExp.location = parts[1] || currentExp.location;
          } else {
            currentExp.company = line;
          }
        } else if (currentExp && line.length > 20) {
          // Long line that's not a bullet - could be a description
          currentExp.achievements.push(line);
        }
      }
      if (currentExp) data.experience.push(currentExp);
      break;
    case "education":
      // Parse multiple education entries
      let currentEdu: CVData['education'][0] | null = null;
      
      for (const line of content) {
        if (line.startsWith('-') || line.startsWith('•')) {
          if (currentEdu) {
            currentEdu.details = currentEdu.details 
              ? `${currentEdu.details}\n${line.replace(/^[-•]\s*/, '').trim()}`
              : line.replace(/^[-•]\s*/, '').trim();
          }
        } else if (line.includes('–') || line.includes('-')) {
          // New education entry
          if (currentEdu) data.education.push(currentEdu);
          const parts = line.split(/[–-]/).map(s => s.trim());
          currentEdu = {
            degree: parts[0] || line,
            institution: parts[1] || "",
            dates: "",
            details: ""
          };
        } else if (!currentEdu) {
          currentEdu = {
            degree: line,
            institution: "",
            dates: "",
            details: ""
          };
        } else if (!currentEdu.institution) {
          currentEdu.institution = line;
        } else {
          currentEdu.details = currentEdu.details ? `${currentEdu.details}\n${line}` : line;
        }
      }
      if (currentEdu) data.education.push(currentEdu);
      break;
    case "achievements":
      for (const line of content) {
        if (line.startsWith('-') || line.startsWith('•')) {
          data.keyAchievements.push(line.replace(/^[-•]\s*/, '').trim());
        } else if (line.length > 10) {
          data.keyAchievements.push(line);
        }
      }
      break;
  }
}

function CVPreviewStyled({ data, style }: { data: CVData; style: string }) {
  // Classic Professional style
  if (style === "classic") {
    return (
      <div className="w-full bg-white text-gray-900 p-6 font-serif text-sm leading-relaxed">
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold tracking-wide text-gray-800 mb-1">{data.name || "YOUR NAME"}</h1>
          {data.contact && <p className="text-gray-600 text-xs">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-700 border-b border-gray-200 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-600 leading-relaxed text-xs whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        
        {(data.coreSkillsGroups.length > 0 || data.skills.length > 0) && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-700 border-b border-gray-200 pb-1 mb-2">CORE SKILLS</h2>
            {data.coreSkillsGroups.length > 0 ? (
              <div className="space-y-2">
                {data.coreSkillsGroups.map((group, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-700">{group.category}:</p>
                    <ul className="text-gray-600 text-xs ml-2">
                      {group.skills.map((skill, j) => (
                        <li key={j}>- {skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-xs">
                {data.skills.map((skill, i) => (
                  <span key={i}>• {skill}{i < data.skills.length - 1 ? ' ' : ''}</span>
                ))}
              </div>
            )}
          </section>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-700 border-b border-gray-200 pb-1 mb-2">PROFESSIONAL EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="mb-1">
                  <p className="font-semibold text-gray-800 text-xs">{exp.jobTitle}</p>
                  <p className="text-gray-600 text-xs">
                    {exp.company}{exp.location && ` | ${exp.location}`}
                    {exp.dates && <span className="float-right">{exp.dates}</span>}
                  </p>
                </div>
                <ul className="text-gray-600 text-xs space-y-0.5 ml-2">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>- {ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-700 border-b border-gray-200 pb-1 mb-2">EDUCATION & CERTIFICATIONS</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-1">
                <p className="text-gray-700 text-xs font-medium">{edu.degree}</p>
                {edu.institution && <p className="text-gray-500 text-xs">{edu.institution}</p>}
                {edu.details && <p className="text-gray-500 text-xs whitespace-pre-line">{edu.details}</p>}
              </div>
            ))}
          </section>
        )}
        
        {data.keyAchievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-widest text-gray-700 border-b border-gray-200 pb-1 mb-2">KEY ACHIEVEMENTS</h2>
            <ul className="text-gray-600 text-xs space-y-0.5">
              {data.keyAchievements.map((ach, i) => (
                <li key={i}>- {ach}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }
  
  // Modern Minimal style
  if (style === "modern") {
    return (
      <div className="w-full bg-white text-gray-900 p-6 font-sans text-sm leading-relaxed">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 mb-1">{data.name || "Your Name"}</h1>
          {data.contact && <p className="text-gray-500 text-xs">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <div className="border-l-2 border-teal-600 pl-3 mb-4">
            <p className="text-gray-600 text-xs whitespace-pre-line">{data.summary}</p>
          </div>
        )}
        
        {(data.coreSkillsGroups.length > 0 || data.skills.length > 0) && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">Core Skills</h2>
            {data.coreSkillsGroups.length > 0 ? (
              <div className="space-y-2">
                {data.coreSkillsGroups.map((group, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium text-gray-700">{group.category}:</p>
                    <ul className="text-gray-600 text-xs ml-2">
                      {group.skills.map((skill, j) => (
                        <li key={j}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{skill}</span>
                ))}
              </div>
            )}
          </section>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between mb-0.5">
                  <span className="font-semibold text-gray-800 text-xs">{exp.jobTitle}</span>
                  {exp.dates && <span className="text-gray-500 text-xs">{exp.dates}</span>}
                </div>
                <p className="text-gray-600 text-xs mb-1">{exp.company}{exp.location && ` | ${exp.location}`}</p>
                <ul className="text-gray-600 text-xs space-y-0.5">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>• {ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">Education & Certifications</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-1">
                <p className="text-gray-800 text-xs font-medium">{edu.degree}</p>
                {edu.institution && <p className="text-gray-600 text-xs">{edu.institution}</p>}
                {edu.details && <p className="text-gray-500 text-xs whitespace-pre-line">{edu.details}</p>}
              </div>
            ))}
          </section>
        )}
        
        {data.keyAchievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">Key Achievements</h2>
            <ul className="text-gray-600 text-xs space-y-0.5">
              {data.keyAchievements.map((ach, i) => (
                <li key={i}>• {ach}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }
  
  // Executive Brief style
  if (style === "executive") {
    return (
      <div className="w-full bg-white text-gray-900 p-6 font-serif text-sm leading-relaxed">
        <div className="text-center mb-6 pb-3 border-b border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">{data.name || "YOUR NAME"}</h1>
          {data.contact && <p className="text-gray-500 text-xs mt-1">{data.contact}</p>}
        </div>
        
        {data.summary && (
          <section className="mb-4 bg-gray-50 p-3 border-l-4 border-gray-800">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-1">EXECUTIVE PROFILE</h2>
            <p className="text-gray-600 text-xs whitespace-pre-line">{data.summary}</p>
          </section>
        )}
        
        {(data.coreSkillsGroups.length > 0 || data.skills.length > 0) && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2 border-b border-gray-300 pb-1">CORE COMPETENCIES</h2>
            {data.coreSkillsGroups.length > 0 ? (
              <div className="space-y-2">
                {data.coreSkillsGroups.map((group, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-700">{group.category}:</p>
                    <ul className="text-gray-600 text-xs ml-2">
                      {group.skills.map((skill, j) => (
                        <li key={j}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="text-gray-600 text-xs space-y-0.5">
                {data.skills.map((skill, i) => (
                  <li key={i}>• {skill}</li>
                ))}
              </ul>
            )}
          </section>
        )}
        
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="mb-1">
                  <p className="font-semibold text-gray-800 text-xs">{exp.jobTitle}</p>
                  <p className="text-gray-600 text-xs">
                    {exp.company}{exp.location && ` | ${exp.location}`}
                    {exp.dates && <span className="float-right">{exp.dates}</span>}
                  </p>
                </div>
                <ul className="text-gray-600 text-xs space-y-0.5 ml-2">
                  {exp.achievements.map((ach, j) => (
                    <li key={j}>• {ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2 border-b border-gray-300 pb-1">EDUCATION & CREDENTIALS</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-1">
                <p className="text-gray-700 text-xs font-medium">{edu.degree}</p>
                {edu.institution && <p className="text-gray-500 text-xs">{edu.institution}</p>}
                {edu.details && <p className="text-gray-500 text-xs whitespace-pre-line">{edu.details}</p>}
              </div>
            ))}
          </section>
        )}
        
        {data.keyAchievements.length > 0 && (
          <section>
            <h2 className="text-xs font-bold tracking-wider text-gray-800 mb-2 border-b border-gray-300 pb-1">KEY ACHIEVEMENTS</h2>
            <ul className="text-gray-600 text-xs space-y-0.5">
              {data.keyAchievements.map((ach, i) => (
                <li key={i}>• {ach}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }
  
  // Minimal / Entry Level style (default)
  return (
    <div className="w-full bg-white text-gray-900 p-6 font-sans text-sm leading-relaxed">
      <div className="mb-4">
        <h1 className="text-xl font-medium text-gray-900">{data.name || "Your Name"}</h1>
        {data.contact && <p className="text-gray-500 text-xs mt-1">{data.contact}</p>}
      </div>
      
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Professional Summary</h2>
          <p className="text-gray-700 text-xs whitespace-pre-line">{data.summary}</p>
        </section>
      )}
      
      {(data.coreSkillsGroups.length > 0 || data.skills.length > 0) && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Core Skills</h2>
          {data.coreSkillsGroups.length > 0 ? (
            <div className="space-y-2">
              {data.coreSkillsGroups.map((group, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-gray-700">{group.category}:</p>
                  <ul className="text-gray-600 text-xs ml-2">
                    {group.skills.map((skill, j) => (
                      <li key={j}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-xs">{data.skills.join(' • ')}</p>
          )}
        </section>
      )}
      
      {data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-800 font-medium">{exp.jobTitle}</span>
                {exp.dates && <span className="text-gray-500">{exp.dates}</span>}
              </div>
              <p className="text-gray-600 text-xs mb-1">{exp.company}{exp.location && ` | ${exp.location}`}</p>
              <ul className="text-gray-600 text-xs space-y-0.5">
                {exp.achievements.map((ach, j) => (
                  <li key={j}>• {ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      
      {data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-1">
              <p className="text-gray-800 text-xs font-medium">{edu.degree}</p>
              {edu.institution && <p className="text-gray-600 text-xs">{edu.institution}</p>}
              {edu.details && <p className="text-gray-500 text-xs whitespace-pre-line">{edu.details}</p>}
            </div>
          ))}
        </section>
      )}
      
      {data.keyAchievements.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Key Achievements</h2>
          <ul className="text-gray-600 text-xs space-y-0.5">
            {data.keyAchievements.map((ach, i) => (
              <li key={i}>• {ach}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function generateFormattedContent(data: CVData, style: string): string {
  let content = "";
  
  // Generate skills section with groups if available
  const skillsSection = data.coreSkillsGroups.length > 0
    ? data.coreSkillsGroups.map(g => `${g.category}:\n${g.skills.map(s => `- ${s}`).join('\n')}`).join('\n\n')
    : data.skills.map(s => `• ${s}`).join('\n');
  
  // Generate achievements section if available
  const achievementsSection = data.keyAchievements.length > 0
    ? `\n\n═══════════════════════════════════════════════════════════════════════════════\n\nKEY ACHIEVEMENTS\n\n${data.keyAchievements.map(a => `- ${a}`).join('\n')}`
    : '';
  
  if (style === "classic" || style === "executive") {
    content = `${data.name.toUpperCase()}
${data.contact}

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL SUMMARY

${data.summary}

═══════════════════════════════════════════════════════════════════════════════

CORE SKILLS

${skillsSection}

═══════════════════════════════════════════════════════════════════════════════

PROFESSIONAL EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle}
${exp.company}${exp.location ? ` | ${exp.location}` : ''}${exp.dates ? `                                       ${exp.dates}` : ''}

${exp.achievements.map(a => `- ${a}`).join('\n')}`).join('\n\n')}

═══════════════════════════════════════════════════════════════════════════════

EDUCATION & CERTIFICATIONS

${data.education.map(edu => `${edu.degree}
${edu.institution || ''}
${edu.details || ''}`).join('\n\n')}${achievementsSection}`;
  } else if (style === "modern") {
    content = `${data.name}
${data.contact}

───────────────────────────────────────────────────────────────────────────────

${data.summary}

───────────────────────────────────────────────────────────────────────────────

CORE SKILLS

${skillsSection}

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle} — ${exp.company}${exp.location ? ` | ${exp.location}` : ''}
${exp.dates}

${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

───────────────────────────────────────────────────────────────────────────────

EDUCATION & CERTIFICATIONS

${data.education.map(edu => `${edu.degree}
${edu.institution || ''}
${edu.details || ''}`).join('\n\n')}${achievementsSection.replace(/═/g, '─')}`;
  } else {
    // Minimal
    content = `${data.name}
${data.contact}

───────────────────────────────────────────────────────────────────────────────

PROFESSIONAL SUMMARY

${data.summary || data.title}

───────────────────────────────────────────────────────────────────────────────

CORE SKILLS

${skillsSection}

───────────────────────────────────────────────────────────────────────────────

EXPERIENCE

${data.experience.map(exp => `${exp.jobTitle} — ${exp.company}${exp.location ? ` | ${exp.location}` : ''}
${exp.dates}

${exp.achievements.map(a => `• ${a}`).join('\n')}`).join('\n\n')}

───────────────────────────────────────────────────────────────────────────────

EDUCATION

${data.education.map(edu => `${edu.degree}
${edu.institution || ''}
${edu.details || ''}`).join('\n\n')}${achievementsSection.replace(/═/g, '─')}`;
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
      experience: [...prev.experience, { jobTitle: "", company: "", location: "", dates: "", achievements: [""] }]
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
          <div className="relative bg-white rounded-lg overflow-hidden border shadow-sm overflow-y-auto">
            <CVPreviewStyled data={cvData} style={style} />
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
