import React from 'react';
import one from "../styles/netflix/1.png"
import two from "../styles/netflix/2.png"
import three from "../styles/netflix/3.png"
import four from "../styles/netflix/4.png"
import five from "../styles/netflix/5.png"
import six from "../styles/netflix/6.png"
import seven from "../styles/netflix/7.png"
import eight from "../styles/netflix/8.png"
import nine from "../styles/netflix/9.png"
import ten from "../styles/netflix/10.png"
const Netflixclone = () => {
    return (
        <div className="lg:py-48 py-24 h-full w-full bg-gray-900">
        <div className="flex flex-col lg:w-10/12 w-11/12 mx-auto">
            <h1 className=" font-semibold lg:text-6xl text-4xl text-white"><span className="underline decoration decoration-8">Netflix</span> - Fullstack Clone</h1>
            <h2 className="lg:text-lg text-md flex text-gray-400  py-12">
                <a href="/" className="px-2 hover:text-red-300 duration-300">
                    Home
                </a>
                <span className="px-2">
                    &lt;
                </span>
                <span onClick={()=>window.location.reload()} className="px-2 hover:text-red-300 duration-300">
                    Netflix Clone
                </span>
            </h2>
        </div>
        <div className="flex lg:flex-row flex-col lg:w-10/12 w-11/12 mx-auto text-gray-300">
            <p className="w-full lg:text-lg md:text-md text-sm">
            This project is a fullstack clone of Netflix with full CRUD functionality. Users are allowed to create an account, manage, edit, and create profiles, and have separate "liked movies" lists for each of their profiles. Users are also allowed to search for movies. Movies are pulled from the Movie Database API using fetch.
            </p>
            <div className="w-full text-left flex-col flex lg:pb-48 pb-12">
                <div className='lg:w-8/12 w-full mx-auto lg:mt-0 mt-12'>
                    <h3 className="lg:text-3xl text-xl text-gray-100 font-semibold">
                        Technologies Used
                    </h3>
                    <div className="grid md:grid-cols-3 md:gap-12 gap-0 w-ful">
                        <div className="text-left flex flex-col py-4 lg:text-xl text-xs font-semibold">
                            <h6 className="underline text-gray-400 decoration-4">
                                Frontend:
                            </h6>
                            <p className="font-thin">React</p>
                            <p className="font-thin">CSS</p>
                            <p className="font-thin">Bootstrap</p>
                        </div>
                        <div className="text-left flex flex-col py-4 lg:text-xl text-xs font-semibold">
                            <h6 className="underline text-gray-400 decoration-4">
                                Backend:
                            </h6>
                            <p className="font-thin">Ruby on Rails</p>
                            <p className="font-thin">PostgreSQL</p>
                            <p className="font-thin">Relational Databases</p>
                            <p className="font-thin">Active Record</p>
                        </div>
                        <div className="text-left flex flex-col py-4 lg:text-xl text-xs font-semibold">
                            <h6 className="underline text-gray-400 decoration-4">
                                Deployment:
                            </h6>
                            <p className="font-thin">Heroku</p>
                            <p className="font-thin">Netlify</p>
                        </div>
                    </div>
                </div>
                <a href="https://www.youtube.com/watch?v=FP4QHCbJ_sA&feature=youtu.be" target="_blank" className="hover:text-red-200 duration-300 lg:w-8/12 w-full mx-auto lg:text-lg md:text-md text-sm cursor-pointer">Open Project -&gt;</a>
                <a href="https://github.com/roylee0912/netflix-fullstack-clone" target="_blank" className="hover:text-red-200 duration-300 lg:w-8/12 w-full mx-auto lg:text-lg md:text-md text-sm cursor-pointer">View Code -&gt;</a>
            </div>
        </div>
        <div className="grid grid-flow-row grid-cols-1 lg:gap-12 gap-4 w-11/12 mx-auto bg-gray-900">
            <img src={one} className="w-full"/>
            <img src={two} className="w-full"/>
            <img src={three} className="w-full"/>
            <img src={four} className="w-full"/>
            <img src={five} className="w-full"/>
            <img src={six} className="w-full"/>
            <img src={seven} className="w-full"/>
            <img src={eight} className="w-full"/>
            <img src={nine} className="w-full"/>
            <img src={ten} className="w-full"/>
        </div>
    </div>
    );
}

export default Netflixclone;
