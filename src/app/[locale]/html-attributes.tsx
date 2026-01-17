'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export function HtmlAttributes() {
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  return null;
}
