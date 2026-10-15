'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Calendar, Scale, BarChart3, ClipboardList, Megaphone, Newspaper, Receipt, ShieldCheck, X, ArrowRight, Search } from 'lucide-react';
import { trackDownload } from '@/lib/analytics';
import { Stagger } from '@/components/motion';
import { PageHero, Section } from '@/components/layout/PageLayout';

const getCategoryIcon = (category) => {
  const icons = {
    'terms-and-conditions': <Scale className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'audited-financial-reports': <BarChart3 className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'unaudited-financial-reports': <BarChart3 className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'financial-reports': <BarChart3 className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'application-forms': <ClipboardList className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'press-releases': <Megaphone className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'news': <Newspaper className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'fees-and-tariffs': <Receipt className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
    'compliance-documents': <ShieldCheck className="w-8 h-8 text-brand-blue transition-transform duration-300" />,
  };
  return icons[category] || <FileText className="w-8 h-8 text-brand-blue transition-transform duration-300" />;
};

const categoryLabels = {
  'terms-and-conditions': 'Terms & Conditions',
  'audited-financial-reports': 'Financial Reports',
  'unaudited-financial-reports': 'Financial Reports',
  'financial-reports': 'Financial Reports',
  'application-forms': 'Application Forms',
  'press-releases': 'Press Releases',
  'news': 'News',
  'fees-and-tariffs': 'Fees & Tariffs',
  'compliance-documents': 'Compliance Documents',
  'other': 'Other',
};

// ── Document Preview Modal ────────────────────────────────────────────────────
function DocumentModal({ doc, onClose, onDownload }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!doc) return null;

  const label = categoryLabels[doc.category] || doc.category;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
        style={{
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          background: 'rgba(0,0,0,0.35)',
          animation: closing ? 'fade-out 0.35s ease forwards' : 'fade-in 0.3s ease forwards',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          background: 'rgba(255,255,255,0.88)',
          animation: closing
            ? 'modal-card-shrink 0.35s cubic-bezier(0.6,0,0.84,0) forwards'
            : 'modal-card-expand 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* Dark mode overlay */}
        <div className="absolute inset-0 rounded-2xl hidden dark:block pointer-events-none"
          style={{ background: 'rgba(15,20,35,0.97)' }} />

        <div
          className="relative z-10 p-6 sm:p-8"
          style={{
            animation: closing
              ? 'modal-content-fade-out 0.25s ease forwards'
              : 'modal-content-fade-in 0.5s ease 0.1s forwards',
            opacity: 0,
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#0017bf]/10 dark:bg-[#00005b]/10 rounded-xl">
              {getCategoryIcon(doc.category)}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-2">
            {doc.title}
          </h3>

          {/* Blue underline */}
          <div className="w-12 h-1 rounded-full mx-auto mb-4 bg-[#0017bf] dark:bg-[#00005b] transition-transform duration-300" />

          {/* Category badge */}
          <div className="flex justify-center mb-5">
            <span className="px-3 py-1 text-xs bg-[#0017bf]/10 dark:bg-[#00005b]/10 text-brand-blue rounded-full font-medium">
              {label}
            </span>
          </div>

          {/* Description */}
          {doc.description ? (
            <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
              {doc.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center italic mb-6">
              No description available for this document.
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(doc.publishedDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {doc.downloadCount || 0} downloads
            </span>
          </div>

          {/* Download button */}
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onDownload(doc._id, doc.title)}
            className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-[#0017bf] dark:bg-[#00005b]"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span>Download</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div >
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DownloadsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docQuery, setDocQuery] = useState('');

  useEffect(() => { fetchDocuments(); }, [filter]);

  const fetchDocuments = async () => {
    try {
      const url = filter === 'all' ? '/api/documents' : `/api/documents?category=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId, docTitle) => {
    try {
      await fetch(`/api/documents/download?id=${docId}`);
      await trackDownload('download_document', window.location.pathname, {
        documentId: docId,
        documentTitle: docTitle,
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'financial-reports', label: 'Financial Reports (Audited & Unaudited)' },
    { value: 'terms-and-conditions', label: 'Terms & Conditions' },
    { value: 'application-forms', label: 'Application Forms' },
    { value: 'press-releases', label: 'Press Releases' },
    { value: 'news', label: 'News' },
    { value: 'fees-and-tariffs', label: 'Fees & Tariffs' },
    { value: 'compliance-documents', label: 'Compliance Documents' },
  ];

  const term = docQuery.trim().toLowerCase();
  const visibleDocs = term
    ? documents.filter((doc) => `${doc.title} ${doc.description || ''}`.toLowerCase().includes(term))
    : documents;

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Downloads' }]}
        eyebrow="Document centre"
        title="Downloads & Documents"
        subtitle="Access compliance documents, financial reports, application forms, and more"
      />

      <Section tone="white">
        <div className="grid lg:grid-cols-[17rem_1fr] gap-10 lg:gap-14">
          {/* Category Filter */}
          <nav aria-label="Document categories" className="lg:sticky lg:top-28 self-start">
            <p className="mx-eyebrow mb-4">Categories</p>
            <div className="mx-vtabs">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className="mx-tab"
                  data-active={filter === cat.value ? '' : undefined}
                  aria-pressed={filter === cat.value}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="mx-mono font-semibold text-foreground">{visibleDocs.length}</span> documents
              </p>
              <label className="mx-search mx-search-light !py-2.5 w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-[#4D5BB8] shrink-0" aria-hidden="true" />
                <span className="sr-only">Search documents</span>
                <input
                  type="search"
                  value={docQuery}
                  onChange={(e) => setDocQuery(e.target.value)}
                  placeholder="Search documents"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </label>
            </div>

            {/* Documents list */}
            {loading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((i) => <div key={i} className="mx-row h-20 animate-pulse" />)}
                <p className="sr-only">Loading documents...</p>
              </div>
            ) : visibleDocs.length > 0 ? (
              <Stagger className="space-y-3">
                {visibleDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="mx-row cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <span className="mx-service-icon !w-12 !h-12 shrink-0">{getCategoryIcon(doc.category)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="mx-chip mx-chip-light !py-0.5 !px-2 !text-[10px]">
                          {categoryLabels[doc.category] || doc.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#0017bf] dark:text-[#9AA6EF]" />
                          {new Date(doc.publishedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {doc.downloadCount || 0} downloads
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Download link — goes directly to PDF */}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc._id); }}
                        className="mx-btn mx-btn-primary !px-4 !py-2 text-xs"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                      {/* Tap to view more — opens modal */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                        className="hidden sm:inline-flex mx-btn mx-btn-ghost !px-4 !py-2 text-xs"
                      >
                        Tap to view more <ArrowRight className="mx-arrow w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </Stagger>
            ) : (
              <div className="mx-faq-item p-10 text-center">
                <FileText className="w-10 h-10 mx-auto mb-3 text-[#4D5BB8]" />
                <p className="text-muted-foreground">No documents available in this category</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
