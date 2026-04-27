import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder first (undici needs these)
Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill Web Fetch APIs only in node environment
if (typeof window === 'undefined') {
  // Polyfill File if not available (Node < 20)
  if (typeof File === 'undefined') {
    const { Blob } = require('buffer');
    global.File = class File extends Blob {
      name: string;
      lastModified: number;
      constructor(chunks: any[], filename: string, opts: any = {}) {
        super(chunks, opts);
        this.name = filename;
        this.lastModified = opts.lastModified ?? Date.now();
      }
    } as any;
  }

  const { Request, Response, Headers, fetch } = require('undici');
  Object.assign(global, { Request, Response, Headers, fetch });
}

// Mock Leaflet CSS
Object.defineProperty(require, 'resolve', {
  value: () => '/leaflet.css',
});

// Mock Leaflet default icon
jest.mock('leaflet/dist/images/marker-icon.png', () => 'marker-icon.png');
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'marker-shadow.png');

// Mock leaflet module
const createLeafletMock = () => ({
  Map: jest.fn(),
  tileLayer: jest.fn(),
  geoJSON: jest.fn(),
  LayerGroup: jest.fn(() => ({
    addTo: jest.fn(),
    clearLayers: jest.fn(),
    addLayer: jest.fn(),
  })),
  latLngBounds: jest.fn(() => ({
    pad: jest.fn(),
  })),
});

// Mock window.L only in jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'L', {
    value: createLeafletMock(),
    writable: true,
  });
}

// Mock Turf.js
jest.mock('@turf/turf', () => ({
  bbox: jest.fn(() => [0, 0, 1, 1]),
  point: jest.fn(),
  booleanPointInPolygon: jest.fn(),
}));

// Mock next/navigation if needed
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Fix jsdom image loading (jsdom only)
if (typeof window !== 'undefined') {
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set() {},
    get() { return ''; },
  });
}