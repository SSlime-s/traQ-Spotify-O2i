const regex =
  /^https?:\/\/open\.spotify\.com\/(?:.*\/)?(?<type>[^/]+)\/(?<id>[^/?]+)/;

const SPOTIFY_OGP_URL = "https://open.spotify.com";
const SPOTIFY_OGP_URL_DENY = ["/user/", "/blend/"];
const SPOTIFY_OGP_URL_DENY_SELECTOR = SPOTIFY_OGP_URL_DENY.map(
  (url) => `[href*="${SPOTIFY_OGP_URL}${url}"]`
).join(", ");
const SPOTIFY_OGP_URL_SELECTOR = `[class^=_body]>div>[class^=_messageContents]>[class^=_container] [href^="${SPOTIFY_OGP_URL}"]:not(${SPOTIFY_OGP_URL_DENY_SELECTOR})`;

/**
 * 配列の重複を削除する
 * Set を使っているので、多分 array の順序が保たれる
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/values
 *
 * @template T
 * @param {readonly T[]} array
 * @returns {T[]}
 */
const unique = (array) => {
  const set = new Set(array);
  return [...set];
};

/**
 * 子孫の OGP URL を置換する
 *
 * @param {HTMLElement} target
 */
const replace_ogp_url = (target) => {
  const spotify_ogps = target.querySelectorAll(SPOTIFY_OGP_URL_SELECTOR);

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

/**
 * MutationObserver のコールバック
 * DOM の追加を監視して OGP URL を置換する
 * @see https://developer.mozilla.org/ja/docs/Web/API/MutationObserver
 *
 * @param {readonly MutationRecord[]} mutationsList
 * @param {MutationObserver} observer
 */
const callback = (mutationsList, observer) => {
  /**
   * @type {HTMLElement[]}
   */
  const unique_target = unique(
    mutationsList
      .filter((m) => m.type === "childList")
      .filter((m) => m.addedNodes.length > 0)
      .flatMap((m) => Array.from(m.addedNodes))
      .filter((t) => t instanceof HTMLElement)
  );

  unique_target.forEach(replace_ogp_url);
};

const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });

replace_ogp_url(document.body);
