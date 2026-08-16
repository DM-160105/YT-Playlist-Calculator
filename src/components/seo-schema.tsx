import React from 'react';

export function SeoSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yt-playlist-calculator.com';

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'YouTube Playlist Duration Calculator',
    'alternateName': 'YT Playlist Calculator & Schedule Estimator',
    'url': baseUrl,
    'description': 'Free online YouTube playlist duration calculator. Find exact binge-watch length at 1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x, and 3x playback speeds with custom daily, weekly, and monthly watch schedule planners.',
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Any',
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
      'Short URL & Video Link Support',
      'Dark & Light Mode Support',
    ],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'YT Playlist Calculator',
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
        'name': 'Home / Duration Calculator',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Schedule Estimator',
        'item': `${baseUrl}/schedule`,
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
