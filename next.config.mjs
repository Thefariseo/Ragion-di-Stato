/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Il gioco è interamente client-side: nessuna regola di build particolare.
  // ESLint non è richiesto per il prototipo (la UI legge testo dai data file,
  // non da literal JSX), quindi non blocchiamo la build su lint.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
