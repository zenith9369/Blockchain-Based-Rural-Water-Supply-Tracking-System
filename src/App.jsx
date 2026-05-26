import React, { useState, useEffect, useCallback } from 'react';

// --- ICONS (as SVG components) ---
const WaterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path></svg>;
const SunIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const CloudRainIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>;
const FarmIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0h-2a7 7 0 0 1-7 7Z"></path><path d="M12 13V3"></path></svg>;
const FactoryIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path></svg>;
const TokenIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 2-7 7 7 7 7-7Z"></path><path d="m19 9-7 7-7-7"></path></svg>;
const InfoIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const SparklesIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" /><path d="M6 18L7 15L10 14L7 13L6 10L5 13L2 14L5 15L6 18Z" /><path d="M18 6L17 9L14 10L17 11L18 14L19 11L22 10L19 9L18 6Z" /></svg>;


// --- INITIAL STATE & CONFIG ---
const INITIAL_PARTICIPANTS = [
    { id: 1, name: 'Green Valley Farms', type: 'Farm', soilMoisture: 65, wtrBalance: 1000, color: 'green' },
    { id: 2, name: 'Sunrise Orchards', type: 'Farm', soilMoisture: 75, wtrBalance: 1000, color: 'emerald' },
    { id: 3, name: 'Kattankulathur Textiles', type: 'Industry', demand: 80, wtrBalance: 1500, color: 'sky' },
];
const BASE_ALLOCATION_PER_PARTICIPANT = 250; // Base $WTR allocated per day
const RESERVOIR_CAPACITY = 1000000;

// --- UI COMPONENTS ---

const ProgressBar = ({ value, color, label }) => {
    const bgColor = `bg-${color}-200`;
    const fillColor = `bg-${color}-500`;
    return (
        <div>
            {label && <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>}
            <div className={`w-full ${bgColor} rounded-full h-2.5`}>
                <div className={`${fillColor} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
};

const ParticipantCard = ({ participant }) => {
    const { name, type, soilMoisture, wtrBalance, color, demand } = participant;
    const isFarm = type === 'Farm';
    const moistureColor = soilMoisture < 30 ? 'red' : soilMoisture < 60 ? 'yellow' : 'green';

    return (
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div>
                <div className="flex items-center mb-3">
                    {isFarm ? <FarmIcon className={`h-8 w-8 text-${color}-600`} /> : <FactoryIcon className={`h-8 w-8 text-${color}-600}`} />}
                    <div className="ml-3">
                        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                        <p className="text-sm text-gray-500">{type}</p>
                    </div>
                </div>
                {isFarm ? (
                    <div>
                        <ProgressBar value={soilMoisture} color={moistureColor} label="Soil Moisture" />
                        <p className="text-center text-2xl font-bold text-gray-700 mt-2">{soilMoisture}%</p>
                    </div>
                ) : (
                    <div>
                         <ProgressBar value={demand} color={color} label="Operational Demand" />
                         <p className="text-center text-2xl font-bold text-gray-700 mt-2">{demand}%</p>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center text-center">
                    <TokenIcon className="h-6 w-6 text-blue-500 mr-2"/>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{Math.round(wtrBalance).toLocaleString()}</p>
                        <p className="text-xs font-medium text-gray-500">$WTR BALANCE</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReservoirStatus = ({ level, capacity }) => {
    const percentage = (level / capacity) * 100;
    const statusColor = percentage < 30 ? 'red' : percentage < 60 ? 'yellow' : 'blue';
    
    return (
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4">
             <h3 className="text-lg font-bold text-gray-800 mb-2">Kattankulathur Reservoir Status</h3>
             <ProgressBar value={percentage} color={statusColor} />
             <div className="flex justify-between items-end mt-2">
                <p className={`text-3xl font-bold text-${statusColor}-600`}>{percentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 font-mono">{Math.round(level).toLocaleString()} / {capacity.toLocaleString()} L</p>
             </div>
        </div>
    );
};

const EventLog = ({ log }) => (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 h-96 overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-3 sticky top-0 bg-white/60 backdrop-blur-md py-2">System Ledger</h3>
        <ul className="space-y-2">
            {log.slice().reverse().map((entry, index) => (
                <li key={index} className="flex items-start text-sm p-2 rounded-lg hover:bg-gray-100">
                    {entry.icon}
                    <span className="ml-3 text-gray-700">{entry.message}</span>
                </li>
            ))}
        </ul>
    </div>
);

const MarketPlace = ({ onTrade }) => {
    const [sellerId, setSellerId] = useState('1');
    const [buyerId, setBuyerId] = useState('3');
    const [amount, setAmount] = useState('100');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sellerId === buyerId) {
            alert("Seller and buyer cannot be the same.");
            return;
        }
        onTrade(parseInt(sellerId), parseInt(buyerId), parseInt(amount));
    };

    return (
         <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">P2P Water Market</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                      <label className="text-xs font-medium text-gray-600">Seller</label>
                      <select value={sellerId} onChange={e => setSellerId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mt-1">
                          <option value="1">Green Valley Farms</option>
                          <option value="2">Sunrise Orchards</option>
                          <option value="3">Kattankulathur Textiles</option>
                      </select>
                  </div>
                   <div>
                      <label className="text-xs font-medium text-gray-600">Buyer</label>
                      <select value={buyerId} onChange={e => setBuyerId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mt-1">
                          <option value="1">Green Valley Farms</option>
                          <option value="2">Sunrise Orchards</option>
                          <option value="3">Kattankulathur Textiles</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-xs font-medium text-gray-600">Amount ($WTR)</label>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mt-1" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Execute Trade</button>
              </form>
         </div>
    );
};

const GeminiInsights = ({ insights, isLoading, onGetAnalysis }) => {
    return (
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-4 h-96 flex flex-col">
            <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" />
                    AI Grid Analysis
                </h3>
                <button 
                    onClick={onGetAnalysis} 
                    disabled={isLoading}
                    className="bg-purple-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:bg-gray-400 flex items-center"
                >
                    ✨ Get AI Analysis
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="ml-3 text-gray-600">Analyzing grid data...</p>
                    </div>
                ) : insights ? (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: insights }}></div>
                ) : (
                    <div className="text-center text-gray-500 h-full flex flex-col justify-center">
                        <p className="font-semibold">No analysis yet.</p>
                        <p className="mt-1">Click "Get AI Analysis" to have Gemini assess the grid's health and suggest actions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
    const [day, setDay] = useState(0);
    const [weather, setWeather] = useState('Normal');
    const [reservoirLevel, setReservoirLevel] = useState(RESERVOIR_CAPACITY * 0.75);
    const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
    const [log, setLog] = useState([{ message: 'DAWG system initialized.', icon: <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" /> }]);
    const [insights, setInsights] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const addLog = useCallback((message, icon) => {
        setLog(prevLog => [{ message, icon }, ...prevLog]);
    }, []);

    const handleTrade = (sellerId, buyerId, amount) => {
        const seller = participants.find(p => p.id === sellerId);
        
        if (seller.wtrBalance < amount) {
            addLog(`Trade failed: ${seller.name} has insufficient $WTR balance.`, <InfoIcon className="h-5 w-5 text-red-500 mt-0.5" />);
            return;
        }

        setParticipants(prev => prev.map(p => {
            if (p.id === sellerId) return { ...p, wtrBalance: p.wtrBalance - amount };
            if (p.id === buyerId) return { ...p, wtrBalance: p.wtrBalance + amount };
            return p;
        }));
        
        const buyer = participants.find(p => p.id === buyerId);
        addLog(`Market Trade: ${seller.name} sold ${amount} $WTR to ${buyer.name}.`, <TokenIcon className="h-5 w-5 text-purple-500 mt-0.5" />);
    };


    const runDailySimulation = useCallback(() => {
        setDay(d => d + 1);

        // 1. Update Environment based on weather
        let reservoirChange = 0;
        let weatherIcon = <SunIcon className="h-5 w-5 text-yellow-500 mt-0.5" />;

        if (weather === 'Drought') {
            reservoirChange = -RESERVOIR_CAPACITY * 0.01;
            addLog(`Weather: Drought conditions continue. High evaporation.`, weatherIcon);
        } else if (weather === 'Rainy') {
            reservoirChange = RESERVOIR_CAPACITY * 0.015;
            weatherIcon = <CloudRainIcon className="h-5 w-5 text-blue-500 mt-0.5" />;
            addLog(`Weather: Heavy rainfall. Reservoir replenishing.`, weatherIcon);
        } else {
             reservoirChange = RESERVOIR_CAPACITY * 0.001; // Normal evaporation
        }
        
        setReservoirLevel(prev => Math.max(0, Math.min(RESERVOIR_CAPACITY, prev + reservoirChange)));

        const newParticipants = participants.map(p => {
            let newSoilMoisture = p.soilMoisture;
            if (p.type === 'Farm') {
                const moistureChange = weather === 'Drought' ? -8 : weather === 'Rainy' ? 10 : -3;
                newSoilMoisture = Math.max(0, Math.min(100, p.soilMoisture + moistureChange));
            }
            return { ...p, soilMoisture: newSoilMoisture };
        });

        // 2. Smart Contract: Allocate Water Tokens ($WTR)
        const supplyFactor = Math.max(0.1, Math.min(1.5, reservoirLevel / (RESERVOIR_CAPACITY * 0.6)));

        const finalParticipants = newParticipants.map(p => {
            let needFactor = 1.0;
            if (p.type === 'Farm') {
                needFactor = 1 + (100 - p.soilMoisture) / 100; // Lower moisture = higher need
            } else { // Industry
                needFactor = p.demand / 70; // Higher demand = higher need
            }
            
            const allocation = BASE_ALLOCATION_PER_PARTICIPANT * needFactor * supplyFactor;
            addLog(`Allocation: ${p.name} receives ${Math.round(allocation)} $WTR.`, <TokenIcon className="h-5 w-5 text-green-500 mt-0.5" />);

            return { ...p, wtrBalance: p.wtrBalance + allocation };
        });

        setParticipants(finalParticipants);

    }, [participants, weather, reservoirLevel, addLog]);

    const handleGetAnalysis = async () => {
        setIsAnalyzing(true);
        setInsights('');

        const systemPrompt = `You are an expert hydrologist and environmental systems analyst for the Kattankulathur, Tamil Nadu region. Your task is to analyze the provided real-time data from a decentralized water grid. Provide a concise, actionable report.

        **Instructions:**
        1.  **Start with a "Grid Health" summary:** (e.g., Stable, Stressed, Critical).
        2.  **Identify Anomalies/Risks:** Point out any immediate problems (e.g., a specific farm with critically low moisture, rapidly depleting reservoir, potential for conflict over resources).
        3.  **Suggest Strategic Actions:** Recommend specific, actionable steps. This could include advising a particular participant to buy or sell WTR tokens, suggesting a policy change for the grid operator, or warning about future weather impacts.
        4.  **Format your response using simple HTML bold tags for headings (<b></b>) and bullet points (<ul><li>...</li></ul>). Do not use markdown.**`;

        const userQuery = `
        **Grid State Analysis Request - Day ${day}**

        **Current Conditions:**
        - Weather Forecast: ${weather}
        - Kattankulathur Reservoir Level: ${(reservoirLevel / RESERVOIR_CAPACITY * 100).toFixed(1)}% full (${Math.round(reservoirLevel).toLocaleString()} L)

        **Participant Data:**
        ${participants.map(p => `
        - **${p.name} (${p.type}):**
          - $WTR Balance: ${Math.round(p.wtrBalance)}
          ${p.type === 'Farm' ? `- Soil Moisture: ${p.soilMoisture}%` : `- Operational Demand: ${p.demand}%`}
        `).join('')}

        Please provide your analysis.
        `;
        
        const apiKey = "AIzaSyBK-J7tPRHn8rYo2L5NwAh_NdaIZgUVGuc"; // Canvas will provide this
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                setInsights(candidate.content.parts[0].text);
            } else {
                setInsights('<b>Analysis Error:</b> Could not retrieve insights from the model.');
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setInsights('<b>Connection Error:</b> Failed to connect to the AI analysis service. Please check the console for details.');
        } finally {
            setIsAnalyzing(false);
        }
    };


    return (
        <main className="min-h-screen w-full bg-gray-100 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:16px_16px] font-sans p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-800">Decentralized Autonomous Water Grid</h1>
                    <p className="mt-2 text-lg text-gray-600">An automated water allocation system powered by smart contracts and real-time data.</p>
                     <p className="mt-2 text-sm text-gray-500 font-mono">Current Time: Saturday, 4 Oct 2025, 9:07 PM IST | Day: {day}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-md">
                    <div className="lg:col-span-1 font-bold text-lg text-gray-700">Grid Controls:</div>
                     <button onClick={runDailySimulation} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">Simulate Next Day</button>
                    <button onClick={() => setWeather('Drought')} className={`w-full font-bold py-3 px-4 rounded-lg transition-colors shadow-md ${weather === 'Drought' ? 'bg-orange-500 text-white' : 'bg-white hover:bg-orange-100'}`}>Trigger Drought</button>
                    <button onClick={() => setWeather('Rainy')} className={`w-full font-bold py-3 px-4 rounded-lg transition-colors shadow-md ${weather === 'Rainy' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}`}>Trigger Rainfall</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {participants.map(p => <ParticipantCard key={p.id} participant={p} />)}
                         <div className="sm:col-span-2 xl:col-span-3">
                             <ReservoirStatus level={reservoirLevel} capacity={RESERVOIR_CAPACITY} />
                        </div>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                       <GeminiInsights insights={insights} isLoading={isAnalyzing} onGetAnalysis={handleGetAnalysis} />
                       <MarketPlace onTrade={handleTrade} />
                       <EventLog log={log} />
                    </div>
                </div>

                 <footer className="text-center mt-12">
                    <p className="text-sm text-gray-500">This simulation demonstrates how a blockchain-based system can create a fair, responsive, and transparent water market.</p>
                </footer>
            </div>
        </main>
    );
}

