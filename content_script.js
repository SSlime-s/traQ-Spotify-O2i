const regex = /^https?:\/\/open\.spotify\.com\/(?<type>[^/]+)\/(?<id>[^/?]+)/
const main = () => {
  const spotify_ogps = document.querySelectorAll("[class^=_body]>div>[class^=_messageContents]>[class^=_container] [href^='https://open.spotify.com']:not([href^='https://open.spotify.com/user'], [href^='https://open.spotify.com/blend'])")
  spotify_ogps.forEach(element => {
    const spotify_url = element.getAttribute('href')
    const match = spotify_url.match(regex)
    if (!match) return

    const {
      type, id
    } = match.groups
    const height = ['show', 'episode'].includes(type) ? 152 : 80
    const embed = `https://open.spotify.com/embed/${type}/${id}`

    const template = document.createElement('template')
    template.innerHTML = `<iframe src="${embed}" width="100%" height="${height}" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
    if (height === 80) element.parentElement.style = 'height: 80px;'
    element.replaceWith(template.content.firstChild)
  })
}
setInterval(main, 1000)
