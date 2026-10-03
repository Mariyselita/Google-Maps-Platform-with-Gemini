import { PresetLocation } from '../types';

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    region: 'South America',
    description: 'Paris of South America: sprawling grid of tree-lined boulevards, neoclassical palaces & tango plazas.',
    flag: '🇦🇷',
    tag: 'Metropolis',
    defaultCoords: {
      lat: -34.6037,
      lng: -58.3821,
    },
  },
  {
    id: 'shibuya',
    name: 'Shibuya',
    country: 'Japan',
    region: 'East Asia',
    description: 'Tokyo’s hyper-dense neon crossroads, celebrated pedestrian scramble, and labyrinthine shopping districts.',
    flag: '🇯🇵',
    tag: 'High Density',
    defaultCoords: {
      lat: 35.662,
      lng: 139.7038,
    },
  },
  {
    id: 'copacabana',
    name: 'Copacabana',
    country: 'Brazil',
    region: 'South America',
    description: 'Iconic 4-kilometer crescent beach backed by granite monoliths with wavy Burle Marx mosaic promenades.',
    flag: '🇧🇷',
    tag: 'Coastal Grid',
    defaultCoords: {
      lat: -22.9693,
      lng: -43.1868,
    },
  },
  {
    id: 'cologne',
    name: 'Cologne',
    country: 'Germany',
    region: 'Western Europe',
    description: 'Historic Rhine river valley urban core featuring the twin-spired High Gothic Cathedral & Roman ruins.',
    flag: '🇩🇪',
    tag: 'Historic River',
    defaultCoords: {
      lat: 50.9375,
      lng: 6.9603,
    },
  },
  {
    id: 'lima',
    name: 'Lima',
    country: 'Peru',
    region: 'South America',
    description: 'Dramatic coastal cliffside city facing the Pacific Ocean, Miraflores parks, and UNESCO colonial architecture.',
    flag: '🇵🇪',
    tag: 'Pacific Bluffs',
    defaultCoords: {
      lat: -12.0467,
      lng: -77.0431,
    },
  },
];
