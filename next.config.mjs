/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        supabaseUrl:process.env.SUBABASE_URL,
    }
};

export default nextConfig;
