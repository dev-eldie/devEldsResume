export const profile = {
  name: "Eldie Arubang",
  firstName: "Eldie",
  lastName: "Arubang",
  role: "Process Expert",
  title: "Front-End Developer & UI/UX Designer",
  dob: "March 26, 1987",
  location: "Quezon City, Philippines",
  phone: "+63 9.15.888.3807",
  email: "eldiearubang@yahoo.com",
  page: "behance.net/earubang",
  pageUrl: "https://behance.net/earubang",
  stats: [
    { value: "43", label: "Projects shipped" },
    { value: "15", label: "Years in the craft" },
    { value: "5", label: "Companies" },
    { value: "∞", label: "Pixels nudged" },
  ],
  objective:
    "A results-driven Front-End Developer & UI/UX Designer with over a decade of experience designing and developing web applications, optimizing user experience, and implementing creative digital solutions. Passionate about crafting intuitive and visually appealing interfaces that enhance usability and engagement.",
} as const;

export type Skill = {
  name: string;
  level: number; // 0-100
  group: "code" | "tools" | "soft";
};

export const skills: Skill[] = [
  { name: "HTML / CSS / JavaScript", level: 96, group: "code" },
  { name: "ReactJS / VueJS / TypeScript", level: 92, group: "code" },
  { name: "WordPress / PHP / MySQL", level: 88, group: "code" },
  { name: "Shopify / Liquid", level: 86, group: "code" },
  { name: "PostgreSQL / NoSQL", level: 82, group: "code" },
  { name: "Figma", level: 95, group: "tools" },
  { name: "Adobe XD", level: 88, group: "tools" },
  { name: "Adobe Photoshop", level: 90, group: "tools" },
  { name: "Adobe Illustrator", level: 84, group: "tools" },
  { name: "UI / UX Design", level: 94, group: "soft" },
  { name: "Creative Direction", level: 86, group: "soft" },
  { name: "Team Collaboration", level: 92, group: "soft" },
  { name: "Social Media Marketing", level: 78, group: "soft" },
];

export type Job = {
  range: string;
  title: string;
  company: string;
  blurb: string;
  tags: string[];
};

export const jobs: Job[] = [
  {
    range: "Mar 2020 — Jan 2025",
    title: "Process Expert · Front-End Developer",
    company: "Henkel Asia Pacific Service Centre",
    blurb:
      "Collaborated with stakeholders to design and maintain internal calculators and UI/UX for web applications. Used React.js and vanilla JavaScript to elevate the user experience.",
    tags: ["React", "JavaScript", "UI/UX", "Internal tools"],
  },
  {
    range: "Mar 2018 — May 2019",
    title: "Front-End Developer & UI/UX Designer",
    company: "Sigway Higgs Groups Limited",
    blurb:
      "Developed custom WordPress themes and plugins, ensuring pixel-perfect designs. Converted PSDs to HTML with a focus on UI/UX enhancements.",
    tags: ["WordPress", "PSD → HTML", "Pixel-perfect", "Plugins"],
  },
  {
    range: "Jul 2016 — Oct 2017",
    title: "Front-End Developer & Graphic Designer",
    company: "Sourcefit Philippines",
    blurb:
      "Created custom templates and post types based on mockups. Designed and developed website functionalities, optimized for SEO. Produced graphics and logos for in-house projects.",
    tags: ["Custom CMS", "SEO", "Graphics", "Logos"],
  },
  {
    range: "May 2015 — Apr 2016",
    title: "Front-End Developer",
    company: "Outsourced Quality Assured Services",
    blurb:
      "Advocated for web interaction best practices with a focus on consistency and usability. Built reusable code libraries and validated user input. Worked on an e-commerce platform for an Australian client, customizing functionalities with JavaScript.",
    tags: ["E-commerce", "Reusable libs", "JavaScript", "Australia"],
  },
  {
    range: "Mar 2011 — Feb 2015",
    title: "Lead Front-End Developer",
    company: "Big Sky Group",
    blurb:
      "Led front-end work with a focus on consistency and usability. Built reusable component libraries, validated user input, and customized e-commerce functionality for international clients.",
    tags: ["Lead", "Component libs", "E-commerce", "Mentoring"],
  },
];

export type EducationEntry = {
  range: string;
  course: string;
  school: string;
  place: string;
  type: "degree" | "short";
};

export const education: EducationEntry[] = [
  {
    range: "2004 — 2008",
    course: "BSIT — Software Development",
    school: "STI College",
    place: "Philippines",
    type: "degree",
  },
  {
    range: "2008 — 2010",
    course: "PHP Programming · Java EE Programming",
    school: "Phonix-One Institute",
    place: "Philippines · short courses",
    type: "short",
  },
];
