/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.googleusercontent.com",
          port: "",
          pathname: "**",
        },
          {
          protocol: "https",
          hostname: "*.mastererpstorage.blob.core.windows.net",
          port: "",
          pathname: "**",
        },
      ],
    },

    
}

module.exports = nextConfig
