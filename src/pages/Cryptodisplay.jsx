import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ResponsiveLine } from "@nivo/line"
import axios from 'axios'
import Spin from "../spinner/Spin"

export default function Cryptodisplay() {
    const [cryptocurrencies, setCryptocurrencies] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                        sparkline: true,
                    },
                    headers: {
                        'X-CoinAPI-Key': 'CG-F9T6G8rR3oqHaUzD3ayNxiSH'
                    }
                })
                const data = response.data.map(crypto => ({
                    id: crypto.id,
                    name: crypto.name,
                    price: crypto.current_price,
                    trend: crypto.sparkline_in_7d.price
                }))
                setCryptocurrencies(data)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        fetchCryptoData()
    }, [])

    if (loading) return <div><Spin /></div>
    if (error) return <div>Error: {error}</div>

    const filteredCryptos = cryptocurrencies.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col min-h-screen bg-custombg text-customtext">
            <header className="bg-primary text-primary-foreground py-4 px-6">
                <div className="container mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2" prefetch={false}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.763 9.51a2.25 2.25 0 0 1 3.828-1.351.75.75 0 0 0 1.06-1.06 3.75 3.75 0 0 0-6.38 2.252c-.033.307 0 .595.032.822l.154 1.077H8.25a.75.75 0 0 0 0 1.5h.421l.138.964a3.75 3.75 0 0 1-.358 2.208l-.122.242a.75.75 0 0 0 .908 1.047l1.539-.512a1.5 1.5 0 0 1 .948 0l.655.218a3 3 0 0 0 2.29-.163l.666-.333a.75.75 0 1 0-.67-1.342l-.667.333a1.5 1.5 0 0 1-1.145.082l-.654-.218a3 3 0 0 0-1.898 0l-.06.02a5.25 5.25 0 0 0 .053-1.794l-.108-.752H12a.75.75 0 0 0 0-1.5H9.972l-.184-1.29a1.863 1.863 0 0 1-.025-.45Z" clipRule="evenodd" className="w-10 h-10" />
                        </svg>

                        <span className="text-lg font-bold pr-2">Crypto Hub</span>
                    </Link>
                    <div className="relative w-full max-w-md">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search cryptocurrencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-black py-[0.5rem] px-[2.5rem] rounded-lg bg-primary-foreground text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            </header>
            <main className="flex-1 bg-muted py-6">
                <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCryptos.map(crypto => (
                        <div key={crypto.id} className="bg-white text-black rounded-lg shadow-md border-customtext">
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{crypto.name}</h3>
                                    <span className="text-lg font-bold text-primary">${crypto.price.toFixed(2)}</span>
                                </div>
                                <LineChart data={crypto.trend} className="w-full aspect-[4/1]" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="bg-primary text-primary-foreground py-4 px-6">
                <div className="container mx-auto text-center text-sm">&copy; 2024 Crypto Hub. All rights reserved.</div>
            </footer>
        </div>
    )
}

function LineChart({ data }) {
    return (
        <div style={{ height: 200 }}>
            <ResponsiveLine
                data={[
                    {
                        id: "trend",
                        data: data.map((y, x) => ({ x, y }))
                    }
                ]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 'auto', max: 'auto' }}
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 0, tickPadding: 16 }}
                axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
                colors={["#2563eb"]}
                pointSize={6}
                useMesh={true}
                gridYValues={6}
                theme={{
                    tooltip: {
                        chip: { borderRadius: "9999px" },
                        container: { fontSize: "12px", textTransform: "capitalize", borderRadius: "6px" },
                    },
                    grid: { line: { stroke: "#f3f4f6" } },
                }}
                role="application"
            />
        </div>
    )
}

function MountainIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}

function SearchIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
