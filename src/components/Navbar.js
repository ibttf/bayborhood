import React, {useState,useEffect} from 'react';

import {AiOutlineClose} from "react-icons/ai"
import {VscThreeBars} from "react-icons/vsc"
import logo from "../styles/logo.png"
const Navbar = () => {
  const [open,setOpen]=useState(false);
  const [sticky,setSticky]=useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
  
    },[])
    return (
    <nav className={`fixed top-0 z-10 ${sticky? "bg-gray-900" : ""} duration-300 ease-in-out w-screen`}>
    {/* LOGO */}
        <a href="/">
          <img src={logo} className="absolute lg:top-4 xl:left-20 xl:w-60 sm:w-48 w-24 md:left-32 sm:left-24 left-16 md:top-3 sm:top-1 top-2.5 hover:cursor-pointer"
                         />
        </a>
      {/* DESKTOP NAV */}
        <div className="xl:grid hidden w-6/12 mx-auto  grid-cols-4 text-center py-8 text-gray-100">
          <div className={`w-full text-center`}>
            
            <a href="/#home" className="text-center mx-auto w-fit flex flex-col cursor-pointer hover:text-white hover:scale-110 duration-100 ease-in-out">
              <span className="text-xs text-right font-normal">01</span>
              // home
            </a>
          </div>
          <div className={`w-full text-center`}>
            
            <a href="/#skills" className="text-center mx-auto w-fit flex flex-col cursor-pointer hover:text-white hover:scale-110 duration-100 ease-in-out">
              <span className="text-xs text-right font-normal">02</span>
              // skills
            </a>
          </div>
          <div className={`w-full text-center`}>
            
            <a href="/#projects" className="text-center mx-auto w-fit flex flex-col cursor-pointer hover:text-white hover:scale-110 duration-100 ease-in-out">
              <span className="text-xs text-right font-normal">03</span>
              // projects
            </a>
          </div>
          <div className={`w-full text-center`}>
            
            <a href="/#contact" className="text-center mx-auto w-fit flex flex-col cursor-pointer hover:text-white hover:scale-110 duration-100 ease-in-out">
              <span className="text-xs text-right font-normal">04</span>
              // contact
            </a>
          </div>

        </div>
        {/* MOBILE NAV */}
        <div className="xl:hidden grid relative md:ml-12 ml-6 py-4 z-10">
            <VscThreeBars className={`${open ? "" : ""} duration-300 cursor-pointer text-white md:w-12 md:h-12 sm:h-8 sm:w-8 h-4 w-4`} onClick={()=>{setOpen(!open)}}/>
           

            <div className={`${open ? "text-gray-700 xl:-translate-x-full flex": "-translate-x-full"} duration-300 fixed px-4 top-0 left-0 bg-gray-100 flex-col h-screen w-10/12` }>
                <AiOutlineClose className={`cursor-pointer text-gray-700 h-10 w-10 p-2 rounded-full hover:bg-gray-200 duration-1000  mt-4 `} onClick={()=>{setOpen(!open)}}/>
                <a href="/#home" className="py-2 cursor-pointer font-light-bubble md:text-xl text-sm" onClick={()=>{setOpen(!open)}}>// home</a>
                <a href="/#skills" className=" py-2 cursor-pointer font-light-bubble md:text-xl text-sm" onClick={()=>{setOpen(!open)}}>// skills</a>
                <a href="/#projects" className=" py-2 cursor-pointer font-light-bubble md:text-xl text-sm" onClick={()=>{setOpen(!open)}}>// projects</a>
                <a href="/#contact" className=" pb-4 py-2 cursor-pointer font-light-bubble md:text-xl text-sm" onClick={()=>{setOpen(!open)}}>// contact</a>

            </div>
        </div>
    </nav>



    );
}

export default Navbar;
