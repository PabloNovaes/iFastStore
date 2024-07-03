module.exports = {
    siteUrl: "https://ifaststore.it/",
    generateRobotsTxt: true,
    exclude: ['/server-sitemap-index.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
          'https://ifaststore.it/sitemap.xml'  
        ]
    }
}
