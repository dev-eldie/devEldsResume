import { z } from "zod";

export const StatSchema = z.object({
  value: z.number().int().min(0),
  label: z.string().min(1),
  suffix: z.string().optional().default(""),
});

export const SkillSchema = z.object({
  iconKey: z.enum(["code", "design", "cms", "creative", "commerce"]),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  proficiency: z.number().int().min(0).max(100),
});

export const ExperienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  body: z.string().min(1),
  stack: z.array(z.string()),
});

export const EducationSchema = z.object({
  period: z.string().min(1),
  degree: z.string().min(1),
  school: z.string().min(1),
});

export const ToolSchema = z.object({
  name: z.string().min(1),
  iconKey: z.string().min(1),
});

export const ContentSchema = z.object({
  hero: z.object({
    statusText: z.string(),
    title: z.object({
      l1: z.string(),
      l2grad: z.string(),
      l3stroke: z.string(),
      l3italic: z.string(),
    }),
    blurb: z.string(),
    stats: z.array(StatSchema).length(4),
  }),
  about: z.object({
    eyebrow: z.string(),
    headingLead: z.string(),
    headingGrad: z.string(),
    sub: z.string(),
    objective: z.string(),
    objectiveSecondary: z.string(),
    profile: z.object({
      role: z.string(),
      avatarUrl: z.string().optional().default(""),
      meta: z.array(z.object({ k: z.string(), v: z.string() })).length(4),
    }),
  }),
  skills: z.array(SkillSchema),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  tools: z.array(ToolSchema),
  marquee: z.array(z.string()),
  contact: z.object({
    eyebrow: z.string(),
    headingLead: z.string(),
    headingGrad: z.string(),
    sub: z.string(),
    phone: z.string(),
    email: z.string(),
    portfolio: z.string(),
    portfolioUrl: z.string(),
    location: z.string(),
  }),
  meta: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    logoUrl: z.string().optional().default(""),
  }),
});

export type Content = z.infer<typeof ContentSchema>;
