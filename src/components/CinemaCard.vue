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
            @click="handleSessionClick($event, session, movie)"
          >
            <span class="time-label">{{ formatTime(session.time) }}</span>
            <span class="format-label">{{ session.format }}</span>
          </a>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <transition name="ticket-fade">
        <div v-if="activeTicket" class="ticket-overlay" @click.self="closeTicket">
          <div class="ticket-card">
            
            <div class="ticket-poster" :style="{ backgroundImage: `url(${activeTicket.posterUrl})` }">
              <button class="ticket-close" @click="closeTicket">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>
            </div>

            <div class="ticket-content">
              <h2 class="ticket-movie-title">{{ activeTicket.movieTitle }}</h2>
              <p class="ticket-cinema-name">{{ cinemaData.cinemaName }}</p>
              <p class="ticket-time-format">
                {{ formatDay(activeTicket.time) }}, {{ formatTime(activeTicket.time) }} &nbsp;•&nbsp; {{ activeTicket.format }}
              </p>
            </div>

            <div class="ticket-divider">
              <div class="notch left"></div>
              <div class="notch right"></div>
            </div>

            <div class="ticket-footer">
              <a :href="activeTicket.bookingUrl" target="_blank" class="ticket-buy-btn" @click="closeTicket">
                Buy tickets
              </a>
            </div>

          </div>
        </div>
      </transition>
    </Teleport>

  </article>
</template>

<script setup>
import { ref } from 'vue';

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

const formatDay = (timestamp) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(timestamp);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';

  return targetDate.toLocaleDateString('en-SG', {
    weekday: 'long',
  });
};

const activeTicket = ref(null);

const handleSessionClick = (e, session, movie) => {
  if (window.innerWidth <= 760) {
    e.preventDefault();
    activeTicket.value = {
      ...session,
      movieTitle: movie.movieTitle,
      posterUrl: movie.posterUrl
    };
  }
};

const closeTicket = () => {
  activeTicket.value = null;
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

.ticket-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85); 
  backdrop-filter: blur;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ticket-card {
  width: 100%;
  max-width: 340px;
  background: #1c1c1e;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
}

.ticket-poster {
  height: 200px;
  background-size: cover;
  background-position: top center;
  position: relative;
}

.ticket-poster::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #1c1c1e, transparent);
}

.ticket-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.ticket-content {
  padding: 10px 24px 20px;
  text-align: center;
}

.ticket-movie-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #fff;
}

.ticket-cinema-name {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 500;
  color: #a1a1a6;
}

.ticket-time-format {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #a1a1a6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ticket-divider {
  position: relative;
  height: 24px;
  background: #1c1c1e;
  display: flex;
  align-items: center;
}

.ticket-divider::before {
  content: '';
  position: absolute;
  left: 24px;
  right: 24px;
  height: 1px;
  border-top: 2px dashed rgba(255, 255, 255, 0.15);
}

.notch {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #0d0d0e; 
  border-radius: 50%;
  top: 0;
}
.notch.left { left: -12px; }
.notch.right { right: -12px; }

.ticket-footer {
  padding: 10px 24px 24px;
}

.ticket-buy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 54px;
  background: #fff;
  color: #000;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.1s;
}

.ticket-buy-btn:active {
  transform: scale(0.97);
}

.ticket-fade-enter-active,
.ticket-fade-leave-active {
  transition: opacity 0.3s ease;
}
.ticket-fade-enter-active .ticket-card,
.ticket-fade-leave-active .ticket-card {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.ticket-fade-enter-from,
.ticket-fade-leave-to {
  opacity: 0;
}
.ticket-fade-enter-from .ticket-card,
.ticket-fade-leave-to .ticket-card {
  transform: scale(0.9) translateY(20px);
}
</style>