module.exports = {
    siteUrl: "https://fast-store-test.vercel.app/",
    generateRobotsTxt: true,
    exclude: ['/server-sitemap-index.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://fast-store-test.vercel.app/server-sitemap-index.xml'
        ]
    }
}