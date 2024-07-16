module.exports = {
    siteUrl: "https://ifaststore.it/",
    generateRobotsTxt: true,
    exclude: ['/server-sitemap-index.xml'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/']
            }
        ],
        additionalSitemaps: [
            'https://ifaststore.it/sitemap.xml'
        ]
    },
    transform: async (config, url) => {
        // Adicione URLs específicas ao sitemap
        const additionalUrls = [
            '/products',
            '/products/category/iphone',
            '/products/category/airpods',
            '/products/category/notebooks'
        ];

        if (additionalUrls.some(path => url.includes(path))) {
            return {
                loc: url,
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: 0.7
            };
        }

        return {
            loc: url,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 0.5
        };
    }
}
