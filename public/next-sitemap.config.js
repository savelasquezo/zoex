const SITE_URL = process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:8000';
 
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true
}
 
