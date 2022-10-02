/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ssd.snabbfot.org/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: 'out',
  changefreq: false,
  priority: false,
  robotsTxtOptions: { policies: [{ userAgent: '*', allow: '/', disallow: '/_next/' }] }
}