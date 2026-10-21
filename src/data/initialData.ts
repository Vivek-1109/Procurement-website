import type { Product, Category, Client, Certification } from '../types';
import rawProducts from './scraped_products.json';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-adhesives',
    name: 'Adhesives',
    description: 'High-performance structural, paste, and specialty aerospace bonding adhesives.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
    order: 1,
  },
  {
    id: 'cat-coatings',
    name: 'Coatings',
    description: 'Protective, anti-corrosive, thermal barrier, and specialty aerospace coatings.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Coating.jpg',
    order: 2,
  },
  {
    id: 'cat-sealants',
    name: 'Sealants',
    description: 'Fuel tank, fuselage, windscreen, and environmental aviation sealants.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Sealants.jpg',
    order: 3,
  },
  {
    id: 'cat-lubricants',
    name: 'Lubricants',
    description: 'Synthetic aircraft lubricants, turbine oils, and high-load boundary lubricants.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Lubricants.jpg',
    order: 4,
  },
  {
    id: 'cat-paints',
    name: 'Paints',
    description: 'Aerospace topcoats, primers, polyurethane coatings, and marking paints.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Paints.jpg',
    order: 5,
  },
  {
    id: 'cat-tapes',
    name: 'Tapes',
    description: 'Aviation cargo, high-temperature masking, leading edge, and foil tapes.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Tapes.jpg',
    order: 6,
  },
  {
    id: 'cat-cleaners',
    name: 'Cleaners',
    description: 'Solvent degreasers, aircraft exterior wash, and precision electronic cleaners.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Cleaners.jpg',
    order: 7,
  },
  {
    id: 'cat-greases',
    name: 'Greases',
    description: 'Airframe greases, wheel bearing greases, and extreme temperature aerospace lubricants.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Grease.jpg',
    order: 8,
  },
  {
    id: 'cat-oils',
    name: 'Oils',
    description: 'Turbine engine oils, hydraulic fluids, and gear lubricants for civil and defense aircraft.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Oils.jpg',
    order: 9,
  },
  {
    id: 'cat-mechanical-items',
    name: 'Mechanical Items',
    description: 'Precision aircraft fasteners, hardware, O-rings, and mechanical spares.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Mechancial%20Items.jpg',
    order: 10,
  },
  {
    id: 'cat-mechanical-consumables',
    name: 'Mechanical Consumables',
    description: 'Safety wires, rivets, cotter pins, filter elements, and workshop consumables.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Mechancial%20Consumables.jpg',
    order: 11,
  },
  {
    id: 'cat-ndt-chemicals',
    name: 'NDT Chemicals',
    description: 'Fluorescent penetrants, developers, and magnetic particle non-destructive testing materials.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/NDT%20Chemicals.jpg',
    order: 12,
  },
  {
    id: 'cat-film-adhesives',
    name: 'Film Adhesives',
    description: 'Structural epoxy film adhesives for composite and metal-to-metal bonding.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
    order: 13,
  },
  {
    id: 'cat-conductive-adhesives',
    name: 'Conductive Adhesives',
    description: 'Electrically and thermally conductive adhesives for aerospace avionics.',
    imageUrl: 'https://divyanshiaviation.com/assets/img/products/Adhesives.jpg',
    order: 14,
  },
];

export const INITIAL_PRODUCTS: Product[] = (rawProducts as any[]).map((p, idx) => ({
  id: p.id || `prod-${idx + 1}`,
  name: p.name,
  category: p.category,
  description: p.description || `${p.name} for aviation & aerospace application`,
  imageUrl: p.image || p.imageUrl || '',
  createdAt: new Date(Date.now() - (idx % 100) * 3600000).toISOString(),
}));

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'partner-1',
    name: '3M Aerospace',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054908/apr_services/partners/3m_aerospace.png',
    order: 1,
    isActive: true,
  },
  {
    id: 'partner-2',
    name: 'Henkel Aerospace / Loctite',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054910/apr_services/partners/henkel_aerospace.jpg',
    order: 2,
    isActive: true,
  },
  {
    id: 'partner-3',
    name: 'Huntsman Advanced Materials',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054912/apr_services/partners/huntsman.jpg',
    order: 3,
    isActive: true,
  },
  {
    id: 'partner-4',
    name: 'Callington Aviation',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054913/apr_services/partners/callington.jpg',
    order: 4,
    isActive: true,
  },
  {
    id: 'partner-5',
    name: 'Chemetall / Ardrox',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054915/apr_services/partners/chemetall_ardrox.jpg',
    order: 5,
    isActive: true,
  },
  {
    id: 'partner-6',
    name: 'PPG Aerospace',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054917/apr_services/partners/ppg_aerospace.jpg',
    order: 6,
    isActive: true,
  },
  {
    id: 'partner-7',
    name: 'AeroShell Aviation Lubricants',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054919/apr_services/partners/aeroshell.jpg',
    order: 7,
    isActive: true,
  },
  {
    id: 'partner-8',
    name: 'Eastman Skydrol',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054921/apr_services/partners/eastman_skydrol.png',
    order: 8,
    isActive: true,
  },
  {
    id: 'partner-9',
    name: 'Airbus Helicopters Group',
    logoUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1787054922/apr_services/partners/airbus_helicopters.svg',
    order: 9,
    isActive: true,
  },
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'AS9120B Certified Aviation Distributor',
    issuer: 'Aviation, Space and Defense Quality Management',
    year: 'Active Certified',
    imageUrl: '',
  },
  {
    id: 'cert-2',
    title: 'ISO 9001:2015 Quality Management System',
    issuer: 'Bureau Veritas Certification',
    year: '2023 - 2026',
    imageUrl: '',
  },
  {
    id: 'cert-3',
    title: 'Government e-Marketplace (GeM) Certified',
    issuer: 'Ministry of Commerce and Industry',
    year: 'Active OEM Vendor',
    imageUrl: '',
  },
  {
    id: 'cert-4',
    title: 'MSME & Udyam Registered Enterprise',
    issuer: 'Government of India',
    year: 'Active Enterprise',
    imageUrl: '',
  },
];
