
export type AssetCategory = 'Characters' | 'Weapons' | 'Vehicles' | 'Environments' | 'Props';
export type FileFormat = 'FBX' | 'OBJ' | 'GLTF' | 'USDZ';
export type AssetStatus = 'Approved' | 'Draft' | 'In Review';

export interface AssetFile {
  name: string;
  size: string;
  type: string;
}

export interface VersionEntry {
  version: string;
  date: string;
  note: string;
  author: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  date: string;
  text: string;
}

export interface Asset {
  id: string;
  title: string;
  author: string;
  category: AssetCategory;
  thumbnail: string;
  tris: string;
  hasLOD: boolean;
  format: FileFormat;
  polyCount: number;
  sketchfabUid?: string;
  localModelUrl?: string; // New: Path to GLB/GLTF file in public folder
  description: string;
  version: string;
  status: AssetStatus;
  tags: string[];
  fileSize: string;
  textureRes: string;
  rigged: boolean;
  files: AssetFile[];
  history: VersionEntry[];
  comments: Comment[];
}

export interface FilterState {
  searchQuery: string;
  category: AssetCategory | 'All';
  format: FileFormat | 'All';
  maxPoly: number;
}
