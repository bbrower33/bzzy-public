# Bzzy Public Landing Page 

Standalone static landing page for [bzzy.app](https://bzzy.app).

The site has no build step or application dependency. It consists of:

- `index.html`
- `styles.css`
- `config.js`
- Local assets and fonts under `assets/`

## Venmo support link

Set `venmoUrl` in `config.js` to a full HTTPS Venmo profile URL. The support
section stays hidden when the value is blank, malformed, or does not point to
`venmo.com`.

## Local preview

```powershell
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Deployment

Serve the repository root as a static site. The email notification form uses
FormSubmit and forwards signups to `hello@bzzy.app`. The first submission must
be confirmed from that inbox before subsequent submissions are delivered.
