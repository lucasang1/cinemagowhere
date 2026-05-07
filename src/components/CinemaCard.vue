<template>
    <article class="cinema-card">
      <header class="cinema-header">
        <div>
          <h2 class="cinema-name">
            <span v-if="cinemaData.cinemaName.startsWith('Shaw Theatres')" class="cinema-prefix">Shaw Theatres</span>
            <span v-else-if="cinemaData.cinemaName.startsWith('GV')" class="cinema-prefix">GV</span>
            {{ cinemaData.cinemaName.replace(/^Shaw Theatres\s*/, '').replace(/^GV\s*/, '') }}
          </h2>
        </div>
  
        <span v-if="cinemaData.distance" class="cinema-distance">
          {{ cinemaData.distance }} km
        </span>
      </header>
  
      <div class="movie-showtime-groups">
        <section
          v-for="movieGroup in groupedSessions"
          :key="movieGroup.movieTitle"
          class="movie-showtime-group"
          :style="{ '--poster-bg': `url(${movieGroup.posterUrl})` }"
        >
          <div class="movie-row-header">
            <h3 class="movie-title">{{ movieGroup.movieTitle }}</h3>
            <span v-if="movieGroup.rating" class="rating-pill">{{ movieGroup.rating }}</span>
          </div>
  
          <div class="showtimes-grid">
            <a
              v-for="session in movieGroup.sessions"
              :key="session.id"
              :href="session.bookingUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="showtime-slot"
            >
              <span class="time-label">{{ formatTime(session.time) }}</span>
              <span class="format-label">{{ session.format }}</span>
            </a>
          </div>
        </section>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    cinemaData: {
      type: Object,
      required: true,
    },
  });
  
  const groupedSessions = computed(() => {
    const map = new Map();
  
    props.cinemaData.sessions.forEach((session) => {
      if (!map.has(session.movieTitle)) {
        map.set(session.movieTitle, {
          movieTitle: session.movieTitle,
          // Extract rating and posterUrl from the first session of this movie
          rating: session.rating,
          posterUrl: session.posterUrl,
          sessions: [],
        });
      }
  
      map.get(session.movieTitle).sessions.push(session);
    });
  
    return Array.from(map.values())
      .map((group) => ({
        ...group,
        sessions: group.sessions.sort((a, b) => a.time - b.time),
      }))
      .sort((a, b) => {
        const firstTimeA = a.sessions[0]?.time || 0;
        const firstTimeB = b.sessions[0]?.time || 0;
        return firstTimeA - firstTimeB;
      });
  });
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-SG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  </script>
  
  <style scoped>
  /* 1. Header Layout Alignment */
  .movie-row-header {
    display: flex;
    justify-content: space-between; /* Pushes pill to the absolute right */
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .movie-title {
    margin: 0;
    padding-right: 16px; /* Prevents long titles from touching the pill */
  }
  
  /* 2. The Rating Pill */
  .rating-pill {
    flex-shrink: 0; /* Prevents the pill from squishing on long titles */
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    background-color: #f1f5f9;
    padding: 4px 8px;
    border-radius: 12px;
    line-height: 1.2;
  }
    
  /* 4. The 3D Pop-Out Poster Trick */
    .movie-showtime-group::after {
    content: "";
    position: absolute;
    top: 50%;
    left: -150px; /* Starts tucked inside */
    width: 130px; 
    height: 190px;
    background-image: var(--poster-bg);
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%) scale(0.9) rotate(0deg); /* 90% zoom default */
    transform-origin: center right;
    transition: all 0.2s ease;
    z-index: 100;
    pointer-events: none;
    }

    .movie-showtime-group:hover::after {
    opacity: 1;
    visibility: visible;
    left: -150px; /* Slides out completely to the left */
    transform: translateY(-50%) scale(1) rotate(0deg); /* 100% zoom */
    }
  </style>