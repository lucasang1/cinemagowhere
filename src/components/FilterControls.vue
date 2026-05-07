<template>
  <div class="filter-group">
    <select v-model="internalDate" class="filter-select" @change="emitChange">
      <option v-for="date in safeDates" :key="date.value" :value="date.value">
        {{ date.label }}
      </option>
    </select>

    <select v-model="internalCinema" class="filter-select" @change="emitChange">
      <option value="all">All Cinemas</option>
      <option v-for="cinema in cinemas" :key="cinema.id" :value="cinema.id">
        {{ cinema.name }} {{ cinema.distance ? `(${cinema.distance} km)` : '' }}
      </option>
    </select>

    <select v-model="internalMovie" class="filter-select" @change="emitChange">
      <option value="all">All Movies</option>
      <option v-for="movie in movies" :key="movie" :value="movie">
        {{ movie }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  cinemas: {
    type: Array,
    default: () => [],
  },
  movies: {
    type: Array,
    default: () => [],
  },
  dates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['filter-change']);

const getDateValue = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const fallbackDates = computed(() => {
  return Array.from({ length: 4 }, (_, index) => {
    const value = getDateValue(index);

    if (index === 0) return { value, label: 'Today' };
    if (index === 1) return { value, label: 'Tomorrow' };

    const date = new Date();
    date.setDate(date.getDate() + index);

    const dayLabel = date.toLocaleDateString('en-SG', {
      weekday: 'short',
    });

    return {
      value,
      label: `Next ${dayLabel}`,
    };
  });
});

const safeDates = computed(() => {
  return props.dates.length ? props.dates : fallbackDates.value;
});

const internalDate = ref(safeDates.value[0]?.value || getDateValue(0));
const internalCinema = ref('all');
const internalMovie = ref('all');

const emitChange = () => {
  emit('filter-change', {
    date: internalDate.value,
    cinema: internalCinema.value,
    movie: internalMovie.value,
  });
};

watch(
  safeDates,
  (newDates) => {
    if (!newDates.length) return;

    const dateExists = newDates.some((date) => date.value === internalDate.value);

    if (!dateExists) {
      internalDate.value = newDates[0].value;
    }

    emitChange();
  },
  { immediate: true }
);
</script>