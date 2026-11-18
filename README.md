# Alexander Sanabria — Portfolio

A static portfolio for GitHub Pages. Open `index.html` locally to browse it, or publish this repository from the root of the `main` branch in GitHub Pages settings. The site uses relative paths, so it works at both a custom domain and a repository URL such as `https://alexandersanabria.github.io/about/`.

Live site: https://alexandersanabria.github.io/about/

## Files

- `index.html`, `styles.css`, and `script.js` make up the site. No build step or package install is required.
- `projects/` contains crawlable project detail pages. Run `node tools/generate-project-pages.cjs` after editing project details in `script.js` to refresh these pages and `sitemap.xml`.
- `images/` contains optimized JPGs used by the site.
- `assets/` preserves the supplied PNG source images in the local workspace. These large originals are excluded from Git; `images/` contains everything the published site needs.
- `.nojekyll` makes GitHub Pages serve the files directly.

## Publishing

1. Push the files to the repository's `main` branch.
2. In **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/(root)`.
3. Open the URL shown by GitHub Pages after deployment.

The project videos are external YouTube links. The FSX Play video is labeled as third-party footage. There is no direct image for Go Simulator, so its card uses a designed text cover.

## Content notes

The display name, background, skills, roles, education, and project contributions come from Alexander's supplied profile details. Welcome to Ibahell is included using only the provided images and video; its role and technical contribution can be added later. Upwork performance statistics were excluded because they can change.
