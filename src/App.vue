<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="hero-section">
      <div class="hero-text">
        <img src="@/assets/mm.png" alt="mm" />
        <h1>Cinematix</h1>
      </div>
      <div class="hero-logos">
        <img src="@/assets/gv-logo.png" alt="GV" />
        <img src="@/assets/shaw-logo.png" alt="Shaw" />
      </div>
    </header>
    
    <RouterView />

    <footer class="footer">
      <div class="footer-shop">
        More ways to watch: Find a <a href="https://carnivalcinemas.sg/#/" target="_blank" rel="noopener noreferrer">Carnival</a>, <a href="https://www.eaglewingscinematics.com.sg/" target="_blank" rel="noopener noreferrer">EagleWings</a>, or <a href="https://filmhouse.sg/#/" target="_blank" rel="noopener noreferrer">Filmhouse</a> cinema.      </div>
      <div class="footer-end">
        <div class="footer-legal">
          <div class="footer-legal-copyright">
            Copyright © 2026 Cinematix. All rights reserved.
          </div>
          <ul class="footer-legal-links" role="list">
            <li role="listitem"><router-link to="/privacy">Privacy Policy</router-link></li>
            <li role="listitem"><router-link to="/terms">Terms of Use</router-link></li>
          </ul>
        </div>
        <div class="footer-locale">
          Singapore
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.app-layout {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer {
  margin-top: auto; 
}

/* Header */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;
}
.hero-text {
  display: flex;
  gap:1px;
  height: clamp(34px, 6vw, 56px);
}
.hero-text h1, .hero-text .subtitle {
  margin: 0;
}
.hero-logos {
  display: flex;
  gap: 12px;
  height: clamp(34px, 6vw, 56px);
  align-items: center;
}
.hero-logos img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

/* Footer */
.footer {
  padding: 17px 0 21px;
  font-size: 12px;
  line-height: 1.33337;
  font-weight: 400;
  color: var(--muted);
}
.footer a {
  color: var(--text);
  transition: color 0.1s ease;
  text-decoration: none;
}
.footer a:hover {
  text-decoration: underline;
}
.footer-shop {
  padding-bottom: 11px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 11px;
}
.footer-shop a {
  color: #0066cc;
}
.footer-end {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-legal {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.footer-legal-copyright {
  margin-right: 30px;
  white-space: nowrap;
}
.footer-legal-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}
.footer-legal-links li {
  margin-right: 10px;
  padding-right: 12px;
  border-right: 1px solid var(--line);
}
.footer-legal-links li:last-child {
  margin-right: 0;
  padding-right: 0;
  border-right: none;
}
</style>