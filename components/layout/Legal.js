// File: components/layout/Legal.js
// Document layout for legal pages: sticky, auto-generated table of contents
// (from the h2 headings in the content) with active-section highlighting.
'use client';

import { useEffect, useRef, useState } from 'react';

const slug = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

export function LegalBody({ children, tocTitle = 'Contents' }) {
  const contentRef = useRef(null);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2'));
    headings.forEach((h) => {
      if (!h.id) h.id = slug(h.textContent || '');
      h.classList.add('scroll-mt-28');
    });
    setItems(headings.map((h) => ({ id: h.id, label: h.textContent || '' })));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid lg:grid-cols-[17rem_1fr] gap-10 lg:gap-16">
      <nav aria-label={tocTitle} className="hidden lg:block lg:sticky lg:top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <p className="mx-eyebrow mb-4">{tocTitle}</p>
        <div className="mx-toc">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} data-active={active === item.id ? '' : undefined}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      <article ref={contentRef} className="mx-legal min-w-0">
        {children}
      </article>
    </div>
  );
}
