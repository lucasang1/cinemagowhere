<template>
  <main class="home-view" :data-searched="hasSearched ? 'true' : 'false'">
    
    <div class="splash-header">
      <img src="@/assets/mm.png" alt="mm" />
      <h1>CinemaGoWhere?</h1>
    </div>

    <FilterControls
      :dates="dateOptions"
      :cinemas="availableCinemas"
      :movies="availableMovies"
      @filter-change="handleFilterChange"
    />

    <button class="splash-search-btn" @click="hasSearched = true">
      <img src="@/assets/mm.png" alt="Search" />
    </button>

    <div class="results-container">
      <section v-if="groupedCinemaData.length" class="cinema-list">
        <CinemaCard
          v-for="cinema in groupedCinemaData"
          :key="cinema.cinemaId"
          :cinema-data="cinema"
        />
      </section>
      <section v-else class="empty-state">
        <h2>No showtimes found</h2>
        <p>Try another date, cinema, or movie.</p>
      </section>
    </div>

  </main>
</template>
  
<script>
import CinemaCard from '@/components/CinemaCard.vue';
import FilterControls from '@/components/FilterControls.vue';
import { mockCinemas, mockSessions } from '@/assets/mockData.js';

export default {
  name: 'HomeView',

  components: {
    CinemaCard,
    FilterControls,
  },

  data() {
    const cachedLocation = localStorage.getItem('cgw_location');
    return {
      hasSearched: false,
      userLocation: cachedLocation ? JSON.parse(cachedLocation) : null,
      selectedDate: this.getDateValue(0),
      selectedCinema: 'all',
      selectedMovie: 'all',
    };
  },

  computed: {
    normalizedSessions() {
      const slugMap = new Map();

      mockSessions.forEach((session) => {
        const rawTitle = session.movieTitle || '';
        const slug = rawTitle
          .toLowerCase()
          .replace(/\(3d\)|\(2d\)|\(atmos\)|\(m\)/gi, '') 
          .replace(/cws:\s*/gi, '') 
          .replace(/\s*-\s*family movie day/gi, '') 
          .replace(/[^a-z0-9]/g, ''); 

        let prettyTitle = rawTitle
          .replace(/\(3d\)|\(2d\)|\(atmos\)|\(m\)/gi, '')
          .replace(/cws:\s*/gi, '')
          .replace(/\s*-\s*family movie day/gi, '')
          .replace(/Adoptiondrive/gi, 'Adoption Drive') 
          .replace(/Sosd/gi, 'SOSD') 
          .replace(/^[-–]+|[-–]+$/g, '') 
          .trim();

        if (!slugMap.has(slug)) {
          slugMap.set(slug, prettyTitle);
        } else if (prettyTitle.length < slugMap.get(slug).length) {
          slugMap.set(slug, prettyTitle);
        }
      });

      return mockSessions.map((session) => {
        const rawTitle = session.movieTitle || '';
        const slug = rawTitle
          .toLowerCase()
          .replace(/\(3d\)|\(2d\)|\(atmos\)|\(m\)/gi, '')
          .replace(/cws:\s*/gi, '')
          .replace(/\s*-\s*family movie day/gi, '')
          .replace(/[^a-z0-9]/g, '');

        return {
          ...session,
          originalTitle: rawTitle,
          movieTitle: slugMap.get(slug) || rawTitle, 
        };
      });
    },

    dateOptions() {
      return Array.from({ length: 4 }, (_, index) => {
        const value = this.getDateValue(index);

        if (index === 0) return { value, label: 'Today' };
        if (index === 1) return { value, label: 'Tomorrow' };

        const date = new Date();
        date.setDate(date.getDate() + index);
        return {
          value,
          label: date.toLocaleDateString('en-SG', { weekday: 'long', timeZone: 'Asia/Singapore' }),
        };
      });
    },

    cinemasWithDistance() {
      return mockCinemas
        .map((cinema) => ({
          ...cinema,
          distance: this.userLocation
            ? this.calculateDistance(this.userLocation.lat, this.userLocation.lng, cinema.coords.lat, cinema.coords.lng)
            : null,
        }))
        .sort((a, b) => {
          if (a.distance === null && b.distance === null) return a.name.localeCompare(b.name);
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return Number(a.distance) - Number(b.distance);
        });
    },

    sessionsForSelectedDate() {
      return this.normalizedSessions.filter(
        (session) => this.getSessionDateValue(session) === this.selectedDate
      );
    },

    upcomingSessionsForSelectedDate() {
      const cutoffTime = Date.now() - 15 * 60 * 1000;
      return this.sessionsForSelectedDate.filter((session) => session.time > cutoffTime);
    },

    filteredSessions() {
      return this.upcomingSessionsForSelectedDate.filter((session) => {
        const matchesCinema = this.selectedCinema === 'all' || session.cinemaId === this.selectedCinema;
        const matchesMovie = this.selectedMovie === 'all' || session.movieTitle === this.selectedMovie;
        return matchesCinema && matchesMovie;
      });
    },

    availableCinemas() {
      const validCinemaIds = new Set();
      this.upcomingSessionsForSelectedDate.forEach((session) => {
        if (this.selectedMovie !== 'all' && session.movieTitle !== this.selectedMovie) return;
        validCinemaIds.add(session.cinemaId);
      });
      return this.cinemasWithDistance.filter((cinema) => validCinemaIds.has(cinema.id));
    },

    availableMovies() {
      const movieSet = new Set();
      this.upcomingSessionsForSelectedDate.forEach((session) => {
        if (this.selectedCinema !== 'all' && session.cinemaId !== this.selectedCinema) return;
        movieSet.add(session.movieTitle);
      });
      return Array.from(movieSet).sort((a, b) => a.localeCompare(b));
    },

    groupedCinemaData() {
      const cinemaMap = new Map();

      this.filteredSessions.forEach((session) => {
        const cinema = this.cinemasWithDistance.find((item) => item.id === session.cinemaId);
        if (!cinema) return;

        if (!cinemaMap.has(cinema.id)) {
          cinemaMap.set(cinema.id, {
            cinemaId: cinema.id,
            cinemaName: cinema.name,
            chain: cinema.chain,
            distance: cinema.distance,
            movieGroups: new Map(),
          });
        }

        const cinemaEntry = cinemaMap.get(cinema.id);

        if (!cinemaEntry.movieGroups.has(session.movieTitle)) {
          cinemaEntry.movieGroups.set(session.movieTitle, {
            movieTitle: session.movieTitle,
            rating: session.rating,
            posterUrl: session.posterUrl,
            sessions: [],
          });
        }
        cinemaEntry.movieGroups.get(session.movieTitle).sessions.push(session);
      });

      return Array.from(cinemaMap.values())
        .map((cinema) => ({
          ...cinema,
          movies: Array.from(cinema.movieGroups.values()).sort(
            (a, b) => a.sessions[0].time - b.sessions[0].time
          ),
        }))
        .sort((a, b) => {
          if (a.distance === null && b.distance === null) return a.cinemaName.localeCompare(b.cinemaName);
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return Number(a.distance) - Number(b.distance);
        });
    },
  },

  mounted() {
    this.getUserLocation();
  },

  methods: {
    handleFilterChange(filters) {
      const nextDate = filters.date || this.selectedDate;
      const nextCinema = filters.cinema || 'all';
      const nextMovie = filters.movie || 'all';

      this.selectedDate = nextDate;
      
      this.$nextTick(() => {
        this.selectedCinema = nextCinema;
        this.selectedMovie = nextMovie;

        const cinemaStillValid =
          this.selectedCinema === 'all' ||
          this.availableCinemas.some((cinema) => cinema.id === this.selectedCinema);

        const movieStillValid =
          this.selectedMovie === 'all' ||
          this.availableMovies.some((movie) => movie === this.selectedMovie);

        if (!cinemaStillValid) {
          this.selectedCinema = 'all';
        }

        if (!movieStillValid) {
          this.selectedMovie = 'all';
        }
      });
    },

    getDateValue(offset) {
      const date = new Date();
      date.setDate(date.getDate() + offset);

      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    },

    getSessionDateValue(session) {
      if (!session?.time) {
        return session?.date || '';
      }

      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Singapore',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(session.time));
    },

    getUserLocation() {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.userLocation = newLocation;
          localStorage.setItem('cgw_location', JSON.stringify(newLocation));
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 300000,
        }
      );
    },

    calculateDistance(lat1, lng1, lat2, lng2) {
      const earthRadius = 6371;

      const dLat = this.toRadians(lat2 - lat1);
      const dLng = this.toRadians(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) *
          Math.cos(this.toRadians(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return (earthRadius * c).toFixed(1);
    },

    toRadians(value) {
      return value * (Math.PI / 180);
    },
  },
};
</script>