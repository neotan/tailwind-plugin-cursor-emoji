# Emoji Cursor Plugin for Tailwind CSS
![Tests](https://github.com/neotan/tailwind-plugin-cursor-emoji/workflows/Tests/badge.svg)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1e75191e4b1444c59be79054984c5d78)](https://www.codacy.com/gh/neotan/tailwind-plugin-cursor-emoji/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=neotan/tailwind-plugin-cursor-emoji&amp;utm_campaign=Badge_Grade)
![npm](https://img.shields.io/npm/dt/tailwind-plugin-cursor-emoji)


<img src="https://raw.githubusercontent.com/neotan/tailwind-plugin-cursor-emoji/master/images/banner.png" alt="banner" />

Adds emoji to cursor for tailwind.

## Installation

```bash
yarn add -D tailwind-plugin-cursor-emoji
```
or
```bash
npm install --save-dev tailwind-plugin-cursor-emoji
```

Add it to the plugins array of `tailwind.config.js`.

```js
// tailwind.config.js

plugins: [
    // ...
    require('tailwind-plugin-cursor-emoji'),
],
```

## Usage

Use these classes like ordinary tailwind classes, and differentiate them with various parameter combinations. The basic syntax is:

```jsx
<div className="flex rounded cursor-emoji-[<EMOJI>/<SIZE>/<COLOR>/<OPACITY>]">
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