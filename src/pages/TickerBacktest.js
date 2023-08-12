import React from 'react';
// import one from "../styles/tickerbacktest/1.png"
const TickerBacktest = () => {
    return (
        <div className="lg:py-48 py-24 h-full w-full bg-gray-900">
            <div className="flex flex-col lg:w-10/12 w-11/12 mx-auto">
                <h1 className=" font-semibold lg:text-6xl text-4xl text-white"><span className="underline decoration decoration-8">Ticker Backtest</span> - Data Science</h1>
                <h2 className="lg:text-lg text-md flex text-gray-400  py-12">
                    <a href="/" className="px-2 hover:text-gray-300 duration-300">
                        Home
                    </a>
                    <span className="px-2">
                        &lt;
                    </span>
                    <span onClick={()=>window.location.reload()} className="px-2 hover:text-gray-300 duration-300">
                        Ticker Backtest
                    </span>
                </h2>
            </div>
            <div className="flex lg:flex-row flex-col lg:w-10/12 w-11/12 mx-auto text-gray-300">
                <p className="w-full lg:text-lg md:text-md text-sm">
                This project is a simple Python script that uses historical stock data from yfinance and stockstats to calculate the best day of the month to buy and sell any ticker.
                </p>
                <div className="w-full text-left flex-col flex lg:pb-48 pb-12">
                    <div className='lg:w-8/12 w-full mx-auto lg:mt-0 mt-12'>
                        <h3 className="lg:text-3xl text-xl text-gray-100 font-semibold">
                            Technologies Used
                        </h3>
                        <div className="grid md:grid-cols-3 md:gap-12 gap-0 w-ful">
                            <div className="text-left flex flex-col py-4 lg:text-xl text-xs font-semibold">
                                <h6 className="underline text-gray-400 decoration-4">
                                    Backend:
                                </h6>
                                <p className="font-thin">Python</p>
                            </div>

                            <div className="text-left flex flex-col py-4 lg:text-xl text-xs font-semibold">
                                <h6 className="underline text-gray-400 decoration-4">
                                    Deployment:
                                </h6>
                                <p className="font-thin">Replit</p>
                            </div>
                        </div>
                    </div>
                    <a href="https://replit.com/@RoyLee8/Ticker-Backtests" target="_blank" className="hover:text-gray-200 duration-300 lg:w-8/12 w-full mx-auto lg:text-lg md:text-md text-sm cursor-pointer">Open Project -&gt;</a>
                    
                </div>
            </div>
            <div className="grid grid-flow-row grid-cols-1 lg:gap-12 gap-4 w-11/12 mx-auto bg-gray-900">
                {/* <img src={one} className="w-full"/> */}

            </div>
        </div>
    );
}

export default TickerBacktest;
