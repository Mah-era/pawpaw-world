# Deployment

PawPaw World is a static site. Deploy the repository root as-is; there is no
install command, build command, server function, or environment variable.

## Recommended: GitHub Pages

1. Push the repository to GitHub.
2. Open the repository's **Settings**.
3. Select **Pages** under **Code and automation**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.

For a repository named `pawpaw-world` under `Mah-era`, the expected URL is:

```text
https://mah-era.github.io/pawpaw-world/
```

The visual report will be available at:

```text
https://mah-era.github.io/pawpaw-world/report/
```

GitHub Pages is the best fit because the game is fully static, uses relative
asset paths, and requires no deployment configuration.

## Netlify

1. Import the GitHub repository in Netlify.
2. Leave the build command empty.
3. Set the publish directory to `.`.
4. Deploy.

## Cloudflare Pages

1. Connect the GitHub repository in Cloudflare Pages.
2. Choose **None** as the framework preset.
3. Leave the build command empty.
4. Set the build output directory to `.`.
5. Deploy.

## Verification

After deployment, confirm:

- The title screen loads without a console error.
- **NEW GAME** enters the city and starts audio.
- `M` opens the map and `J` opens the journal.
- Refreshing the page preserves progress in the same browser.
- `/report/` loads the visual report and its gameplay video.

The self-contained report is intentionally large because it embeds all images
and video. Use `/report/` for normal web viewing and the standalone HTML file
when a single portable artifact is required.
