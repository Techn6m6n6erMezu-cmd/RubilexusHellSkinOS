import { supabase } from '../lib/supabase';

export interface PatentData {
  id: string;
  ghost_code: string;
  asset_name: string;
  owner: string;
  project: string;
  timestamp: string;
  content: any;
  drive_id?: string;
  drive_url?: string;
  metadata?: any;
}

/**
 * Silent Patenting v1.0 - Daemoni Drive Sync
 * Automatically patents assets and stores them in the Daemoni Drive
 * Links directly to Google Docs & Notepad as "Docs"
 */
export const silentPatent = async (
  assetName: string,
  content: any,
  options?: {
    driveId?: string;
    driveUrl?: string;
    metadata?: any;
    isPublic?: boolean;
  }
): Promise<PatentData | null> => {
  try {
    const timestamp = new Date().toISOString();
    const ghostCode = btoa(assetName + timestamp); // Unique "Ghost Code"

    // Get current admin user
    const { data: { user } } = await supabase.auth.getUser();

    const patentData = {
      ghost_code: ghostCode,
      asset_name: assetName,
      owner: 'ADMIN 1: TECHNOMANCER',
      project: 'TRASH BOUND / SATAN\'S HOUSE',
      timestamp: timestamp,
      content: content,
      drive_id: options?.driveId,
      drive_url: options?.driveUrl,
      admin_id: user?.id,
      metadata: options?.metadata || {},
      is_public: options?.isPublic || false,
    };

    // Save to Daemoni Drive (Supabase)
    const { data, error } = await supabase
      .from('daemoni_patents')
      .insert(patentData)
      .select()
      .single();

    if (error) {
      console.error('%c PATENT FAILED:', 'color: red; font-weight: bold;', error);
      throw error;
    }

    console.log(
      `%c✓ PATENT SECURED: ${assetName} hashed to Daemoni Drive.`,
      'color: gold; font-weight: bold; font-size: 14px;'
    );
    console.log(`%cGhost Code: ${ghostCode}`, 'color: #888;');
    console.log(`%cTimestamp: ${timestamp}`, 'color: #888;');

    return {
      id: data.id,
      ghost_code: ghostCode,
      asset_name: assetName,
      owner: patentData.owner,
      project: patentData.project,
      timestamp: timestamp,
      content: content,
      drive_id: options?.driveId,
      drive_url: options?.driveUrl,
      metadata: options?.metadata,
    };
  } catch (error) {
    console.error('%c DAEMONI DRIVE ERROR:', 'color: red; font-weight: bold;', error);
    return null;
  }
};

/**
 * Retrieve all patents from the Daemoni Drive
 */
export const getAllPatents = async (): Promise<PatentData[]> => {
  try {
    const { data, error } = await supabase
      .from('daemoni_patents')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('%c DAEMONI DRIVE READ ERROR:', 'color: red; font-weight: bold;', error);
    return [];
  }
};

/**
 * Get a specific patent by ghost code
 */
export const getPatentByGhostCode = async (ghostCode: string): Promise<PatentData | null> => {
  try {
    const { data, error } = await supabase
      .from('daemoni_patents')
      .select('*')
      .eq('ghost_code', ghostCode)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('%c DAEMONI DRIVE LOOKUP ERROR:', 'color: red; font-weight: bold;', error);
    return null;
  }
};

/**
 * Update patent with Google Docs/Notepad link
 */
export const linkPatentToDrive = async (
  ghostCode: string,
  driveId: string,
  driveUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daemoni_patents')
      .update({
        drive_id: driveId,
        drive_url: driveUrl,
      })
      .eq('ghost_code', ghostCode);

    if (error) throw error;

    console.log(
      `%c✓ DRIVE LINKED: Patent ${ghostCode} synced to external doc.`,
      'color: cyan; font-weight: bold;'
    );

    return true;
  } catch (error) {
    console.error('%c DRIVE LINK FAILED:', 'color: red; font-weight: bold;', error);
    return false;
  }
};

/**
 * Search patents by asset name
 */
export const searchPatents = async (searchTerm: string): Promise<PatentData[]> => {
  try {
    const { data, error } = await supabase
      .from('daemoni_patents')
      .select('*')
      .ilike('asset_name', `%${searchTerm}%`)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('%c PATENT SEARCH ERROR:', 'color: red; font-weight: bold;', error);
    return [];
  }
};

/**
 * Delete a patent
 */
export const deletePatent = async (ghostCode: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('daemoni_patents')
      .delete()
      .eq('ghost_code', ghostCode);

    if (error) throw error;

    console.log(
      `%c✓ PATENT DELETED: ${ghostCode} removed from Daemoni Drive.`,
      'color: orange; font-weight: bold;'
    );

    return true;
  } catch (error) {
    console.error('%c PATENT DELETE ERROR:', 'color: red; font-weight: bold;', error);
    return false;
  }
};
