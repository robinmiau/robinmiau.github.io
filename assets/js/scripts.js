let toastTimer;
const browserTheme = matchMedia('(prefers-color-scheme: light)');
function updateThemeColor() {
    document.querySelector('meta[name="theme-color"]').content = browserTheme.matches
        ? '#f3f3f2'
        : '#1c1d1f';
}
browserTheme.addEventListener('change', updateThemeColor);
updateThemeColor();

function notify(message) {
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

document.querySelector('#discord').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText('robinmiau');
        notify('Discord username copied: robinmiau');
    } catch {
        notify('Find me on Discord: robinmiau');
    }
});

// Explicit URLs let Vite include and fingerprint the randomly selected illustrations.
const characters = [
    {
        image: new URL('../images/nagatoro.png', import.meta.url).href,
        name: 'Nagatoro',
        position: 'center top',
    },
    {
        image: new URL('../images/miku.webp', import.meta.url).href,
        name: 'Hatsune Miku',
        position: 'center top',
        width: 340,
        top: 16,
        right: -95,
    },
    {
        image: new URL('../images/emilia.webp', import.meta.url).href,
        name: 'Emilia',
        position: 'center top',
        width: 330,
        top: -8,
        right: -85,
    },
    {
        image: new URL('../images/kangel.png', import.meta.url).href,
        name: 'KAngel',
        position: 'center top',
        width: 240,
        top: 0,
        right: -45,
    },
    {
        image: new URL('../images/marin.png', import.meta.url).href,
        name: 'Marin Kitagawa',
        position: 'center top',
        width: 340,
        top: -60,
        right: -90,
    },
    {
        image: new URL('../images/zero-two.png', import.meta.url).href,
        name: 'Zero Two',
        position: 'center top',
        width: 240,
        top: 0,
        right: -45,
    },
    {
        image: new URL('../images/mai.png', import.meta.url).href,
        name: 'Mai Sakurajima',
        position: 'center top',
        width: 210,
        top: -45,
        right: -35,
    },
];
const character = characters[Math.floor(Math.random() * characters.length)];
// Create only the selected image; no default character is downloaded or flashed.
const characterImage = new Image();
characterImage.className = 'watching-character';
characterImage.id = 'watching-character';
characterImage.decoding = 'async';
characterImage.addEventListener(
    'load',
    () => {
        document.querySelector('#watching-character-slot').replaceChildren(characterImage);
    },
    { once: true },
);
characterImage.src = character.image;
characterImage.alt = character.name;
characterImage.title = character.name;
characterImage.style.objectPosition = character.position;
characterImage.style.top = `${character.top ?? 0}px`;
if (character.width) characterImage.style.width = `${character.width}px`;
if (character.right !== undefined) characterImage.style.right = `${character.right}px`;

// Use the birthday in Berlin rather than the visitor’s local timezone.
function updateAge(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, Number(part.value)]));
    const birthdayPending = values.month === 1 && values.day < 23;
    const age = values.year - 1999 - Number(birthdayPending);
    document.querySelector('#age').textContent = age;
    return age;
}
setInterval(updateAge, 60000);

function safeUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.href : null;
    } catch {
        return null;
    }
}

async function getAnimeFeed() {
    // MAL does not allow cross-origin browser requests. This public API supplies CORS headers.
    const items = [];
    const signal = AbortSignal.timeout(15000);
    for (let page = 1; ; page += 1) {
        const url = new URL('https://jikan.lucashdo.com/v1/users/robinmiau/animelist');
        url.searchParams.set('limit', '300');
        url.searchParams.set('page', String(page));
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Anime feed unavailable');
        const data = await response.json();
        if (!Array.isArray(data.data)) throw new Error('Invalid anime feed');
        for (const anime of data.data) {
            if (anime.status !== 'watching') continue;
            if (!Number.isInteger(anime.malId) || typeof anime.title !== 'string') {
                throw new Error('Invalid anime entry');
            }
            items.push({
                title: anime.title,
                url: 'https://myanimelist.net/anime/' + anime.malId,
                image: anime.imageUrl,
                watched: anime.progress ?? 0,
                episodes: anime.total,
            });
        }
        if (!data.meta?.pagination?.hasNextPage) break;
    }
    return { items };
}

let animeLoading = false;
async function loadAnime() {
    if (animeLoading) return;
    animeLoading = true;
    const list = document.querySelector('#watching-list');
    try {
        const data = await getAnimeFeed();
        if (!Array.isArray(data.items)) throw new Error('Invalid feed');
        const rows = data.items.map((item) => {
            const animeUrl = safeUrl(item.url);
            const row = document.createElement(animeUrl ? 'a' : 'div');
            row.className = 'watching-item';
            if (animeUrl) {
                row.href = animeUrl;
                row.target = '_blank';
                row.rel = 'noopener noreferrer';
            }
            const image = document.createElement('img');
            image.alt = '';
            image.width = 48;
            image.height = 68;
            image.loading = 'lazy';
            const imageUrl = safeUrl(item.image);
            if (imageUrl) image.src = imageUrl;
            const copy = document.createElement('span');
            const title = document.createElement('strong');
            title.textContent = item.title;
            const progress = document.createElement('small');
            progress.textContent = `Episode ${item.watched} / ${item.episodes || '?'}`;
            copy.append(title, progress);
            row.append(image, copy);
            return row;
        });
        list.replaceChildren(...rows);
        if (!rows.length) list.textContent = 'Nothing on my watchlist right now.';
        list.dataset.loaded = 'true';
    } catch {
        // Keep successful results during a failed refresh; never leave a loading skeleton stuck.
        if (!list.dataset.loaded) list.textContent = 'Anime list temporarily unavailable.';
    } finally {
        list.setAttribute('aria-busy', 'false');
        animeLoading = false;
    }
}

function renderTrack(track, container = document.querySelector('#recent-track')) {
    container.setAttribute('aria-busy', 'false');
    if (!track) {
        container.textContent = 'No recent tracks available.';
        return;
    }
    const link = document.createElement('a');
    link.className = 'track';
    link.href = safeUrl(track.url) || 'https://www.last.fm';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const imageUrl = safeUrl(track.image);
    if (imageUrl) {
        const image = document.createElement('img');
        image.className = 'track-cover';
        image.alt = track.album ? `${track.album} cover` : '';
        image.src = imageUrl;
        link.append(image);
        const backdrop = document.createElement('img');
        backdrop.className = 'music-art';
        backdrop.alt = '';
        backdrop.setAttribute('aria-hidden', 'true');
        backdrop.src = imageUrl;
        document.querySelector('.music-art')?.remove();
        document.querySelector('.music').prepend(backdrop);
    }
    const info = document.createElement('div');
    info.className = 'track-info';
    const title = document.createElement('strong');
    title.textContent = track.title;
    const artist = document.createElement('p');
    artist.textContent = track.artist;
    const time = document.createElement('time');
    if (track.nowPlaying) {
        time.textContent = 'Listening now';
    } else if (track.playedAt) {
        const date = new Date(track.playedAt);
        time.dateTime = date.toISOString();
        time.textContent =
            new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/Berlin',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date) + ' · Berlin';
    }
    info.append(title, artist, time);
    link.append(info);
    container.replaceChildren(link);
}

let musicLoading = false;
async function loadMusic() {
    if (musicLoading) return;
    musicLoading = true;
    try {
        const response = await fetch(
            'https://lastfm-last-played.biancarosa.com.br/robinmiau/latest-song',
            {
                signal: AbortSignal.timeout(15000),
            },
        );
        if (!response.ok) throw new Error('Music feed unavailable');
        const data = await response.json();
        const track = data.track;
        if (!track?.name) throw new Error('No track returned');
        const cover = track.image?.find((image) => image.size === 'extralarge');
        renderTrack({
            title: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            image: cover?.['#text'] || '',
            url: track.url,
            nowPlaying: track['@attr']?.nowplaying === 'true',
            playedAt: track.date?.uts
                ? new Date(Number(track.date.uts) * 1000).toISOString()
                : null,
        });
    } catch {
        const container = document.querySelector('#recent-track');
        if (!container.querySelector('.track')) {
            container.setAttribute('aria-busy', 'false');
            container.textContent = 'Last.fm is temporarily unavailable.';
        }
    } finally {
        musicLoading = false;
    }
}
// Load each feed once per page visit.
updateAge();
loadMusic();
loadAnime();

// Pick one companion per visit; load only its artwork and play audio on activation.
const pokemonChoices = [
    {
        name: 'Victini',
        image: new URL('../images/pokemon/victini.png', import.meta.url).href,
        sound: new URL('../audio/victini.ogg', import.meta.url).href,
    },
    {
        name: 'Mew',
        image: new URL('../images/pokemon/mew.png', import.meta.url).href,
        sound: new URL('../audio/mew.ogg', import.meta.url).href,
    },
    {
        name: 'Celebi',
        image: new URL('../images/pokemon/celebi.png', import.meta.url).href,
        sound: new URL('../audio/celebi.ogg', import.meta.url).href,
    },
    {
        name: 'Eevee',
        image: new URL('../images/pokemon/eevee.png', import.meta.url).href,
        sound: new URL('../audio/eevee.ogg', import.meta.url).href,
    },
    {
        name: 'Sprigatito',
        image: new URL('../images/pokemon/sprigatito.png', import.meta.url).href,
        sound: new URL('../audio/sprigatito.ogg', import.meta.url).href,
    },
    {
        name: 'Pikachu',
        image: new URL('../images/pokemon/pikachu.png', import.meta.url).href,
        sound: new URL('../audio/pikachu.ogg', import.meta.url).href,
    },
    {
        name: 'Jigglypuff',
        image: new URL('../images/pokemon/jigglypuff.png', import.meta.url).href,
        sound: new URL('../audio/jigglypuff.ogg', import.meta.url).href,
    },
];
const companion = pokemonChoices[Math.floor(Math.random() * pokemonChoices.length)];
const pokemonButton = document.createElement('button');
pokemonButton.type = 'button';
pokemonButton.className = 'pokemon';
pokemonButton.setAttribute('aria-label', 'Play ' + companion.name + "'s cry");
const pokemonImage = new Image(80, 80);
pokemonImage.alt = '';
pokemonImage.decoding = 'async';
pokemonImage.addEventListener(
    'load',
    () => {
        pokemonButton.append(pokemonImage);
        document.querySelector('#pokemon-slot').replaceChildren(pokemonButton);
    },
    { once: true },
);
pokemonImage.src = companion.image;
const pokemonCry = new Audio();
pokemonCry.preload = 'none';
pokemonCry.src = companion.sound;
pokemonCry.volume = 0.55;
pokemonButton.addEventListener('click', () => {
    pokemonCry.pause();
    pokemonCry.currentTime = 0;
    pokemonCry.play().catch(() => notify('This Pokémon could not be played.'));
});
