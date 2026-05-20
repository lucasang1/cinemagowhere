<template>
    <main class="home-view" v-if="cinema">
      <div class="nav-header">
        <router-link to="/" class="back-btn">← Back to all showtimes</router-link>
      </div>
  
      <article class="cinema-card">
        <header class="cinema-header">
          <h1 class="cinema-name">{{ cinema.name }}</h1>
        </header>
  
        <div class="movie-showtime-groups">
          <section
            v-for="movie in movies" 
            :key="movie.title"
            class="movie-showtime-group"
          >
            <div class="movie-row-header">
              <h3 class="movie-title">
                <router-link :to="`/movie/${slugify(movie.title)}`" class="seo-link">
                  {{ movie.title }}
                </router-link>
              </h3>
              <span v-if="movie.rating" class="rating-pill">{{ movie.rating }}</span>
            </div>
  
            <div class="showtimes-grid">
              <a
                v-for="session in movie.sessions"
                :key="session.bookingUrl"
                :href="session.bookingUrl"
                target="_blank"
                class="showtime-slot"
              >
                <span class="time-label">{{ formatTime(session.time) }}</span>
                <span class="format-label">{{ session.format }}</span>
              </a>
            </div>
          </section>
        </div>
      </article>
    </main>
    
    <main class="home-view empty-state" v-else>
      <h2>Cinema not found</h2>
      <router-link to="/" class="back-btn">Return home</router-link>
    </main>
  </template>
  
  <script setup>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { mockCinemas, mockSessions } from '@/assets/mockData.js';
  
  const route = useRoute();
  
  const slugify = (text) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };
  
  const cinema = computed(() => {
    return mockCinemas.find(c => slugify(c.id) === route.params.id);
  });
  
  const movies = computed(() => {
    if (!cinema.value) return [];
    
    const cutoffTime = Date.now() - (15 * 60 * 1000);
    const cinemaSessions = mockSessions.filter(s => s.cinemaId === cinema.value.id && s.time > cutoffTime);
    
    const map = new Map();
    cinemaSessions.forEach(session => {
      if (!map.has(session.movieTitle)) {
        map.set(session.movieTitle, {
          title: session.movieTitle,
          rating: session.rating,
          sessions: []
        });
      }
      map.get(session.movieTitle).sessions.push(session);
    });
  
    return Array.from(map.values()).sort((a, b) => a.sessions[0].time - b.sessions[0].time);
  });
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  let scriptEl;
  onMounted(() => {
    if (!cinema.value) return;
    
    document.title = `${cinema.value.name} Showtimes | CinemaGoWhere?`;
  
    const schema = {
      "@context": "https://schema.org",
      "@type": "MovieTheater",
      "name": cinema.value.name,
      "url": window.location.href
    };
  
    scriptEl = document.createElement('script');
    scriptEl.setAttribute('type', 'application/ld+json');
    scriptEl.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptEl);
  });
  
  onUnmounted(() => {
    document.title = "CinemaGoWhere?";
    if (scriptEl) document.head.removeChild(scriptEl);
  });
  </script>
  
  <style scoped>
  .nav-header {
    margin-bottom: 20px;
  }
  .back-btn {
    color: var(--muted);
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-btn:hover {
    color: var(--text);
  }
  .seo-link {
    color: inherit;
    text-decoration: none;
  }
  .seo-link:hover {
    text-decoration: underline;
  }
  .movie-showtime-group:last-child {
    border-bottom-left-radius: 26px;
    border-bottom-right-radius: 26px;
  }
  .rating-pill {
    flex-shrink: 0; 
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    background-color: var(--soft);
    padding: 4px 8px;
    border-radius: 12px;
  }
  </style>