"use client";

import { useState, useCallback, useMemo } from "react";
import {
  clients as mockClients,
  complianceTasks as mockTasks,
  documents as mockDocuments,
  activities as mockActivities,
} from "@/lib/data/mock-data";
import type { Client, ComplianceTask, Document, Activity } from "@/lib/data/models";

/* ─── Client Hooks ─── */

export function useClients(filters?: {
  search?: string;
  status?: string;
  entityType?: string;
}) {
  const filtered = useMemo(() => {
    let result = [...mockClients];
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.pan.toLowerCase().includes(s)
      );
    }
    if (filters?.status) {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters?.entityType) {
      result = result.filter((c) => c.entityType === filters.entityType);
    }
    return result;
  }, [filters?.search, filters?.status, filters?.entityType]);

  return { clients: filtered, loading: false };
}

export function useClientDetail(clientId: string | null) {
  const client = useMemo(
    () => mockClients.find((c) => c.id === clientId) || null,
    [clientId]
  );
  const clientTasks = useMemo(
    () => (clientId ? mockTasks.filter((t) => t.clientId === clientId) : []),
    [clientId]
  );
  const clientDocs = useMemo(
    () => (clientId ? mockDocuments.filter((d) => d.clientId === clientId) : []),
    [clientId]
  );
  const clientActivities = useMemo(
    () =>
      clientId
        ? mockActivities.filter((a) => a.clientId === clientId)
        : [],
    [clientId]
  );

  return { client, tasks: clientTasks, documents: clientDocs, activities: clientActivities, loading: false };
}

/* ─── Task Hooks ─── */

export function useTasks(filters?: {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  clientId?: string;
  filter?: string;
}) {
  const filtered = useMemo(() => {
    let result = [...mockTasks];

    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(s) ||
          t.clientName.toLowerCase().includes(s)
      );
    }
    if (filters?.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters?.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters?.category) {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters?.clientId) {
      result = result.filter((t) => t.clientId === filters.clientId);
    }

    // Quick filters
    const now = new Date("2025-08-22");
    const todayStr = now.toISOString().split("T")[0];
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);
    const weekStr = endOfWeek.toISOString().split("T")[0];

    if (filters?.filter === "today") {
      result = result.filter((t) => t.dueDate === todayStr);
    } else if (filters?.filter === "this_week") {
      result = result.filter(
        (t) => t.dueDate >= todayStr && t.dueDate <= weekStr && t.status !== "completed"
      );
    } else if (filters?.filter === "overdue") {
      result = result.filter((t) => t.status === "overdue");
    } else if (filters?.filter === "waiting") {
      result = result.filter((t) => t.status === "awaiting_documents");
    } else if (filters?.filter === "high_priority") {
      result = result.filter((t) => t.priority === "high" || t.priority === "urgent");
    } else if (filters?.filter === "completed") {
      result = result.filter((t) => t.status === "completed");
    }

    return result;
  }, [filters?.search, filters?.status, filters?.priority, filters?.category, filters?.clientId, filters?.filter]);

  return { tasks: filtered, loading: false };
}

export function useTaskDetail(taskId: string | null) {
  const task = useMemo(
    () => (taskId ? mockTasks.find((t) => t.id === taskId) || null : null),
    [taskId]
  );

  return { task, loading: false };
}

/* ─── Mock Mutations (simulate API calls) ─── */

export function useCreateTask() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    return { success: true, task: { ...data, id: `tsk_${Date.now()}` } };
  }, []);

  return { mutate, loading };
}

export function useUpdateTask() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (id: string, data: Record<string, unknown>) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    return { success: true, task: { id, ...data } };
  }, []);

  return { mutate, loading };
}

export function useChangeTaskStatus() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (id: string, status: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    return { success: true };
  }, []);

  return { mutate, loading };
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    return { success: true, client: { ...data, id: `cli_${Date.now()}` } };
  }, []);

  return { mutate, loading };
}

export function useUpdateClient() {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (id: string, data: Record<string, unknown>) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    return { success: true, client: { id, ...data } };
  }, []);

  return { mutate, loading };
}
