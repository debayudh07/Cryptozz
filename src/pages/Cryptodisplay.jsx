import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotPopup } from "@copilotkit/react-ui"; // Import CopilotChat

export default function Cryptodisplay() {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatVisible, setChatVisible] = useState(false); // State to toggle chatbot visibility

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
                    params: {
                        vs_currency: "usd",
                        order: "market_cap_desc",
                        per_page: 10,
                        page: 1,
                        sparkline: true,
                    },
                });
                const data = response.data.map((crypto) => ({
                    id: crypto.id,
                    name: crypto.name,
                    symbol: crypto.symbol,
                    price: crypto.current_price,
                    priceChange: crypto.price_change_percentage_24h,
                    trend: crypto.sparkline_in_7d.price,
                }));
                setCryptocurrencies(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCryptoData();
    }, []);

    const filteredCryptos = cryptocurrencies.filter(
        (crypto) =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="sticky top-0 z-10 bg-white shadow-md">
                <div className="container mx-auto py-4 px-6">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <CoinIcon className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-blue-600">Crypto Hub</span>
                        </Link>
                        <div className="relative w-full max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search cryptocurrencies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 py-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Top Cryptocurrencies</h1>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-[200px] bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {filteredCryptos.map((crypto) => (
                                    <motion.div
                                        key={crypto.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h2 className="text-xl font-semibold text-gray-800">
                                                        {crypto.name} <span className="text-sm text-gray-500">({crypto.symbol.toUpperCase()})</span>
                                                    </h2>
                                                    <span className={`text-lg font-medium ${crypto.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {crypto.priceChange >= 0 ? (
                                                            <TrendingUpIcon className="inline mr-1" />
                                                        ) : (
                                                            <TrendingDownIcon className="inline mr-1" />
                                                        )}
                                                        {Math.abs(crypto.priceChange).toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className="text-3xl font-bold text-gray-900 mb-4">${crypto.price.toFixed(2)}</div>
                                                <LineChart data={crypto.trend} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                    {/* Toggle Button for Chat */}
                 
                    {/* Copilot Chat */}
                    
                        <div className="fixed bottom-0 right-0 w-full max-w-sm p-4">
                            <CopilotPopup
                                labels={{
                                    title: "Crypto Assistant",
                                    initial: "Hello! Ask me anything about cryptocurrencies.",
                                }}
                            />
                        </div>
                
                </div>
            </main>
            <footer className="bg-white border-t border-gray-200 py-4 px-6">
                <div className="container mx-auto text-center text-sm text-gray-600">&copy; 2024 Crypto Hub. All rights reserved.</div>
            </footer>
        </div>
    );
}
function LineChart({ data }) {
    return (
        <div style={{ height: 200 }}>
            <ResponsiveLine
                data={[
                    {
                        id: "trend",
                        data: data.map((y, x) => ({ x, y })),
                    },
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 0, tickPadding: 16 }}
                axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
                colors={["#3b82f6"]}
                pointSize={0}
                useMesh={true}
                gridYValues={6}
                curve="monotoneX"
                animate={true}
                motionConfig="gentle"
                theme={{
                    tooltip: {
                        chip: { borderRadius: "9999px" },
                        container: { fontSize: "12px", textTransform: "capitalize", borderRadius: "6px" },
                    },
                    grid: { line: { stroke: "#e2e8f0" } },
                }}
                role="application"
            />
        </div>
    );
}

function CoinIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1" />
            <path d="M12 6v2m0 8v2" />
        </svg>
    );
}

function SearchIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function TrendingUpIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

function TrendingDownIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
        </svg>
    );
}
