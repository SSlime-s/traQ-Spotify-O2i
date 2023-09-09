const regex =
  /^https?:\/\/open\.spotify\.com\/(?:.*\/)?(?<type>[^/]+)\/(?<id>[^/?]+)/;

const SPOTIFY_OGP_URL = "https://open.spotify.com";
const SPOTIFY_OGP_URL_DENY = ["/user/", "/blend/"];
const SPOTIFY_OGP_URL_DENY_SELECTOR = SPOTIFY_OGP_URL_DENY.map(
  (url) => `[href*="${SPOTIFY_OGP_URL}${url}"]`
).join(", ");
const SPOTIFY_OGP_URL_SELECTOR = `[class^=_body]>div>[class^=_messageContents]>[class^=_container] [href^="${SPOTIFY_OGP_URL}"]:not(${SPOTIFY_OGP_URL_DENY_SELECTOR})`;

const main = () => {
  const spotify_ogps = document.querySelectorAll(SPOTIFY_OGP_URL_SELECTOR);

  spotify_ogps.forEach((element) => {
    const spotify_url = element.getAttribute("href");
    const match = spotify_url.match(regex);
    if (!match) return;

    const { type, id } = match.groups;
    const height = ["show", "episode"].includes(type) ? 152 : 80;
    const embed = `https://open.spotify.com/embed/${type}/${id}`;

    const template = document.createElement("template");
    template.innerHTML = `<iframe src="${embed}" width="100%" height="${height}" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    if (height === 80) element.parentElement.style = "height: 80px;";
    element.replaceWith(template.content.firstChild);
  });
};
setInterval(main, 1000);
