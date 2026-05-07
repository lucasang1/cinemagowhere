<template>
    <main class="privacy-view">
      <article class="legal-document">
        <header class="document-header">
          <h1>Privacy Policy</h1>
          <p class="last-updated">Last updated: May 7, 2026</p>
        </header>
  
        <section class="document-body">
          <p>
            Singapore Cinema Group ("us", "we", or "our") operates the CinemaGoWhere? website and upcoming mobile applications (collectively, the "Service").
          </p>
          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of data when you use our Service. We built CinemaGoWhere? to be a seamless, privacy-first utility. We collect the absolute minimum amount of data required to make the Service function.
          </p>
  
          <hr class="section-divider" />
  
          <h2>1. No Account Required (Anonymous Usage)</h2>
          <p>
            Our Service is designed to be used completely anonymously. We do not require you to create an account, register, or log in. We do not collect personally identifiable information such as your name, email address, phone number, or home address.
          </p>
  
          <h2>2. Ticketing and Payment Information</h2>
          <p>
            CinemaGoWhere? functions purely as an aggregator and search directory. When you select a showtime, you are securely redirected to the official, respective ticketing platforms of our integrated partners (Shaw Theatres or Golden Village) to complete your transaction.
          </p>
          <ul>
            <li><strong>We do not process payments.</strong></li>
            <li><strong>We do not collect, store, or have access to your credit card information.</strong></li>
            <li><strong>We do not retain records of your final ticket purchases.</strong></li>
          </ul>
          <p>
            Please review the privacy policies of Shaw Theatres and Golden Village when completing your checkout on their respective platforms.
          </p>
  
          <h2>3. Location Information</h2>
          <p>
            To provide localized features—such as calculating the real-time distance to nearby cinemas—our Service may request access to your device's location.
          </p>
          <ul>
            <li>This location data is processed <strong>locally on your device</strong>.</li>
            <li>It is <strong>not</strong> transmitted to, saved on, or stored in our corporate servers or databases.</li>
          </ul>
          <p>
            You can enable or disable location permissions at any time through your device or browser settings.
          </p>
  
          <h2>4. Log Data and Analytics</h2>
          <p>
            When you access the Service, our servers automatically record standard infrastructure data ("Log Data"). This may include your device's Internet Protocol ("IP") address, browser type, operating system, and the time and date of your visit. This data is used strictly to monitor server health, prevent abuse, and ensure optimal performance.
          </p>
          <p>
            As the Service expands (including the rollout of our native mobile applications), we may integrate industry-standard third-party analytics or advertising partners to help fund and improve the platform. Should we deploy behavioral remarketing or tracking cookies in the future, this policy will be explicitly updated to reflect those additions and provide opt-out instructions.
          </p>
  
          <h2>5. Cookies</h2>
          <p>
            We use minimal standard "cookies" (small data files stored on your device) to maintain session stability and remember basic user interface preferences (such as your preferred cinema filters) while you navigate the platform. You can instruct your browser to refuse all cookies, though some features of the Service may not function properly without them.
          </p>
  
          <h2>6. Security</h2>
          <p>
            The security of your experience is a corporate priority. By minimizing the data we collect to almost zero, we drastically reduce security risks. However, please acknowledge that no method of transmission over the Internet is 100% secure.
          </p>
  
          <h2>7. Changes To This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy periodically to reflect changes in infrastructure, legal requirements, or the addition of new features (such as mobile app deployments or analytics integrations). We will notify you of any changes by posting the revised Privacy Policy on this page. Changes are legally effective when they are posted.
          </p>
  
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy or our operational data practices, please direct your inquiries to our compliance team via the contact channels provided on our platform.
          </p>
        </section>
      </article>
    </main>
  </template>
  
  <style scoped>
  .privacy-view {
    padding: 40px 20px 80px; 
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
    .privacy-view {
      padding-top: 40px;
    }
    
    .document-body h2 {
      margin-top: 36px;
    }
  }
  </style>