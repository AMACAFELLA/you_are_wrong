const path = require("path");

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
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
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
                protocol: "https",
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.alias["@"] = path.resolve(__dirname);
        config.resolve.alias["components"] = path.resolve(__dirname, "./components"); // Adjust the path as per your project structure
        config.resolve.alias["lib"] = path.resolve(__dirname, "./lib"); // Adjust the path as per your project structure
        return config;
    },
};

module.exports = nextConfig;
