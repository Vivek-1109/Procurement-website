import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  schemaMarkup?: Record<string, any> | Record<string, any>[];
}

function getOrCreate(
  selector: string,
  attrs: Record<string, string>,
  created: HTMLElement[]
): Element {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
    created.push(el as HTMLElement);
  }
  return el;
}

export function useSEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  schemaMarkup,
}: SeoProps) {
  useEffect(() => {
    // Track nodes created by THIS hook instance for cleanup
    const created: HTMLElement[] = [];

    // 1. Set Title
    document.title = title;

    // 2. Set Meta Description
    const descMeta = getOrCreate('meta[name="description"]', { name: 'description', content: '' }, created);
    descMeta.setAttribute('content', description);

    // 3. Set OpenGraph tags
    const ogTitle = getOrCreate('meta[property="og:title"]', { property: 'og:title', content: '' }, created);
    ogTitle.setAttribute('content', title);

    const ogDesc = getOrCreate('meta[property="og:description"]', { property: 'og:description', content: '' }, created);
    ogDesc.setAttribute('content', description);

    const currentUrl = canonicalUrl || window.location.href;
    const ogUrlMeta = getOrCreate('meta[property="og:url"]', { property: 'og:url', content: '' }, created);
    ogUrlMeta.setAttribute('content', currentUrl);

    const ogTypeMeta = getOrCreate('meta[property="og:type"]', { property: 'og:type', content: '' }, created);
    ogTypeMeta.setAttribute('content', ogType);

    if (ogImage) {
      const ogImgMeta = getOrCreate('meta[property="og:image"]', { property: 'og:image', content: '' }, created);
      ogImgMeta.setAttribute('content', ogImage);
    }

    // 4. Set Twitter card tags
    const twTitle = getOrCreate('meta[name="twitter:title"]', { name: 'twitter:title', content: '' }, created);
    twTitle.setAttribute('content', title);

    const twDesc = getOrCreate('meta[name="twitter:description"]', { name: 'twitter:description', content: '' }, created);
    twDesc.setAttribute('content', description);

    if (ogImage) {
      const twImg = getOrCreate('meta[name="twitter:image"]', { name: 'twitter:image', content: '' }, created);
      twImg.setAttribute('content', ogImage);
    }

    // 5. Set Canonical Link
    const canonicalLink = getOrCreate('link[rel="canonical"]', { rel: 'canonical', href: '' }, created);
    canonicalLink.setAttribute('href', currentUrl);

    // 6. Inject Schema Markup
    let schemaScript = document.getElementById('seo-schema-markup') as HTMLScriptElement | null;
    if (schemaScript) {
      if (schemaMarkup) {
        schemaScript.textContent = JSON.stringify(schemaMarkup);
      } else {
        schemaScript.remove();
      }
    } else if (schemaMarkup) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-markup';
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schemaMarkup);
      document.head.appendChild(schemaScript);
    }

    return () => {
      // Remove all nodes this hook instance created to avoid duplicates across routes
      for (const el of created) el.remove();
      const script = document.getElementById('seo-schema-markup');
      if (script) script.remove();
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schemaMarkup]);
}
