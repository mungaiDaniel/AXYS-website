'use client';

import { useEffect, useState, useMemo } from 'react';
import { FileText, Download, Calendar, Search, BarChart3, Newspaper, BookOpen, Building2, Landmark, Star, PieChart, Lightbulb, Sparkles, X, ArrowRight } from 'lucide-react';
import { trackDownload } from '@/lib/analytics';
import { Reveal, Stagger } from '@/components/motion';
import { PageHero, Section } from '@/components/layout/PageLayout';

const getCategoryIcon = (category) => {
  const icons = {
    'price-list': <BarChart3 className="w-8 h-8 text-brand-blue" />,
    'daily-briefs': <Newspaper className="w-8 h-8 text-brand-blue" />,
    'weekly-note': <BookOpen className="w-8 h-8 text-brand-blue" />,
    'company-specific-reports': <Building2 className="w-8 h-8 text-brand-blue" />,
    'fixed-income-notes': <Landmark className="w-8 h-8 text-brand-blue" />,
    'stock-recommendations': <Star className="w-8 h-8 text-brand-blue" />,
    'quarterly-reports': <PieChart className="w-8 h-8 text-brand-blue" />,
    'topical-reports': <Lightbulb className="w-8 h-8 text-brand-blue" />,
    'bespoke-reports': <Sparkles className="w-8 h-8 text-brand-blue" />,
  };
  return icons[category] || <FileText className="w-8 h-8 text-brand-blue" />;
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

  const categoryLabel = doc.category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

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

      {/* Card — flex-col so scroll area + pinned button work */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col"
        style={{
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          background: 'rgba(255,255,255,0.88)',
          maxHeight: '90dvh',
          animation: closing
            ? 'modal-card-shrink 0.35s cubic-bezier(0.6,0,0.84,0) forwards'
            : 'modal-card-expand 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* Dark mode overlay */}
        <div className="absolute inset-0 rounded-2xl hidden dark:block pointer-events-none"
          style={{ background: 'rgba(15,20,35,0.97)' }} />

        {/* Animated content wrapper */}
        <div
          className="relative z-10 flex flex-col flex-1 min-h-0"
          style={{
            animation: closing
              ? 'modal-content-fade-out 0.25s ease forwards'
              : 'modal-content-fade-in 0.5s ease 0.1s forwards',
            opacity: 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 pb-4">
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
            <div className="w-12 h-1 rounded-full mx-auto mb-4 bg-[#0017bf] dark:bg-[#00005b]" />

            {/* Category badge */}
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 text-xs bg-[#0017bf]/10 dark:bg-[#00005b]/10 text-brand-blue rounded-full font-medium">
                {categoryLabel}
              </span>
            </div>

            {/* Company */}
            {doc.company && (
              <p className="text-center text-sm font-semibold text-brand-blue mb-1">{doc.company}</p>
            )}
            {doc.sector && (
              <p className="text-center text-xs text-muted-foreground mb-3">{doc.sector}</p>
            )}

            {/* Description */}
            {doc.description ? (
              <p className="text-sm text-muted-foreground text-center leading-relaxed mb-5">
                {doc.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground text-center italic mb-5">
                No description available for this document.
              </p>
            )}

            {/* Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {doc.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(doc.publishedDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                {doc.downloadCount} downloads
              </span>
            </div>
          </div>

          {/* ── Pinned download button (always visible) ── */}
          <div className="p-4 sm:p-6 pt-3 border-t border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#0f1423]/80">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onDownload(doc._id, doc.title)}
              className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] bg-[#0017bf] dark:bg-[#00005b]"
              style={{}}
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              <span>Download PDF</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper functions for flexible date parsing ────────────────────────────
const extractYearFromDescription = (description) => {
  if (!description) return null;
  const yearMatch = description.match(/\b(20\d{2})\b/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
};

const extractMonthFromDescription = (description) => {
  if (!description) return null;
  const monthNames = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };
  const monthAbbr = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };
  
  const description_lower = description.toLowerCase();
  
  // Try to match abbreviated month names (3 letters)
  for (const [abbr, monthNum] of Object.entries(monthAbbr)) {
    if (description_lower.includes(abbr)) return monthNum;
  }
  
  // Try to match full month names
  for (const [name, monthNum] of Object.entries(monthNames)) {
    if (description_lower.includes(name)) return monthNum;
  }
  
  return null;
};

const extractDayFromDescription = (description) => {
  if (!description) return null;
  // Match patterns like "5th", "5", "05", " 5 ", etc.
  const dayMatch = description.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (dayMatch) {
    const day = parseInt(dayMatch[1]);
    if (day >= 1 && day <= 31) return day;
  }
  return null;
};

const getMonthName = (monthNum) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNum - 1] || null;
};

const matchesMonth = (description, selectedMonth) => {
  if (!selectedMonth || selectedMonth === 'all') return true;
  const extractedMonth = extractMonthFromDescription(description);
  return extractedMonth === parseInt(selectedMonth);
};

const matchesDay = (description, selectedDay) => {
  if (!selectedDay) return true;
  const extractedDay = extractDayFromDescription(description);
  const searchDay = parseInt(selectedDay);
  return extractedDay === searchDay;
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResearchPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceListYear, setSelectedPriceListYear] = useState(2026);
  const [selectedPriceListCategory, setSelectedPriceListCategory] = useState('all');
  const [selectedPriceListMonth, setSelectedPriceListMonth] = useState('all');
  const [selectedPriceListDay, setSelectedPriceListDay] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => { fetchPapers(); }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch('/api/research');
      const data = await response.json();
      setPapers(data.papers || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (paperId, paperTitle) => {
    try {
      await fetch(`/api/research/download?id=${paperId}`);
      await trackDownload('download_research_paper', window.location.pathname, {
        paperId,
        paperTitle,
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const allCategories = [
    { value: 'all', label: 'Recent Reports' },
    { value: 'price-list', label: 'Price List' },
    { value: 'daily-briefs', label: 'Daily Briefs' },
    { value: 'weekly-note', label: 'Weekly Note' },
    { value: 'company-specific-reports', label: 'Company Specific Reports' },
    { value: 'fixed-income-notes', label: 'Fixed Income Notes' },
    { value: 'stock-recommendations', label: 'Stock Recommendations' },
    { value: 'quarterly-reports', label: 'Quarterly Reports' },
    { value: 'topical-reports', label: 'Topical Reports' },
    { value: 'bespoke-reports', label: 'Bespoke Reports' },
  ];

  // Extract unique price-list subcategories (e.g., Equities, Fixed Income, Market Reports)
  const priceListCategories = useMemo(() => {
    if (!papers.length) return [];
    const uniqueCategories = new Set();
    papers
      .filter((p) => p.category === 'price-list')
      .forEach((p) => {
        if (p.sector) uniqueCategories.add(p.sector);
      });
    const sortedCategories = Array.from(uniqueCategories).sort();
    return [{ value: 'all', label: 'All Price Lists' }, ...sortedCategories.map((cat) => ({
      value: cat,
      label: cat,
    }))];
  }, [papers]);

  const filteredPapers = papers.filter((p) => {
    // Filter by category
    if (filter === 'price-list') {
      if (p.category !== 'price-list') return false;
      // Filter by year for price-list
      const year = extractYearFromDescription(p.description);
      if (year !== selectedPriceListYear) return false;
      // Filter by price-list subcategory
      if (selectedPriceListCategory !== 'all' && p.sector !== selectedPriceListCategory) return false;
      // Filter by month
      if (!matchesMonth(p.description, selectedPriceListMonth)) return false;
      // Filter by day
      if (!matchesDay(p.description, selectedPriceListDay)) return false;
      return true;
    } else if (filter !== 'all' && p.category !== filter) {
      return false;
    }

    // Company search filter
    if (filter === 'company' && searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        p.company?.toLowerCase().includes(s) ||
        p.title?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Top 5 most recent papers for "All Reports" view
  const displayPapers = filter === 'all' ? filteredPapers.slice(0, 5) : filteredPapers;

  const categoryName = (value) => value.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const [featured, ...others] = displayPapers;
  const showFeatured = filter === 'all' && featured;
  const rows = showFeatured ? others : displayPapers;

  return (
    <div className="min-h-screen">
      <PageHero
        crumbs={[{ label: 'Research' }]}
        eyebrow="Research desk"
        title="Research & Insights"
        subtitle="Expert market analysis and investment research to guide your decisions"
      />

      <Section tone="white">
        <div className="grid lg:grid-cols-[17rem_1fr] gap-10 lg:gap-14">
          {/* Category Filter */}
          <nav aria-label="Research categories" className="lg:sticky lg:top-28 self-start">
            <p className="mx-eyebrow mb-4">Categories</p>
            <div className="mx-vtabs">
              {allCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setFilter(cat.value);
                    setSearchTerm('');
                    setSelectedPriceListCategory('all');
                  }}
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
            {/* Price List filters */}
            {filter === 'price-list' && (
              <div className="mx-toolbar mb-8">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-3">Select Price List Year</h2>
                  <div className="mx-tabs">
                    {[2022, 2023, 2024, 2025, 2026].map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedPriceListYear(year)}
                        className="mx-tab mx-mono"
                        data-active={selectedPriceListYear === year ? '' : undefined}
                        aria-pressed={selectedPriceListYear === year}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Month and Day Filters */}
                <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mt-5">
                  <select
                    value={selectedPriceListMonth}
                    onChange={(e) => setSelectedPriceListMonth(e.target.value)}
                    aria-label="Month"
                    className="mx-input"
                  >
                    <option value="all">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <input
                    type="text"
                    value={selectedPriceListDay}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d{1,2}$/.test(val)) {
                        setSelectedPriceListDay(val);
                      }
                    }}
                    aria-label="Day"
                    placeholder="Filter by day (1-31)"
                    className="mx-input"
                  />
                  <button
                    onClick={() => {
                      setSelectedPriceListMonth('all');
                      setSelectedPriceListDay('');
                      setSelectedPriceListCategory('all');
                    }}
                    className="mx-btn mx-btn-ghost justify-center !py-3 text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Company Search */}
            {filter === 'company' && (
              <label className="mx-search mx-search-light mb-8">
                <Search className="w-5 h-5 text-[#4D5BB8] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by company name..."
                  className="bg-transparent outline-none w-full"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-muted-foreground hover:text-foreground p-1 rounded">✕</button>
                )}
              </label>
            )}

            {loading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((i) => <div key={i} className="mx-row h-20 animate-pulse" />)}
              </div>
            ) : displayPapers.length > 0 ? (
              <>
                {/* Featured: latest report */}
                {showFeatured && (
                  <Reveal className="mb-6">
                    <div className="mx-fund-card cursor-pointer !p-8 md:!p-10" onClick={() => setSelectedDoc(featured)}>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="mx-eyebrow !text-[#9AA6EF]">Latest report</span>
                        <span className="mx-chip">{categoryName(featured.category)}</span>
                      </div>
                      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end mt-6">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-black text-white">{featured.title}</h2>
                          {featured.company && (
                            <p className="mx-mono text-sm text-[#9AA6EF] mt-2">{featured.company}{featured.sector ? ` · ${featured.sector}` : ''}</p>
                          )}
                          {featured.description && (
                            <p className="text-[#C9CFF5] mt-4 leading-relaxed line-clamp-2">{featured.description}</p>
                          )}
                          <p className="mx-mono text-xs text-[#9AA6EF]/80 mt-4 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(featured.publishedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={featured.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); handleDownload(featured._id); }}
                          className="mx-btn px-6 py-3 bg-white text-[#00005B] rounded-lg font-semibold text-sm justify-self-start"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </div>
                      <div className="mx-fund-line" aria-hidden="true" />
                    </div>
                  </Reveal>
                )}

                {/* Papers list */}
                <Stagger className="space-y-3">
                  {rows.map((paper) => (
                    <div key={paper._id} className="mx-row cursor-pointer" onClick={() => setSelectedDoc(paper)}>
                      <span className="mx-service-icon !w-12 !h-12 shrink-0">{getCategoryIcon(paper.category)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate">{paper.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span className="mx-chip mx-chip-light !py-0.5 !px-2 !text-[10px]">{categoryName(paper.category)}</span>
                          {paper.company && <span className="font-medium text-[#0017bf] dark:text-[#9AA6EF]">{paper.company}</span>}
                          {paper.sector && <span>{paper.sector}</span>}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(paper.publishedDate).toLocaleDateString()}
                          </span>
                        </div>
                        {paper.description && (
                          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">{paper.description}</p>
                        )}
                      </div>
                      <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); handleDownload(paper._id); }}
                        className="mx-btn mx-btn-primary !px-4 !py-2 text-xs shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  ))}
                </Stagger>
                {filter === 'all' && filteredPapers.length > 5 && (
                  <p className="text-muted-foreground mt-8 text-sm">
                    The rest of the reports can be found in their respective categories in the section above
                  </p>
                )}
              </>
            ) : (
              <div className="mx-faq-item p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-[#4D5BB8] opacity-70" />
                <p className="text-lg text-muted-foreground">
                  {filter === 'price-list'
                    ? `No records found for ${selectedPriceListYear}`
                    : filter === 'company' && searchTerm
                      ? `No results found for "${searchTerm}"`
                      : filter === 'all'
                        ? 'No research papers available yet'
                        : 'No papers in this category'}
                </p>
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
