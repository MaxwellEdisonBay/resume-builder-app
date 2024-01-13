import { Section } from "@models/domain/Section";
import { defaultSample } from "./default";
import { Content } from "@models/domain/Content";
import moment from "moment";
import { shortDegreeLevels, workTypesNames } from "@utils/textUtils";
import { EducationDegreeLevel } from "@models/api/ContentRs";

const getFormattedDate = (date?: Date) => {
    return date ?  moment(new Date(date)).format("MMM YYYY") : "Present";
}

export const createTexFromSections = (sections: Section[]) => {
  const addEducationContent = (content: Content) => {
    const markup = `\\resumeSubheading
    {${content.title}
    }{${content.location}}
    {${shortDegreeLevels[content.educationDegreeLevel as EducationDegreeLevel]} in ${content.educationMajorName}${content.educationGpa ? `;   \\textbf{GPA: ${content.educationGpa}}` : ""}}{${getFormattedDate(content?.startDate)} \\textbf{--} ${getFormattedDate(content?.endDate)}}`;
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
    {${content.position}}{${getFormattedDate(content?.startDate)} \\textbf{--} ${getFormattedDate(content?.endDate)}, ${content.workType && workTypesNames[content.workType]}}
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
    
    %---------- HEADING ----------
    
    \\begin{center}
        \\textbf{\\Huge \\scshape Aras Güngöre} \\\\ \\vspace{3pt}
        \\small
        \\faMobile \\hspace{.5pt} \\href{tel:905314204536}{+90 531 420 4536}
        $|$
        \\faAt \\hspace{.5pt} \\href{mailto:arasgungore09@gmail.com}{arasgungore09@gmail.com}
        $|$
        \\faLinkedinSquare \\hspace{.5pt} \\href{https://www.linkedin.com/in/arasgungore}{LinkedIn}
        $|$
        \\faGithub \\hspace{.5pt} \\href{https://github.com/arasgungore}{GitHub}
        $|$
        \\faGlobe \\hspace{.5pt} \\href{https://arasgungore.github.io}{Portfolio}
        $|$
        \\faMapMarker \\hspace{.5pt} \\href{https://www.google.com/maps/place/Bogazici+University+North+Campus/@41.0863067,29.0441352,15z/data=!4m5!3m4!1s0x0:0x9d2497b07c8edb2f!8m2!3d41.0863067!4d29.0441352}{Istanbul, Turkey}
    \\end{center}
    
    
    
    ${sections.map((s) => {
        switch (s.type) {
            case "work": return addWorkSection(s)
            case "education": return addEducationSection(s)
            default: return ""
        }
    }).join("\n\n")}
    
    
    
    %----------- SKILLS -----------
    
    \\section{Skills}
      \\vspace{2pt}
      \\resumeSubHeadingListStart
        \\small{\\item{
            
            \\textbf{Languages:}{ C/C++, C\\#, Java, Python, Go, JavaScript, SQL, Scala, MATLAB, R} \\\\ \\vspace{3pt}
            
            \\textbf{Technologies:}{ Django, Node.js, React.js, MySQL, MongoDB, Git, Docker, Amazon Web Services, Unity, Linux, \\\\ \\hspace{67.5pt} Robot Operating System} \\\\ \\vspace{3pt}
            
            \\textbf{Libraries:}{ OpenCV, Scikit-Learn, PyTorch, Keras, TensorFlow, NumPy, Pandas, Matplotlib, Seaborn} \\\\ \\vspace{3pt}
            
        }}
      \\resumeSubHeadingListEnd
    
    
    
    
    
    
    
    %----------- RESEARCH EXPERIENCE -----------
    
    \\section{Research Experience}
      \\vspace{3pt}
      \\resumeSubHeadingListStart
      
        \\resumeSubheading
          {Max Planck Institute for Intelligent Systems}{Stuttgart, Baden\\textbf{-}Württemberg, Germany}
          {Undergraduate Researcher}{Jun 2022 \\textbf{--} Aug 2022, Internship}
            \\resumeItemListStart
                \\resumeItem{Worked in the Robotics, Collectives and Learning subgroup at the Physical Intelligence Department with former Ph.D. students \\href{https://www.linkedin.com/in/sinan-ozgun-demir-981311129/}{\\color{blue}Sinan Özgün Demir} and \\href{https://www.linkedin.com/in/alpkaracakol/}{\\color{blue}Alp Can Karacakol} on a project about 3D printing and heat-assisted magnetic programming of soft machines under the supervision of \\href{https://www.linkedin.com/in/metin-sitti-0a8a712/}{\\color{blue}Prof. Dr. Metin Sitti}.}
                \\resumeItem{Updated a ROS package for converting 3D motion controller events to ROS messages so that it synchronously operates at any given loop rate with C++.}
                \\resumeItem{Implemented an Arduino Mega driver for controlling a fluid dispenser, a laser, thermocouples, and a coil set. Updated ROS nodes for parsing G-codes and controlling stage movement and built the ROS-Arduino communication network to simulate a 3D printing and magnetic programming process with Python.}
                \\resumeItem{Designed the project's system and software architecture, algorithm flowchart, and state machine diagram. Implemented and debugged ROS nodes by validating each corresponding hardware component functions correctly.}
            \\resumeItemListEnd
        
        \\vspace{14pt}
        
        \\resumeSubheading
          {Nanonetworking Research Group, Boğaziçi University}{Istanbul, Turkey}
          {Undergraduate Researcher}{Oct 2021 \\textbf{--} Jun 2022, Part-time}
            \\resumeItemListStart
                \\resumeItem{Worked on the project “Design and Implementation of Molecular Communication Systems Using Index Modulation” under the supervision of \\href{https://www.linkedin.com/in/alipusane/}{\\color{blue}Prof. Dr. Ali Emre Pusane}.}
                \\resumeItem{Simulated the Brownian motion of molecules in a SISO MCvD system and predicted simulation parameters such as receiver radius, diffusion coefficient, and transmitter-receiver distance using CNNs with Keras and TensorFlow.}
                \\resumeItem{Plotted the arrival of molecules per symbol duration in a SISO MCvD system using Binomial, Poisson, and Gaussian model approximations with MATLAB.}
                \\resumeItem{Ran Monte Carlo simulations of the Gaussian model to encode/decode randomized binary sequences in a SISO MCvD system using BCSK modulation technique and calculated the bit error rate on Z-channel.}
            \\resumeItemListEnd
        
      \\resumeSubHeadingListEnd
    
    
    
    %----------- AWARDS & ACHIEVEMENTS -----------
    
    \\section{Awards \\& Achievements}
      \\vspace{2pt}
      \\resumeSubHeadingListStart
        \\small{\\item{
            \\textbf{High Honors Degree:}{ Awarded to Bachelor alumni who have graduated with a GPA greater than or equal to 3.50 by Boğaziçi University. (Jul 2023)} \\\\ \\vspace{3pt}
    
            \\textbf{TÜBİTAK 2247-C Intern Researcher Scholarship:}{ Awarded to undergraduate students who take part in research projects carried out by the Scientific and Technological Research Council of Turkey (TÜBİTAK). (Dec 2021 \\textbf{--} Jun 2022)} \\\\ \\vspace{3pt}
        
            \\textbf{National University Admission Exam (YKS):}{ Ranked $75^{th}$ in Mathematics and Science among ca. 2.3 million candidates with a test score of 489.92/500. (Jul 2018)} \\\\ \\vspace{3pt}
            
            \\textbf{KYK Outstanding Success Scholarship:}{ Awarded to undergraduate students who have been ranked in the top 100 on National University Admission Exam by Higher Education Credit and Hostels Institution (KYK). (Sep 2018 \\textbf{--} Jun 2023)} \\\\ \\vspace{3pt}
            
            % \\textbf{Boğaziçi University Success Scholarship:}{ Awarded to undergraduate students who have been ranked in the top 100 on National University Admission Exam by Boğaziçi University. (Sep 2018 \\textbf{--} Jun 2023)} \\\\ \\vspace{3pt}
            
            % \\textbf{Duolingo English Test (DET):}{ Overall Score: 135/160} \\\\ \\vspace{3pt}
            
            % \\textbf{Boğaziçi University English Proficiency Test (BUEPT):}{ Achieved the highest grade A on the BUEPT grading scheme with a total score in the range of 85-100.} \\\\ \\vspace{3pt}
            
            % \\textbf{Kocaeli Science High School Salutatorian Award:}{ Graduated as the second-highest ranked student in my class.}
        }}
      \\resumeSubHeadingListEnd
    
    
    
    %----------- PROJECTS -----------
    
    \\section{Projects}
        \\vspace{3pt}
        \\resumeSubHeadingListStart
          
          \\resumeProjectHeading
            {\\textbf{Filters and Fractals} $|$ \\emph{\\href{https://github.com/arasgungore/filters-and-fractals}{\\color{blue}GitHub}}}{}
              \\resumeItemListStart
                \\resumeItem{A C project which implements a variety of image processing operations that manipulate the size, filter, brightness, contrast, saturation, and other properties of PPM images from scratch.}
                \\resumeItem{Added recursive fractal generation functions to model popular fractals including Mandelbrot set, Julia set, Koch curve, Barnsley fern, and Sierpinski triangle in PPM format.}
              \\resumeItemListEnd
          
          \\resumeProjectHeading
            {\\textbf{Chess Bot} $|$ \\emph{\\href{https://github.com/arasgungore/chess-bot}{\\color{blue}GitHub}}}{}
              \\resumeItemListStart
                \\resumeItem{A C++ project in which you can play chess against an AI with a specified decision tree depth that uses alpha-beta pruning algorithm to predict the optimal move.}
                \\resumeItem{Aside from basic moves, this mini chess engine also implements chess rules such as castling, en passant, fifty-move rule, threefold repetition, and pawn promotion.}
              \\resumeItemListEnd
          
          \\resumeProjectHeading
            {\\textbf{CMPE 250 Projects} $|$ \\emph{\\href{https://github.com/arasgungore/CMPE250-projects}{\\color{blue}GitHub}}}{}
              \\resumeItemListStart
                \\resumeItem{Five Java projects assigned for the Data Structures and Algorithms (CMPE 250) course in the Fall 2021-22 semester.}
                \\resumeItem{These projects apply DS\\&A concepts such as discrete-event simulation (DES) using priority queues, Dijkstra's shortest path algorithm, Prim's algorithm to find the minimum spanning tree (MST), Dinic's algorithm for maximum flow problems, and weighted job scheduling with dynamic programming to real-world problems.}
              \\resumeItemListEnd
          
        \\resumeSubHeadingListEnd
    
    
    
    %----------- RELEVANT COURSEWORK -----------
    
    % \\section{Relevant Coursework}
      % \\vspace{2pt}
      % \\resumeSubHeadingListStart
        % \\small{\\item{
            % \\textbf{Major coursework:}{ Materials Science, Electrical Circuits I-II, Digital System Design, Numerical Methods, Probability Theory, Electronics I-II, Signals and Systems, Electromagnetic Field Theory, Energy Conversion, System Dynamics and Control, Communication Engineering, Pattern Recognition, Introduction to Digital Signal Processing, Introduction to Digital Communications, Introduction to Database Systems, Introduction to Image Processing, Machine Vision} \\\\ \\vspace{3pt}
            
            % \\textbf{Minor coursework:}{ Discrete Computational Structures, Introduction to Object-Oriented Programming, Data Structures and Algorithms, Computer Organization, Fundamentals of Software Engineering}
        % }}
      % \\resumeSubHeadingListEnd
    
    
    
    %----------- CERTIFICATES -----------
    
    % \\section{Certificates}
      % \\resumeSubHeadingListStart
        
        % \\resumeOrganizationHeading
          % {Procter \\& Gamble VIA Certificate Program}{Feb 2022}{Business Skills, Data and Digital Skills, Project Management and Personal Productivity}
        
      % \\resumeSubHeadingListEnd
    
    
    
    %----------- ORGANIZATIONS -----------
    
    % \\section{Organizations}
      % \\resumeSubHeadingListStart
        
        % \\resumeOrganizationHeading
          % {Institute of Electrical and Electronics Engineers (IEEE)}{Feb 2022 -- Present}{Student Member}
        
      % \\resumeSubHeadingListEnd
    
    
    
    %----------- HOBBIES -----------
    
    \\section{Hobbies}
      \\resumeSubHeadingListStart
        \\small{\\item{Swimming, Fitness, Eight-ball}}
      \\resumeSubHeadingListEnd
    
    
    
    %----------- REFERENCES -----------
    
    \\section{References}
      \\vspace{2pt}
      \\resumeSubHeadingListStart
        \\item{References available upon request.}
      \\resumeSubHeadingListEnd
    
    
    
    %-------------------------------------------
    \\end{document}
    `;

  return markup;
};
