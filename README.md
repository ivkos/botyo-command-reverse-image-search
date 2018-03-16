# Reverse Image Search Command for Botyo
[![npm](https://img.shields.io/npm/v/botyo-command-reverse-image-search.svg)](https://www.npmjs.com/package/botyo-command-reverse-image-search)
[![npm](https://img.shields.io/npm/dt/botyo-command-reverse-image-search.svg)](https://www.npmjs.com/package/botyo-command-reverse-image-search)
[![npm](https://img.shields.io/npm/l/botyo-command-reverse-image-search.svg)]()

The **Reverse Image Search Command for [Botyo](https://github.com/ivkos/botyo)** runs a reverse image search on the last uploaded picture and posts links to the results on Google Images, Bing Images, and TinEye.

## Usage
`#reverse`

## Install
**Step 1.** Install the module from npm.

`npm install --save botyo-command-reverse-image-search`

**Step 2.** Register the module.
```typescript
import Botyo from "botyo";
import ReverseImageSearchCommand from "botyo-command-reverse-image-search"

Botyo.builder()
    ...
    .registerModule(ReverseImageSearchCommand)
    ...
    .build()
    .start();
```

## Configuration & URL Shortening
The **Reverse Image Search Command** has some sensible defaults and need not be explicitly configured. However, the module supports URL shortening using *goo.gl*. If you want to use this feature, you need to [obtain an API key](https://developers.google.com/url-shortener/v1/getting_started?csw=1#APIKey) and configure it in your configuration file `config.yaml`:
```yaml
modules:
  ReverseImageSearchCommand:
    recentMessagesCount: 20          # how many recent messages to search for photos (default: 20)
    shortenUrls: false               # should it shorten result URLs (default: false)
    googlApiKey: YOUR_GOOGL_API_KEY  # goo.gl API key (optional if shortenUrls is false, otherwise required)
```
