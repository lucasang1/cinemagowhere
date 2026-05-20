<template>
    <main class="home-view" v-if="movieData.cinemas.length">
      <div class="nav-header">
        <router-link to="/" class="back-btn">← Back to all movies</router-link>
      </div>
  
      <article class="cinema-card">
        <header class="cinema-header movie-focus-header">
          <h1 class="cinema-name">{{ movieData.title }}</h1>
        </header>
  
        <div class="movie-showtime-groups">
          <section
            v-for="cinema in movieData.cinemas" 
            :key="cinema.cinemaName"
            class="movie-showtime-group"
          >
            <div class="movie-row-header">
              <h3 class="movie-title">
                <router-link :to="`/cinema/${slugify(cinema.cinemaId)}`" class="seo-link">
                  {{ cinema.cinemaName }}
                </router-link>
              </h3>
            </div>
  
            <div class="showtimes-grid">
              <a
                v-for="session in cinema.sessions"
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
      <h2>Movie not found</h2>
      <router-link to="/" class="back-btn">Return home</router-link>
    </main>
  </template>
  
  <script setup>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { mockSessions } from '@/assets/mockData.js';
  
  const route = useRoute();
  
  const slugify = (text) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };
  
  const movieData = computed(() => {
    const cutoffTime = Date.now() - (15 * 60 * 1000);
    const sessions = mockSessions.filter(s => slugify(s.movieTitle) === route.params.id && s.time > cutoffTime);
    
    if (!sessions.length) return { title: '', cinemas: [] };
  
    const title = sessions[0].movieTitle;
    const map = new Map();
  
    sessions.forEach(session => {
      if (!map.has(session.cinemaId)) {
        map.set(session.cinemaId, {
          cinemaId: session.cinemaId,
          cinemaName: session.cinemaName,
          sessions: []
        });
      }
      map.get(session.cinemaId).sessions.push(session);
    });
  
    return {
      title,
      cinemas: Array.from(map.values()).sort((a, b) => a.cinemaName.localeCompare(b.cinemaName))
    };
  });
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  let scriptEl;
  onMounted(() => {
    if (!movieData.value.title) return;
    
    document.title = `${movieData.value.title} - Singapore Showtimes | CinemaGoWhere?`;
  
    const events = movieData.value.cinemas.flatMap(c => 
      c.sessions.map(s => ({
        "@type": "ScreeningEvent",
        "name": movieData.value.title,
        "location": {
          "@type": "MovieTheater",
          "name": c.cinemaName
        },
        "startDate": new Date(s.time).toISOString()
      }))
    );
  
    const schema = {
      "@context": "https://schema.org",
      "@graph": events
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
  </style>