<template>
    <main class="terms-view">
      <article class="legal-document">
        <header class="document-header">
          <h1>Terms of Use</h1>
          <p class="last-updated">Last updated: May 7, 2026</p>
        </header>
  
        <section class="document-body">
          <p>
            These Terms of Use ("Terms") govern your access to and use of the CinemaGoWhere? platform, including our website and upcoming mobile applications (collectively, the "Service"), operated by Singapore Cinema Group ("us", "we", or "our").
          </p>
          <p>
            Please read these Terms carefully before utilizing our Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
  
          <hr class="section-divider" />
  
          <h2>1. Platform Purpose and Independence</h2>
          <p>
            CinemaGoWhere? operates exclusively as an independent search directory and aggregator for cinema showtimes. 
          </p>
          <p>
            <strong>Disclaimer of Affiliation:</strong> Singapore Cinema Group is an independent entity and is <strong>not</strong> officially partnered with, endorsed by, sponsored by, or affiliated with Shaw Theatres or Golden Village. All cinema names, company names, brands, trademarks, and logos remain the property of their respective owners. Their use on our Service is strictly for identification and informational purposes.
          </p>
  
          <h2>2. Data Accuracy and Transactions</h2>
          <p>
            Our Service compiles and displays showtime data from third-party sources. While we strive to ensure the information provided is accurate and up-to-date, we do not guarantee its absolute correctness.
          </p>
          <ul>
            <li><strong>No Liability for Changes:</strong> We are not liable for any discrepancies, sudden showtime changes, canceled screenings, or ticket price fluctuations that occur after data has been aggregated.</li>
            <li><strong>Third-Party Checkouts:</strong> We do not sell tickets. When you select a showtime, you are redirected to the official website of the respective cinema operator. Any transactions, booking errors, or refund requests must be handled directly with the third-party cinema operator.</li>
          </ul>
  
          <h2>3. Acceptable Use and Anti-Scraping</h2>
          <p>
            The Service is provided solely for your personal, non-commercial use. You agree not to misuse the Service or its underlying infrastructure.
          </p>
          <p>
            <strong>Strictly Prohibited Conduct:</strong> You are explicitly forbidden from engaging in any of the following activities:
          </p>
          <ul>
            <li>Using automated scripts, bots, spiders, or web scrapers to extract, harvest, or index data from our Service.</li>
            <li>Republishing, selling, renting, or sub-licensing material or aggregated data from the Service for commercial gain.</li>
            <li>Attempting to bypass, disable, or interfere with security-related features of the Service.</li>
            <li>Framing or mirroring any part of the Service without our prior written consent.</li>
          </ul>
  
          <h2>4. Intellectual Property</h2>
          <p>
            Excluding the third-party cinema trademarks and movie promotional materials (posters/titles), the original layout, code, design, and functionality of the Service are the exclusive intellectual property of Singapore Cinema Group. The Service is protected by copyright and other intellectual property laws of Singapore.
          </p>
  
          <h2>5. Links to Other Websites</h2>
          <p>
            Our Service contains direct links to third-party websites (such as ticketing portals). We have no control over, and assume no responsibility for, the content, privacy policies, operational practices, or terms of any third-party websites. You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of these external sites.
          </p>
  
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will function uninterrupted, secure, or free of errors.
          </p>
  
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall Singapore Cinema Group, its directors, employees, partners, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages—including loss of profits, data, or goodwill—resulting from your access to, use of, or inability to access the Service.
          </p>
  
          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the Republic of Singapore, without regard to its conflict of law provisions.
          </p>
  
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised Terms.
          </p>
        </section>
      </article>
    </main>
  </template>
  
  <style scoped>
  .terms-view {
    padding: 1px 20px 80px; 
    display: flex;
    justify-content: center;
  }
  
  .legal-document {
    max-width: 760px; 
    width: 100%;
  }
  
  .document-header {
    margin-bottom: 40px;
  }
  
  .document-header h1 {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    margin: 0 0 8px 0;
  }
  
  .last-updated {
    font-size: 15px;
    color: var(--muted);
    margin: 0;
    font-weight: 500;
  }
  
  .section-divider {
    border: none;
    border-top: 1px solid var(--line);
    margin: 40px 0;
  }
  
  .document-body {
    color: var(--text);
    font-size: 16px;
    line-height: 1.65;
  }
  
  .document-body p {
    margin-bottom: 24px;
  }
  
  .document-body h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 48px 0 16px;
    color: var(--text);
    letter-spacing: -0.01em;
  }
  
  .document-body ul {
    margin-bottom: 24px;
    padding-left: 24px;
  }
  
  .document-body li {
    margin-bottom: 12px;
  }
  
  .document-body strong {
    font-weight: 600;
  }
  
  /* Mobile */
  @media (max-width: 600px) {
    .terms-view {
      padding-top: 40px;
    }
    
    .document-body h2 {
      margin-top: 36px;
    }
  }
  </style>