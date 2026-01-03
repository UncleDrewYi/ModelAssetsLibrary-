
import { Asset } from './types';

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'local-001',
    title: 'Internal Testing Bot',
    author: 'ForgeCore_Internal',
    category: 'Characters',
    thumbnail: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600',
    tris: '85k',
    hasLOD: true,
    format: 'GLTF',
    polyCount: 85000,
    localModelUrl: '/model.glb', // Matches the file in your public folder
    description: 'Internal verification model used for engine testing and asset pipeline validation. This model tests standard GLTF features including textures and bones.',
    version: 'v1.0-INTERNAL',
    status: 'In Review',
    tags: ['Test', 'Internal', 'Biped', 'Benchmark'],
    fileSize: '12 MB',
    textureRes: '2K PBR',
    rigged: true,
    files: [
      { name: 'model.glb', size: '12MB', type: 'Model' }
    ],
    history: [
      { version: 'v1.0', date: '2024-03-25', note: 'Initial check-in', author: 'ForgeCore_Internal' }
    ],
    comments: [
      { id: 'c-int', user: 'AutoTester', avatar: 'https://i.pravatar.cc/150?u=bot', date: 'Just now', text: 'Pipeline validation successful.' }
    ]
  },
  {
    id: '1',
    title: 'Cyberpunk Katana',
    author: 'DigitalArtisan',
    category: 'Weapons',
    thumbnail: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?auto=format&fit=crop&q=80&w=600',
    sketchfabUid: '105822e036e6423985f94951474ed015',
    tris: '12.4k',
    hasLOD: true,
    format: 'GLTF',
    polyCount: 12400,
    description: 'A high-fidelity cyberpunk katana with emissive textures and modular grip components.',
    version: 'v1.4',
    status: 'Approved',
    tags: ['Sci-fi', 'Melee', 'Weapon', 'Cyberpunk'],
    fileSize: '45 MB',
    textureRes: '4K PBR',
    rigged: false,
    files: [
      { name: 'Katana_High_Final.glb', size: '28MB', type: 'Model' },
      { name: 'Emissive_Map.png', size: '17MB', type: 'Texture' }
    ],
    history: [
      { version: 'v1.4', date: '2024-03-10', note: 'Finalized texture bakes', author: 'DigitalArtisan' }
    ],
    comments: [
      { id: 'c1', user: 'ArtLead_Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah', date: '1 week ago', text: 'This will fit perfectly into the downtown district scene.' }
    ]
  }
];

export const CATEGORIES = ['All', 'Characters', 'Weapons', 'Vehicles', 'Environments', 'Props'];
export const FORMATS = ['All', 'FBX', 'OBJ', 'GLTF', 'USDZ'];
