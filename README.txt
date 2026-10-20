ARise Linux website
1) Put your logo at assets/arise-logo.png
2) Put the ISO at downloads/ARise-Linux.iso  (or set isoUrl in js/main.js to an external link)
3) Edit CONFIG at the top of js/main.js (version, size, sha256)
4) Test locally:  npx serve .
GitHub / Vercel reject files over ~100 MB: host the ISO on GitHub Releases, SourceForge, Archive.org or Cloudflare R2 and paste the direct link into isoUrl.
