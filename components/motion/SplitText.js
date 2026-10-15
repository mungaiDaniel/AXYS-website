// File: components/motion/SplitText.js
'use client';

import { useInView } from './useInView';

/**
 * Word-by-word blur-to-sharp headline reveal. Words are wrapped in spans with
 * the original spaces kept between them, so the element's text content is
 * unchanged (selectable, indexable, read normally by screen readers).
 * Accepts a plain string as children; anything else renders untouched.
 */
export default function SplitText({ as: Tag = 'h1', className = '', children, ...rest }) {
  const [ref, inView] = useInView();

  if (typeof children !== 'string') {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const parts = children.split(/(\s+)/);
  let index = 0;

  return (
    <Tag
      ref={ref}
      data-split=""
      data-revealed={inView ? '' : undefined}
      className={className}
      {...rest}
    >
      {parts.map((part, i) =>
        /^\s+$/.test(part) || part === '' ? (
          part
        ) : (
          <span key={i} className="mx-split-word" style={{ '--mx-i': index++ }}>
            {part}
          </span>
        )
      )}
    </Tag>
  );
}
