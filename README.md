# RobinMiau

Personal website built with Vite and vanilla HTML, CSS and JavaScript.

## Development

Use Node.js 26.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

GitHub Pages deploys the `dist` directory. The custom domain is configured in `public/CNAME`.

## Files

- `index.html` — page markup
- `assets/css/styles.css` — styles and responsive layout
- `assets/js/scripts.js` — feeds, random characters, Pokémon sounds and clipboard
- `assets/images/` — character and project images; Pokémon in `pokemon/`
- `assets/audio/` — Pokémon cries
- `assets/fonts/` — Nunito, Fredoka and their OFL licenses

Music loads from [Last.fm Last Played](https://github.com/biancarosa/lastfm-last-played); the watching list loads through [Jikan Edge](https://jikan.lucashdo.com/docs). Both are fetched in the browser once per visit. Jikan Edge caches lists for up to two hours.

## Credits

- Pokémon artwork: [PokeAPI Sprites](https://github.com/PokeAPI/sprites)
- Pokémon cries: [PokeAPI Cries](https://github.com/PokeAPI/cries)
- Avatar: [GitHub](https://github.com/robinmiau.png)
- Project icons: Panfu.me, FNFestival.co and ElectronFriends
- Character artwork: [Michiru](https://bna-anime.com/) ([original PNG](https://bna-anime.com/images/mv2.png)), [Nazuna Hiwatashi](https://bna-anime.com/character/03.php) ([original PNG](https://bna-anime.com/images/c4d.png)), [Nagatoro](https://www.nagatorosan.jp/1st/character/), [Marin](https://bisquedoll-anime.com/1st/character/), [Emilia](https://re-zero-anime.jp/tv/character/), [KAngel](https://needygirl-anime.com/character/kangel.html), [Miku](https://piapro.net/pages/character/), [Zero Two](https://i.pinimg.com/originals/09/9a/2a/099a2ab1edc51cf23acaca06374327d2.png), Mai Sakurajima
- Fonts: [Nunito](https://fonts.google.com/specimen/Nunito) and [Fredoka](https://fonts.google.com/specimen/Fredoka), hosted locally

Format with Prettier using `.prettierrc.json`.
