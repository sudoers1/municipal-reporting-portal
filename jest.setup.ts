import '@testing-library/jest-dom';

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

Object.defineProperty(window, 'L', {
  value: createLeafletMock(),
  writable: true,
});

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

// Fix jsdom image loading
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set() {},
  get() { return ''; },
});

