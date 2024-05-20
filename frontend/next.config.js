/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      formats: ["image/avif", "image/webp"],
      domains: ["mastererpstorage.blob.core.windows.net"],
      remotePatterns: [
     
          {
            protocol: "https",
            hostname: "mastererpstorage.blob.core.windows.net",
            port: "",
            pathname: "/images/**",
          },
      ],
    },

    
}

module.exports = nextConfig
