import { Section } from "@models/domain/Section";
import { defaultSample } from "./default";
import { Content } from "@models/domain/Content";
import moment from "moment";
import { shortDegreeLevels, workTypesNames } from "@utils/textUtils";
import { EducationDegreeLevel } from "@models/api/ContentRs";
import { IUser } from "@models/domain/IUser";

const getFormattedDate = (date?: Date) => {
  return date ? moment(new Date(date)).format("MMM YYYY") : "Present";
};

export const createTexFromSections = (sections: Section[], userData: IUser) => {
  const addUserHeader = () => {
    const phoneBlock = userData.phone
      ? `\\faMobile \\hspace{.5pt} \\href{tel:${userData.phone}}{${userData.phone}}
      $|$
      `
      : "";
    const linkedinBlock = userData.linkedinUrl
      ? `\\faLinkedinSquare \\hspace{.5pt} \\href{${userData.linkedinUrl}}{LinkedIn}
      $|$
      `
      : "";
    const githubBlock = userData.githubUrl
      ? `
      $|$
      \\faGithub \\hspace{.5pt} \\href{${userData.githubUrl}}{GitHub}`
      : "";
    const portfolioBlock = userData.portfolioUrl
      ? `
      $|$
      \\faGlobe \\hspace{.5pt} \\href{${userData.portfolioUrl}}{Portfolio}`
      : "";
    const locationBlock = userData.location
      ? `
      $|$
      \\faMapMarker \\hspace{.5pt} {${userData.location}}`
      : "";
    return `%---------- HEADING ----------
    
      \\begin{center}
          \\textbf{\\Huge \\scshape ${userData.firstName} ${userData.lastName}} \\\\ \\vspace{3pt}
          \\small
          ${phoneBlock}${linkedinBlock}\\faAt \\hspace{.5pt} \\href{mailto:${userData.displayEmail}}{${userData.displayEmail}}${githubBlock}${portfolioBlock}${locationBlock}
      \\end{center}`;
  };

  const addEducationContent = (content: Content) => {
    const markup = `\\resumeSubheading
    {${content.title}
    }{${content.location}}
    {${
      shortDegreeLevels[content.educationDegreeLevel as EducationDegreeLevel]
    } in ${content.educationMajorName}${
      content.educationGpa ? `;   \\textbf{GPA: ${content.educationGpa}}` : ""
    }}{${getFormattedDate(content?.startDate)} \\textbf{--} ${getFormattedDate(
      content?.endDate
    )}}`;
    return markup;
  };

  const addEducationSection = (section: Section) => {
    const markup = `%----------- EDUCATION -----------
    
        \\section{${section.title}}
          \\vspace{3pt}
          \\resumeSubHeadingListStart

            ${section.content?.map((c) => addEducationContent(c)).join(`\n\n`)}

          \\resumeSubHeadingListEnd`;
    return markup;
  };

  const addWorkContent = (content: Content) => {
    const markup = `\\resumeSubheading
    {${content.title}}{${content.location}}
    {${content.position}}{${getFormattedDate(
      content?.startDate
    )} \\textbf{--} ${getFormattedDate(content?.endDate)}, ${
      content.workType && workTypesNames[content.workType]
    }}
      \\resumeItemListStart
      ${content.bullets?.map((b) => `\\resumeItem{${b.text}}`).join(`\n\n`)}
      \\resumeItemListEnd`;
    return markup;
  };

  const addWorkSection = (section: Section) => {
    const markup = `%----------- WORK EXPERIENCE -----------
    
    \\section{${section.title}}
      \\vspace{3pt}
      \\resumeSubHeadingListStart

        ${section.content?.map((c) => addWorkContent(c)).join(`\n\n`)}

      \\resumeSubHeadingListEnd`;
    return markup;
  };

  const addSkillsContent = (content: Content) => {
    return `\\textbf{${content.title}:}{ ${content.bullets
      ?.map((b) => b.text)
      .join(", ")} } \\\\ \\vspace{3pt}`;
  };

  const addSkillsSection = (section: Section) => {
    return `%----------- SKILLS -----------
    
    \\section{${section.title}}
      \\vspace{2pt}
      \\resumeSubHeadingListStart
        \\small{\\item{
            
          ${section.content?.map((c) => addSkillsContent(c)).join(`\n\n`)}
            
        }}
      \\resumeSubHeadingListEnd`;
  };

  const addProjectsContent = (content: Content) => {
    return `\\resumeProjectHeading
    {\\textbf{${content.title}} $|$ \\emph{\\href{${
      content.githubUrl || content.websiteUrl
    }}{\\color{blue}${
      content.githubUrl ? "Github" : content.websiteUrl ? "Website" : ""
    }}}}{}
      \\resumeItemListStart
        ${content.bullets?.map((b) => `\\resumeItem{${b.text}}`).join("\n")}
      \\resumeItemListEnd`;
  };

  const addProjectsSection = (section: Section) => {
    return `%----------- PROJECTS -----------
    
    \\section{${section.title}}
        \\vspace{3pt}
        \\resumeSubHeadingListStart
          
        ${section.content?.map((c) => addProjectsContent(c)).join(`\n\n`)}
          
        \\resumeSubHeadingListEnd`;
  };

  const markup = `
    \\documentclass[letterpaper,11pt]{article}
    
    \\usepackage{latexsym}
    \\usepackage[empty]{fullpage}
    \\usepackage{titlesec}
    \\usepackage{marvosym}
    \\usepackage[usenames,dvipsnames]{color}
    \\usepackage{verbatim}
    \\usepackage{enumitem}
    \\usepackage[hidelinks]{hyperref}
    \\usepackage{fancyhdr}
    \\usepackage[english]{babel}
    \\usepackage{tabularx}
    \\usepackage{hyphenat}
    \\usepackage{fontawesome}
    \\input{glyphtounicode}
    
    
    %---------- FONT OPTIONS ----------
    % sans-serif
    % \\usepackage[sfdefault]{FiraSans}
    % \\usepackage[sfdefault]{roboto}
    % \\usepackage[sfdefault]{noto-sans}
    % \\usepackage[default]{sourcesanspro}
    
    % serif
    % \\usepackage{CormorantGaramond}
    % \\usepackage{charter}
    
    
    \\pagestyle{fancy}
    \\fancyhf{} % clear all header and footer fields
    \\fancyfoot{}
    \\renewcommand{\\headrulewidth}{0pt}
    \\renewcommand{\\footrulewidth}{0pt}
    
    % Adjust margins
    \\addtolength{\\oddsidemargin}{-0.5in}
    \\addtolength{\\evensidemargin}{-0.5in}
    \\addtolength{\\textwidth}{1in}
    \\addtolength{\\topmargin}{-.5in}
    \\addtolength{\\textheight}{1.0in}
    
    \\urlstyle{same}
    
    \\raggedbottom
    \\raggedright
    \\setlength{\\tabcolsep}{0in}
    
    % Sections formatting
    \\titleformat{\\section}{
      \\vspace{-4pt}\\scshape\\raggedright\\large
    }{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
    
    % Ensure that generate pdf is machine readable/ATS parsable
    \\pdfgentounicode=1
    
    %-------------------------
    % Custom commands
    
    \\newcommand{\\resumeItem}[1]{
      \\item\\small{
        {#1 \\vspace{-2pt}}
      }
    }
    
    
    \\newcommand{\\resumeSubheading}[4]{
      \\vspace{-2pt}\\item
        \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
          \\textbf{#1} & #2 \\\\
          \\textit{\\small#3} & \\textit{\\small #4} \\\\
        \\end{tabular*}\\vspace{-7pt}
    }
    
    
    \\newcommand{\\resumeSubSubheading}[2]{
        \\vspace{-2pt}\\item
        \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
          \\textit{\\small#1} & \\textit{\\small #2} \\\\
        \\end{tabular*}\\vspace{-7pt}
    }
    
    
    \\newcommand{\\resumeEducationHeading}[6]{
      \\vspace{-2pt}\\item
        \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
          \\textbf{#1} & #2 \\\\
          \\textit{\\small#3} & \\textit{\\small #4} \\\\
          \\textit{\\small#5} & \\textit{\\small #6} \\\\
        \\end{tabular*}\\vspace{-5pt}
    }
    
    
    \\newcommand{\\resumeProjectHeading}[2]{
        \\vspace{-2pt}\\item
        \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
          \\small#1 & #2 \\\\
        \\end{tabular*}\\vspace{-7pt}
    }
    
    
    \\newcommand{\\resumeOrganizationHeading}[4]{
      \\vspace{-2pt}\\item
        \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
          \\textbf{#1} & \\textit{\\small #2} \\\\
          \\textit{\\small#3}
        \\end{tabular*}\\vspace{-7pt}
    }
    
    \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
    
    \\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
    
    \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
    \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
    \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
    \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
    
    %-------------------------------------------
    %%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    
    \\begin{document}
    
    ${addUserHeader()}
    
    
    
    ${sections
      .map((s) => {
        switch (s.type) {
          case "work":
            return addWorkSection(s);
          case "education":
            return addEducationSection(s);
          case "projects":
            return addProjectsSection(s);
          case "skills":
            return addSkillsSection(s);
          default:
            return "";
        }
      })
      .join("\n\n")}
    
    %-------------------------------------------
    \\end{document}
    `;

  return markup;
};
