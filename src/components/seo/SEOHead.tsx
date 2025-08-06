"use client";

import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

export default function SEOHead({
  title = "Cardano2VN - Blockchain Innovation Hub",
  description = "Cardano2VN is a leading blockchain innovation hub in Vietnam, specializing in Cardano ecosystem development, smart contracts, and decentralized applications.",
  keywords = ["Cardano", "blockchain", "Vietnam", "smart contracts", "DeFi", "cryptocurrency", "ADA", "web3"],
  ogImage = "/images/og-image.png",
  ogUrl = "https://cardano2vn.io",
  canonical,
}: SEOHeadProps) {
  const fullTitle = title.includes("Cardano2VN") ? title : `${title} | Cardano2VN`;
  const fullUrl = canonical ? `${ogUrl}${canonical}` : ogUrl;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {canonical && <link rel="canonical" href={fullUrl} />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${ogUrl}${ogImage}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Cardano2VN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${ogUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@cardano2vn" />
      <meta name="author" content="Cardano2VN Team" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cardano2VN",
            "description": description,
            "url": ogUrl,
            "logo": `${ogUrl}/images/logo.png`,
            "sameAs": [
              "https://twitter.com/cardano2vn",
              "https://github.com/cardano2vn",
              "https://linkedin.com/company/cardano2vn"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "cardano2vn@gmail.com",
            }
          })
        }}
      />
    </Head>
  );
}
