import React from 'react';
import { getBaseUrl, siteConfig } from '@/lib/siteConfig';

export function SeoSchema() {
  const baseUrl = getBaseUrl();

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': siteConfig.name,
    'alternateName': 'YT Playlist Calculator & Schedule Estimator',
    'url': baseUrl,
    'description': siteConfig.description,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'All modern web browsers',
    'browserRequirements': 'Requires JavaScript. Requires HTML5.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'featureList': [
      'Instant YouTube Playlist Duration Calculation',
      'Multi-Speed Playback Analysis (1x to 3x)',
      'Time Saved Metrics Calculation',
      'Daily, Weekly, Monthly & Yearly Watch Schedule Estimator',
      'Short URL (youtu.be) & Video Link Support',
      'Dark & Light Mode Support',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteConfig.shortName,
    'url': baseUrl,
    'logo': `${baseUrl}/icon.svg`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Duration Calculator',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Schedule Estimator',
        'item': `${baseUrl}/schedule`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Speed & Time Matrix',
        'item': `${baseUrl}/speed-calculator`,
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': 'User Guide',
        'item': `${baseUrl}/guide`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
