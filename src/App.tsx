import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Analytics } from '@vercel/analytics/react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import ProductShowcase from './components/sections/ProductShowcase';
import FeaturedProducts from './components/sections/FeaturedProducts';
import CompactWhyUs from './components/sections/CompactWhyUs';
import CTABanner from './components/sections/CTABanner';
import ScrollToTop from './components/ScrollToTop';
import FloatingActions from './components/FloatingActions';
import ClientShowcase from './components/sections/ClientShowcase';

import { useSEO } from './hooks/useSEO';

// Lazy load pages not needed on initial load
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminCertifications = lazy(() => import('./pages/admin/AdminCertifications'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1557B0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomePage() {
  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Divyanshi Aviation Services Pvt Ltd',
      'url': 'https://divyanshiaviation.com',
      'logo': 'https://divyanshiaviation.com/assets/img/logo.png',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91-9910997428',
        'contactType': 'sales',
        'email': 'sales.consumables@divyanshiaviation.com',
        'areaServed': ['IN', 'BD', 'LK', 'NP', 'BT', 'MY'],
        'availableLanguage': 'en'
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Plot No. 22 & 23, Pillar No. 68, Near Nangli Metro Station, Ranaji Enclave, Najafgarh',
        'addressLocality': 'New Delhi',
        'postalCode': '110043',
        'addressCountry': 'IN'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Divyanshi Aviation Services Pvt Ltd',
      'url': 'https://divyanshiaviation.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://divyanshiaviation.com/products?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  useSEO({
    title: 'Divyanshi Aviation Services Pvt Ltd | Aviation & Aerospace Consumables',
    description: 'Divyanshi Aviation Services Pvt Ltd is India’s premier AS9120B certified distributor and stockist of aviation consumables, aircraft sealants, adhesives, lubricants, and temperature-controlled shipments.',
    canonicalUrl: 'https://divyanshiaviation.com/',
    schemaMarkup: homeSchema
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ClientShowcase />
        <ProductShowcase />
        <FeaturedProducts />
        <CompactWhyUs />
        <CTABanner />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin auth */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute>
                  <AdminClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <AdminLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certifications"
              element={
                <ProtectedRoute>
                  <AdminCertifications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
      <Analytics />
    </AdminProvider>
  );
}
