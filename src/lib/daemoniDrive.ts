/**
 * Daemoni Drive - Silent Patenting System
 * Main export point for the patent system
 *
 * Usage Example:
 *
 * import { silentPatent } from './lib/daemoniDrive';
 *
 * // Automatically patent any asset
 * const patent = await silentPatent('My Game Asset', {
 *   type: '3d_model',
 *   details: 'Custom character model for TRASH BOUND',
 * });
 *
 * // Patent with Google Docs link
 * const patent = await silentPatent('Design Document', content, {
 *   driveUrl: 'https://docs.google.com/document/d/...',
 *   isPublic: true,
 * });
 */

export {
  silentPatent,
  getAllPatents,
  getPatentByGhostCode,
  searchPatents,
  deletePatent,
  linkPatentToDrive,
  type PatentData,
} from '../services/patentService';

/**
 * Quick patent for code snippets
 */
export const patentCode = async (name: string, code: string) => {
  const { silentPatent } = await import('../services/patentService');
  return silentPatent(name, {
    type: 'code',
    content: code,
    language: 'typescript',
  });
};

/**
 * Quick patent for design assets
 */
export const patentDesign = async (name: string, details: any) => {
  const { silentPatent } = await import('../services/patentService');
  return silentPatent(name, {
    type: 'design',
    details,
  });
};

/**
 * Quick patent for game assets
 */
export const patentGameAsset = async (
  name: string,
  assetType: '3d_model' | 'audio' | 'image',
  metadata: any
) => {
  const { silentPatent } = await import('../services/patentService');
  return silentPatent(name, {
    type: assetType,
    metadata,
  });
};
