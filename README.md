# Emoji Cursor Plugin for Tailwind CSS
![Tests](https://github.com/neotan/tailwind-plugin-cursor-emoji/workflows/Publish%20to%20NPM/badge.svg)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1e75191e4b1444c59be79054984c5d78)](https://www.codacy.com/gh/neotan/tailwind-plugin-cursor-emoji/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=neotan/tailwind-plugin-cursor-emoji&amp;utm_campaign=Badge_Grade)
![npm](https://img.shields.io/npm/dt/tailwind-plugin-cursor-emoji)


<img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/banner.png" alt="banner" />

Adds emoji to cursor for tailwind.

## Installation

```bash
npm install --save-dev tailwind-plugin-cursor-emoji
```

### Tailwind CSS v4

Add it with the `@plugin` directive in your CSS file.

```css
/* app.css */
@import "tailwindcss";
@plugin "tailwind-plugin-cursor-emoji";
```

### Tailwind CSS v3

Add it to the plugins array of `tailwind.config.js`.

```js
// tailwind.config.js

plugins: [
    // ...
    require('tailwind-plugin-cursor-emoji'),
],
```

## Usage

Use the arbitrary value syntax with any emoji. Parameters are separated by `/`:

```
cursor-emoji-[<EMOJI>/<SIZE>/<COLOR>/<OPACITY>]
```

- **EMOJI** — Any emoji (required)
- **SIZE** — Tailwind font size (e.g. `lg`, `4xl`, `5xl`) or a number in px (e.g. `40`)
- **COLOR** — Tailwind color (e.g. `gray-900`), hex (`#e76215`), `rgb()`, or `hsl()`
- **OPACITY** — 0–100 (default: `100`)

```jsx
<div className="cursor-emoji-[🤪/5xl/gray-900/90]">
    content
</div>
```

## Examples

|Class|Cursor|
|---|---|
|`cursor-emoji-[😜/lg]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_lg].svg"/>|
|`cursor-emoji-[😜]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O].svg"/>|
|`cursor-emoji-[😜/40]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_40].svg"/>|
|`cursor-emoji-[😜/4xl/red]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_red].svg"/>|
|`cursor-emoji-[😜/4xl/green-500]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_green-500].svg"/>|
|`cursor-emoji-[😜/4xl/#e76215]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_e76215].svg"/>|
|`cursor-emoji-[😜/4xl/rgb(231,98,21)]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_rgb(231,98,21)].svg"/>|
|`cursor-emoji-[😜/4xl/hsl(22deg,84%,49%)]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_hsl(22deg,84,49)].svg"/>|
|`cursor-emoji-[😜/4xl/blue-500/70]` | <img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/cursor-emoji-[O_4xl_blue-500_70].svg"/>|

## License

This project is licensed under the [MIT License](/LICENSE).