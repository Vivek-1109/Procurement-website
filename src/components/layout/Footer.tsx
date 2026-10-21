import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-[#0B2A4A] text-[#F4F8FC]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 px-2 py-1 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-xs">
                <img
                  src="/logo.png"
                  alt="Divyanshi Aviation Services Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-white text-base">Divyanshi Aviation</div>
                <div className="text-[0.65rem] text-[#93C5FD] tracking-widest uppercase font-medium">Services Pvt. Ltd.</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              India's premier AS9120B certified distributor of aviation & aerospace consumables, sealants, lubricants, adhesives, and temperature-controlled cold-chain shipments.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/divyanshi-aviation-services-private-limited/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-sm bg-white/10 hover:bg-[#1557B0] flex items-center justify-center transition-colors text-white"
                aria-label="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Product Catalogue', href: '/products', isRoute: true },
                { label: 'Request Quote', href: '/contact', isRoute: true },
              ].map(link => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#93C5FD] transition-colors group"
                    >
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-[#93C5FD] transition-colors group"
                    >
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={15} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">
                  <strong>Head Office:</strong> Plot No. 22 & 23, Pillar No. 68, Near Nangli Metro Station, Ranaji Enclave, Najafgarh, New Delhi 110043
                </span>
              </li>
              <li>
                <a
                  href="tel:+919910997428"
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#93C5FD] transition-colors"
                >
                  <Phone size={15} className="text-[#3B82F6] flex-shrink-0" />
                  +91 9910997428 / +91 9971998747
                </a>
              </li>
              <li>
                <a
                  href="mailto:sales.consumables@divyanshiaviation.com"
                  className="flex items-center gap-3 text-sm text-slate-300 hover:text-[#93C5FD] transition-colors"
                >
                  <Mail size={15} className="text-[#3B82F6] flex-shrink-0" />
                  sales.consumables@divyanshiaviation.com
                </a>
              </li>
            </ul>

            {/* Hubs & Certifications Mini */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Offices & Warehouses</p>
              <p className="text-xs text-slate-300 mb-3">New Delhi | Hyderabad | Bengaluru</p>
              <div className="flex flex-wrap gap-2">
                {['AS9120B', 'ISO 9001', 'MSME', 'GST'].map(cert => (
                  <span
                    key={cert}
                    className="text-xs px-2 py-1 rounded-sm border border-white/15 text-slate-300 bg-white/5"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Divyanshi Aviation Services Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Privacy Policy</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400">Terms of Service</span>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="text-xs text-slate-400 hover:text-[#93C5FD] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
