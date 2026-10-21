import type { Product, Category, Client, Certification } from '../types';

export const INITIAL_CATEGORIES: Category[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

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
    title: 'ISO 9001:2015 Quality Management System',
    issuer: 'Bureau Veritas Certification',
    year: '2023 - 2026',
    imageUrl: '',
  },
  {
    id: 'cert-2',
    title: 'ISO 14001:2015 Environmental Management',
    issuer: 'DNV GL Business Assurance',
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
    year: 'UDYAM-DL-08-001245',
    imageUrl: '',
  },
];
