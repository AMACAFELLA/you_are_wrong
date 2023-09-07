/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
        responseLimit: '50mb',
    },
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ["mongoose"],
      },
    images: {
        remotePatterns: [
            {
            protocol: "https",
            hostname: "img.clerk.com",
            },
            {
            protocol: "https",
            hostname: "images.clerk.dev",
            },
            {
            protocol: "https",
            hostname: "uploadthing.com",
            },
            {
                protocol:"https",
                hostname:"utfs.io"
            },
            {
            protocol: "https",
            hostname: "placehold.co",
            },
        ],
    },
}

module.exports = nextConfig
