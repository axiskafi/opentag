/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname: "localhost",
                protocol: "http"
            }
        ]
    }
    // reactStrictMode: true,
    // images: {
    //     domains: ['localhost'], // Add your allowed domains here
    // },
};

export default nextConfig;
