<template>
  <article class="cinema-card">
    <header class="cinema-header">
      <div>
        <h2 class="cinema-name">
          <router-link :to="`/cinema/${slugify(cinemaData.cinemaId)}`" class="seo-link">
            <span v-if="cinemaData.cinemaName.startsWith('Shaw Theatres')" class="cinema-prefix">Shaw Theatres</span>
            <span v-else-if="cinemaData.cinemaName.startsWith('GV')" class="cinema-prefix">GV</span>
            {{ cinemaData.cinemaName.replace(/^Shaw Theatres\s*/, '').replace(/^GV\s*/, '') }}
          </router-link>
        </h2>
      </div>

      <span v-if="cinemaData.distance" class="cinema-distance">
        {{ cinemaData.distance }} km
      </span>
    </header>

    <div class="movie-showtime-groups">
      <section
        v-for="movie in cinemaData.movies" 
        :key="movie.movieTitle"
        class="movie-showtime-group"
        :style="{ '--poster-bg': `url(${movie.posterUrl})` }"
      >
        <div class="movie-row-header">
          <h3 class="movie-title">
            <router-link :to="`/movie/${slugify(movie.movieTitle)}`" class="seo-link">
              {{ movie.movieTitle }}
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
</template>

<script setup>
const props = defineProps({
  cinemaData: {
    type: Object,
    required: true,
  },
});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
</script>

<style scoped>
.seo-link {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
}
.seo-link:hover {
  text-decoration: underline;
}

.movie-row-header {
  display: flex;
  justify-content: space-between; 
  align-items: flex-start;
  margin-bottom: 12px;
}

.movie-title {
  margin: 0;
  padding-right: 16px; 
}

.rating-pill {
  flex-shrink: 0; 
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  background-color: var(--soft);
  padding: 4px 8px;
  border-radius: 12px;
  line-height: 1.2;
}

.movie-showtime-group::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -150px; 
  width: 130px; 
  height: 190px;
  background-image: var(--poster-bg);
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-50%) scale(0.9) rotate(0deg);
  transform-origin: center right;
  transition: all 0.2s ease;
  z-index: 100;
  pointer-events: none;
}

.movie-showtime-group:hover::after {
  opacity: 1;
  visibility: visible;
  left: -150px; 
  transform: translateY(-50%) scale(1) rotate(0deg); 
}
</style>