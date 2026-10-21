# dylanyuma.com

Source for my personal site and posts at [dylanyuma.com](https://dylanyuma.com), built with [Quarto](https://quarto.org).

## Layout

| Path | What it is |
|---|---|
| `index.md` | Home page and bio |
| `posts.md` | Posts listing |
| `posts/<slug>/index.md` | One folder per published post, with its images alongside |
| `_drafts/` | Unpublished posts. Gitignored, so it stays on this machine, and Quarto skips `_` folders so it never renders |
| `_headers`, `.assetsignore` | Response headers and files excluded from the Cloudflare Worker's assets |
| `_quarto.yml` | Site config, navbar and theme |
| `styles.css` | Custom styles |

## Writing a post

Start drafts in `_drafts/<slug>/index.md`. The repo is public, so draft sources committed under `posts/` are readable on GitHub even though the site hides them. Move the folder into `posts/` when it's ready. Front matter looks like:

```yaml
---
title: "Post title"
description: "One line for the listing page"
image: cover.jpg
author:
  - name: Dylan Dodds
    url: https://dylanyuma.com
date: 2026-10-19
categories: [homelab]
draft: true
---
```

Set `draft: false` and the date to the publish day when it's ready. Add `pinned: true` to put a post at the top of the Posts page. Strip photo metadata before committing: `exiftool -all= -overwrite_original posts/<slug>/*.jpg`.

## Previewing locally

```sh
quarto preview
```

## Deploying

Pushing to `main` runs `.github/workflows/publish.yml`, which renders the site and pushes the HTML to the `gh-pages` branch. A Cloudflare Worker serves `gh-pages` at dylanyuma.com. Keep the root `CNAME` file: it makes the old GitHub Pages address redirect to dylanyuma.com. To force a redeploy without a content change:

```sh
git commit --allow-empty -m "Trigger redeploy" && git push
```

## Resume

The resume is deliberately not on the site. The deploy fails if any published PDF looks like it contains a phone number.

## License

Posts and images are CC BY 4.0; code is MIT. See [LICENSE.md](LICENSE.md).
