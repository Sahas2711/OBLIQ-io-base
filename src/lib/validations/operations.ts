import { z } from "zod";

/* ─── Client Schemas ─── */

export const createClientSchema = z.object({
  name: z
    .string()
    .min(1, "Client name is required")
    .max(200, "Name must be under 200 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "Phone must be under 20 characters")
    .optional()
    .or(z.literal("")),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format (e.g. AABCU1234K)")
    .optional()
    .or(z.literal("")),
  entityType: z.enum(["individual", "company", "partnership", "llp", "huf", "trust"], {
    message: "Select a client type",
  }),
  firmName: z.string().max(200).optional().or(z.literal("")),
  assignedTo: z.string().optional().or(z.literal("")),
  complianceTypes: z.array(z.string()).default([]),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;

/* ─── Task Schemas ─── */

export const createTaskSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(300, "Title must be under 300 characters"),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.enum(
    ["gst", "income_tax", "tds", "roc", "audit", "kyc", "financial_statements"],
    { message: "Select a compliance category" }
  ),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    message: "Select a priority",
  }),
  assignedTo: z.string().optional().or(z.literal("")),
  dueDate: z.string().min(1, "Due date is required"),
  financialYear: z.string().optional().or(z.literal("")),
  period: z.string().optional().or(z.literal("")),
  documentRequired: z.boolean().default(false),
  documentsTotal: z.number().min(0).default(0),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const updateTaskSchema = createTaskSchema.partial();

export const changeTaskStatusSchema = z.object({
  status: z.enum([
    "not_started",
    "in_progress",
    "awaiting_documents",
    "under_review",
    "completed",
    "overdue",
  ]),
});

export const addTaskNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Note cannot be empty")
    .max(2000, "Note must be under 2000 characters"),
});

export const addClientNoteSchema = z.object({
  content: z
    .string()
    .min(1, "Note cannot be empty")
    .max(2000, "Note must be under 2000 characters"),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type ChangeTaskStatusData = z.infer<typeof changeTaskStatusSchema>;
export type AddTaskNoteData = z.infer<typeof addTaskNoteSchema>;
export type AddClientNoteData = z.infer<typeof addClientNoteSchema>;
