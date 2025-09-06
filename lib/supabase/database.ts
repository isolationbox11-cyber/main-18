import { createClient } from "@supabase/supabase-js"

// Database types
export interface Investigation {
  id: string
  title: string
  description?: string
  status: "active" | "completed" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  updated_at: string
  created_by?: string
  targets: string[]
  tags: string[]
}

export interface Finding {
  id: string
  investigation_id: string
  type: "ip" | "domain" | "cve" | "malware" | "indicator" | "note"
  title: string
  content: string
  source: string
  severity: "info" | "low" | "medium" | "high" | "critical"
  verified: boolean
  created_at: string
  updated_at: string
  created_by?: string
  tags: string[]
  metadata: Record<string, any>
}

export interface TimelineEvent {
  id: string
  investigation_id: string
  title: string
  description?: string
  event_type: "discovery" | "analysis" | "correlation" | "action"
  source: string
  severity: "info" | "warning" | "critical"
  event_timestamp: string
  created_at: string
  created_by?: string
  metadata: Record<string, any>
}

export interface IntelligenceCache {
  id: string
  target: string
  source: string
  data: Record<string, any>
  created_at: string
  expires_at: string
}

// Check if Supabase is configured
export const isSupabaseConfigured =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_ANON_KEY === "string" &&
  process.env.SUPABASE_ANON_KEY.length > 0

// Supabase integration removed per user request
export class InvestigationDB {
  // Create a new investigation
  static async createInvestigation(data: Partial<Investigation>): Promise<Investigation | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data: result, error } = await supabase.from('investigations').insert([data]).select().single();
    if (error) {
      console.error('Supabase createInvestigation error:', error);
      return null;
    }
    return result as Investigation;
  }

  // Get all investigations
  static async getInvestigations(): Promise<Investigation[]> {
  if (!isSupabaseConfigured) { return []; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('investigations').select('*');
    if (error) {
      console.error('Supabase getInvestigations error:', error);
      return [];
    }
    return data as Investigation[];
  }

  // Get a single investigation by ID
  static async getInvestigation(id: string): Promise<Investigation | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('investigations').select('*').eq('id', id).single();
    if (error) {
      console.error('Supabase getInvestigation error:', error);
      return null;
    }
    return data as Investigation;
  }

  // Update an investigation
  static async updateInvestigation(id: string, updates: Partial<Investigation>): Promise<Investigation | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('investigations').update(updates).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updateInvestigation error:', error);
      return null;
    }
    return data as Investigation;
  }

  // Delete an investigation
  static async deleteInvestigation(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) { return false; }
  const { supabase } = await import('./client');
    const { error } = await supabase.from('investigations').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteInvestigation error:', error);
      return false;
    }
    return true;
  }

  // Add a finding to an investigation
  static async addFinding(data: Partial<Finding>): Promise<Finding | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data: result, error } = await supabase.from('findings').insert([data]).select().single();
    if (error) {
      console.error('Supabase addFinding error:', error);
      return null;
    }
    return result as Finding;
  }

  // Get all findings for an investigation
  static async getFindings(investigation_id: string): Promise<Finding[]> {
  if (!isSupabaseConfigured) { return []; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('findings').select('*').eq('investigation_id', investigation_id);
    if (error) {
      console.error('Supabase getFindings error:', error);
      return [];
    }
    return data as Finding[];
  }

  // Update a finding
  static async updateFinding(id: string, updates: Partial<Finding>): Promise<Finding | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('findings').update(updates).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updateFinding error:', error);
      return null;
    }
    return data as Finding;
  }

  // Add a timeline event
  static async addTimelineEvent(data: Partial<TimelineEvent>): Promise<TimelineEvent | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data: result, error } = await supabase.from('timeline_events').insert([data]).select().single();
    if (error) {
      console.error('Supabase addTimelineEvent error:', error);
      return null;
    }
    return result as TimelineEvent;
  }

  // Get all timeline events for an investigation
  static async getTimelineEvents(investigation_id: string): Promise<TimelineEvent[]> {
  if (!isSupabaseConfigured) { return []; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('timeline_events').select('*').eq('investigation_id', investigation_id);
    if (error) {
      console.error('Supabase getTimelineEvents error:', error);
      return [];
    }
    return data as TimelineEvent[];
  }

  // Cache intelligence data
  static async cacheIntelligence(data: Partial<IntelligenceCache>): Promise<void> {
  if (!isSupabaseConfigured) { return; }
  const { supabase } = await import('./client');
    await supabase.from('intelligence_cache').insert([data]);
  }

  // Get cached intelligence for a target
  static async getCachedIntelligence(target: string): Promise<Record<string, any> | null> {
  if (!isSupabaseConfigured) { return null; }
  const { supabase } = await import('./client');
    const { data, error } = await supabase.from('intelligence_cache').select('*').eq('target', target).single();
    if (error) {
      console.error('Supabase getCachedIntelligence error:', error);
      return null;
    }
    return data as Record<string, any>;
  }

  // Real-time subscriptions (example)
  // To use: import { supabase } from './client' in client components
  // supabase.channel('investigations').on('postgres_changes', {...})
}
