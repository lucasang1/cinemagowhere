import fs from 'fs';
import path from 'path';

const OUTPUT_PATH = path.resolve('./src/assets/mockData.js');

const getNextDates = (days = 4) => {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(d);
  });
};

const epochToDate = (epochMs) => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore' }).format(new Date(epochMs));
};

const formatGvCheckoutDate = (epochMs) => {
  const formatted = new Intl.DateTimeFormat('en-GB', { 
    timeZone: 'Asia/Singapore',
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(new Date(epochMs));
  return formatted.replace(/\//g, '-'); 
};

const cleanTitle = (title) => title.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

const detectFormat = (raw = '') => {
  const text = raw.toLowerCase();
  if (text.includes('imax')) return 'IMAX';
  if (text.includes('lumiere grand')) return 'Lumiere Grand';
  if (text.includes('lumiere')) return 'Lumiere';
  if (text.includes('dreamers')) return 'Dreamers';
  if (text.includes('premiere')) return 'Premiere';
  if (text.includes('gold class express')) return 'Gold Class Express';
  if (text.includes('gold class')) return 'Gold Class';
  if (text.includes('gvmax atmos') || text.includes('dolby atmos')) return 'GVmax Atmos';
  if (text.includes('gvmax')) return 'GVmax';
  if (text.includes('gemini')) return 'Gemini';
  if (text.includes('d-box') || text.includes('dbox')) return 'D-Box';
  if (text.includes('auro')) return 'Auro';
  if (text.includes('duo')) return 'Duo';
  if (text.includes('deluxe')) return 'Deluxe Plus';
  if (text.includes('3d')) return '3D';
  return 'Standard';
};

async function scrapeShaw(dates) {
  console.log('🍿 Scraping Shaw Theatres...');
  const shawSessions = [];

  for (const date of dates) {
    const url = `https://shaw.sg/internal/get_show_times?date=${date}&movieId=0&locationId=0&promotionId=0`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/147.0.0.0 Safari/537.36',
          'x-api-forward-to': 'internal',
          'x-app': 'PWSM'
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      data.forEach(movie => {
        if (!movie.showTimes) return;
        
        movie.showTimes.forEach(showTime => {
          shawSessions.push({
            chain: 'Shaw',
            cinemaName: showTime.locationVenueName, 
            movieTitle: movie.primaryTitle,
            date: showTime.displayDate,
            timeRaw: showTime.displayTime,
            format: detectFormat(`${showTime.locationVenueName} ${showTime.formatCode}`),
            rating: showTime.classifyCode || movie.classifyCode || 'TBA',
            posterUrl: showTime.posterUrl || movie.posterUrl || '', 
            sessionId: showTime.performanceId.toString(),
            bookingUrl: `https://shaw.sg/showtimes/${showTime.performanceId}` 
          });
        });
      });
      console.log(`   ✅ Shaw: Scraped ${date}`);
    } catch (e) {
      console.error(`   ❌ Shaw: Failed on ${date} - ${e.message}`);
    }
  }
  return shawSessions;
}

async function scrapeGV() {
  console.log('🍿 Scraping Golden Village...');
  const gvSessions = [];

  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json; charset=UTF-8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/147.0.0.0 Safari/537.36',
    'x_developer': 'ENOVAX'
  };

  try {
    const moviesRes = await fetch('https://www.gv.com.sg/.gv-api/homenowshowing', {
      method: 'POST',
      headers: headers,
      body: "{}"
    });
    
    const moviesData = await moviesRes.json();
    const movies = moviesData.data || moviesData; 

    const fetchPromises = movies.filter(m => m.filmCd).map(async (movie) => {
      try {
        const sessionRes = await fetch('https://www.gv.com.sg/.gv-api/sessionforfilm', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ filmCode: movie.filmCd })
        });
        
        const sessionData = await sessionRes.json();
        const details = sessionData.data;

        if (details && details.locations) {
          details.locations.forEach(location => {
            location.dates.forEach(dateObj => {
              dateObj.times.forEach(time => {
                gvSessions.push({
                   chain: 'GV',
                   cinemaName: location.name,
                   movieTitle: details.filmTitle,
                   date: epochToDate(time.showDate),
                   timeRaw: time.time12,
                   format: detectFormat(location.name),
                   rating: details.rating || 'TBA',
                   posterUrl: movie.poster || movie.posterUrl || movie.thumbUrl || '',
                   sessionId: `${location.id}-${details.filmCd}-${time.showDate}-${time.time24}`,
                   bookingUrl: `https://www.gv.com.sg/GVSeatSelection#/cinemaId/${location.id}/filmCode/${details.filmCd}/showDate/${formatGvCheckoutDate(time.showDate)}/showTime/${time.time24}/hallNumber/${time.hallNumber}`
                });
              });
            });
          });
        }
      } catch (err) { }
    });

    await Promise.all(fetchPromises);
    console.log(`   ✅ GV: Successfully scraped all sessions.`);
  } catch (e) {
    console.error(`   ❌ GV: Failed to scrape - ${e.message}`);
  }
  
  return gvSessions;
}

const coordinateDictionary = {
  'gv bedok': { lat: 1.3249, lng: 103.9296 },
  'gv bishan': { lat: 1.3507, lng: 103.8489 },
  'gv bugis+': { lat: 1.2998, lng: 103.8558 },
  'gv capitol': { lat: 1.2931, lng: 103.8513 },
  'gv century square': { lat: 1.3522, lng: 103.9446 },
  'gv cineleisure': { lat: 1.3015, lng: 103.8364 },
  'gv city square': { lat: 1.3114, lng: 103.8567 },
  'gv downtown east': { lat: 1.3784, lng: 103.9553 },
  'gv funan': { lat: 1.2913, lng: 103.85 },
  'gv grand': { lat: 1.293, lng: 103.8319 },
  'gv jurong point': { lat: 1.3398, lng: 103.7067 },
  'gv katong': { lat: 1.3053, lng: 103.905 },
  'gv paya lebar': { lat: 1.3189, lng: 103.8935 },
  'gv plaza singapura': { lat: 1.3009, lng: 103.845 },
  'gv suntec': { lat: 1.295, lng: 103.8599 },
  'gv tampines': { lat: 1.3522, lng: 103.9446 },
  'gv tiong bahru': { lat: 1.2863, lng: 103.8266 },
  'gv vivocity': { lat: 1.2644, lng: 103.8229 },
  'gv yishun': { lat: 1.4296, lng: 103.8358 },
  'shaw theatres balestier': { lat: 1.3254, lng: 103.851 },
  'shaw theatres jewel': { lat: 1.3602, lng: 103.9897 },
  'shaw theatres lido': { lat: 1.3058, lng: 103.8318 },
  'shaw theatres lot one': { lat: 1.3851, lng: 103.7445 },
  'shaw theatres nex': { lat: 1.3508, lng: 103.8722 },
  'shaw theatres paya lebar quarter': { lat: 1.3174, lng: 103.8929 },
  'shaw theatres seletar': { lat: 1.3915, lng: 103.8764 },
  'shaw theatres waterway point': { lat: 1.4067, lng: 103.9026 },
  'shaw theatres jem': { lat: 1.3332, lng: 103.7436 }
};

const getParentCinema = (rawName, chain) => {
  const lower = rawName.toLowerCase();
  let id = rawName.toLowerCase().trim(); 

  if (chain === 'Shaw') {
    if (lower.includes('lido')) id = 'shaw theatres lido';
    else if (lower.includes('jem')) id = 'shaw theatres jem';
    else if (lower.includes('nex')) id = 'shaw theatres nex';
    else if (lower.includes('plq')) id = 'shaw theatres paya lebar quarter';
    else if (lower.includes('waterway')) id = 'shaw theatres waterway point';
    else if (lower.includes('jewel')) id = 'shaw theatres jewel';
    else if (lower.includes('lot one')) id = 'shaw theatres lot one';
    else if (lower.includes('balestier')) id = 'shaw theatres balestier';
    else if (lower.includes('seletar')) id = 'shaw theatres seletar';
  } else if (chain === 'GV') {
    if (lower.includes('vivocity')) id = 'gv vivocity';
    else if (lower.includes('bugis')) id = 'gv bugis+';
    else if (lower.includes('plaza')) id = 'gv plaza singapura';
    else if (lower.includes('suntec')) id = 'gv suntec';
    else if (lower.includes('katong')) id = 'gv katong';
    else if (lower.includes('funan')) id = 'gv funan';
    else if (lower.includes('city square')) id = 'gv city square';
    else if (lower.includes('great world') || lower.includes('grand')) id = 'gv grand';
    else if (lower.includes('paya lebar')) id = 'gv paya lebar';
    else if (lower.includes('bedok')) id = 'gv bedok';
    else if (lower.includes('bishan')) id = 'gv bishan';
    else if (lower.includes('capitol')) id = 'gv capitol';
    else if (lower.includes('century square')) id = 'gv century square';
    else if (lower.includes('cineleisure')) id = 'gv cineleisure';
    else if (lower.includes('downtown east')) id = 'gv downtown east';
    else if (lower.includes('jurong point')) id = 'gv jurong point';
    else if (lower.includes('tampines')) id = 'gv tampines';
    else if (lower.includes('tiong bahru')) id = 'gv tiong bahru';
    else if (lower.includes('yishun')) id = 'gv yishun';
  }

  const properNames = {
    'shaw theatres lido': 'Shaw Theatres Lido',
    'shaw theatres jem': 'Shaw Theatres Jem',
    'shaw theatres nex': 'Shaw Theatres nex',
    'shaw theatres paya lebar quarter': 'Shaw Theatres Paya Lebar Quarter',
    'shaw theatres waterway point': 'Shaw Theatres Waterway Point',
    'shaw theatres jewel': 'Shaw Theatres Jewel',
    'shaw theatres lot one': 'Shaw Theatres Lot One',
    'shaw theatres balestier': 'Shaw Theatres Balestier',
    'shaw theatres seletar': 'Shaw Theatres Seletar',
    'gv vivocity': 'GV VivoCity',
    'gv bugis+': 'GV Bugis+',
    'gv plaza singapura': 'GV Plaza Singapura',
    'gv suntec': 'GV Suntec City',
    'gv katong': 'GV Katong',
    'gv funan': 'GV Funan',
    'gv city square': 'GV City Square',
    'gv grand': 'GV Grand, Great World',
    'gv paya lebar': 'GV Paya Lebar',
    'gv bedok': 'GV Bedok',
    'gv bishan': 'GV Bishan',
    'gv capitol': 'GV Capitol',
    'gv century square': 'GV Century Square',
    'gv cineleisure': 'GV Cineleisure',
    'gv downtown east': 'GV Downtown East',
    'gv jurong point': 'GV Jurong Point',
    'gv tampines': 'GV Tampines',
    'gv tiong bahru': 'GV Tiong Bahru',
    'gv yishun': 'GV Yishun'
  };

  return { id, name: properNames[id] || rawName };
};

const parseTimeToEpoch = (dateStr, timeStr) => {
  let hours = 0, mins = 0;
  const cleaned = timeStr.toString().replace(/\s+/g, '').toUpperCase();
  
  const match12 = cleaned.match(/(\d{1,2}):(\d{2})(AM|PM)/);
  const match24 = cleaned.match(/(\d{1,2}):(\d{2})$/);
  const matchRaw24 = cleaned.match(/^(\d{2})(\d{2})$/);

  if (match12) {
    hours = parseInt(match12[1]);
    mins = parseInt(match12[2]);
    if (match12[3] === 'PM' && hours !== 12) hours += 12;
    if (match12[3] === 'AM' && hours === 12) hours = 0;
  } else if (match24) {
    hours = parseInt(match24[1]);
    mins = parseInt(match24[2]);
  } else if (matchRaw24) {
    hours = parseInt(matchRaw24[1]);
    mins = parseInt(matchRaw24[2]);
  } else {
     return new Date(`${dateStr}T00:00:00+08:00`).getTime();
  }

  const pad = (n) => n.toString().padStart(2, '0');
  const isoString = `${dateStr}T${pad(hours)}:${pad(mins)}:00+08:00`;
  
  return new Date(isoString).getTime();
};

(async () => {
  console.log('🚀 Starting V9 API Aggregator...\n');
  const dates = getNextDates(4); 
  
  const [shawData, gvData] = await Promise.all([
    scrapeShaw(dates),
    scrapeGV()
  ]);

  const masterPosters = {};
  shawData.forEach(session => {
    if (session.posterUrl) {
      masterPosters[cleanTitle(session.movieTitle)] = session.posterUrl;
    }
  });

  const rawSessions = [...shawData, ...gvData];
  
  const allSessions = rawSessions.map(session => {
    const parent = getParentCinema(session.cinemaName, session.chain);
    const cleanMovieName = cleanTitle(session.movieTitle);
    const displayTitle = session.movieTitle.replace(/\*+\s*$/, '').trim();
    
    return {
      ...session,
      movieTitle: displayTitle,
      cinemaId: parent.id,
      cinemaName: parent.name,
      hallName: session.cinemaName, 
      posterUrl: masterPosters[cleanMovieName] || session.posterUrl || '',
      time: parseTimeToEpoch(session.date, session.timeRaw)
    };
  });

  const activeCinemasMap = new Map();
  
  allSessions.forEach(session => {
    if (!activeCinemasMap.has(session.cinemaId)) {
      const coords = coordinateDictionary[session.cinemaId] || null;
      activeCinemasMap.set(session.cinemaId, {
        id: session.cinemaId,
        chain: session.chain,
        name: session.cinemaName,
        coords: coords
      });
    }
  });

  const activeCinemas = Array.from(activeCinemasMap.values());
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const fileContent = `// Auto-generated by V9 API Scraper\n// Generated at: ${new Date().toISOString()}\n\nexport const mockCinemas = ${JSON.stringify(activeCinemas, null, 2)};\n\nexport const mockSessions = ${JSON.stringify(allSessions, null, 2)};\n`;

  fs.writeFileSync(OUTPUT_PATH, fileContent);
  console.log(`\n🎉 Done! Extracted ${allSessions.length} total sessions to ${OUTPUT_PATH}`);
})();