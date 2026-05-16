import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayload({ config })
 
    // fetch dynamic routes
    const [ categories, projects, services ] = await Promise.all([
        payload.find({ collection: 'categories', limit: 0 }),
        payload.find({ collection: 'projects', limit: 0 }),
        payload.find({ collection: 'services', limit: 0 }),
    ])

    // static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: 'https://pedroamartins.pt', lastModified: new Date() },
        { url: 'https://pedroamartins.pt/about', lastModified: new Date() },
        { url: 'https://pedroamartins.pt/contact', lastModified: new Date() },
        { url: 'https://pedroamartins.pt/privacy', lastModified: new Date() },
    ]

    // dynamic categories pages
    const categoryPages: MetadataRoute.Sitemap = categories.docs.map((category) => ({
        url: `https://pedroamartins.pt/portfolio/${category.slug}`,
        lastModified: new Date(category.updatedAt),
    }))

    const projectPages: MetadataRoute.Sitemap = projects.docs.map((project) => ({
        url: `https://pedroamartins.pt/portfolio/${typeof project.category === 'object' && project.category.slug}/${project.slug}`,
        lastModified: new Date(project.updatedAt),
    }))

    const servicePages: MetadataRoute.Sitemap = services.docs.map((service) => ({
        url: `https://pedroamartins.pt/services/${service.slug}`,
        lastModified: new Date(service.updatedAt),
    }))

    return [...staticPages, ...categoryPages, ...projectPages, ...servicePages]
}