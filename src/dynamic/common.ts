const proxy = location.host.match(/localhost(:|$)/)
    ? "http://localhost:3030"
    : "https://pulse.boraini.com:3030";
export const proxied = (href) =>
    proxy ? proxy + "/?href=" + encodeURIComponent(href) : href;
export const playerApi = "http://v2202410239072292297.goodsrv.de:5001";
