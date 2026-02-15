/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://digitalbusinessassets.co.uk",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  sitemapBaseFileName: "sitemap-0",
  exclude: ["/api/*", "/admin/*", "/app/*"],
  sitemapSize: 7000,
};
