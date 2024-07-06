"use client";
import {useState} from "react";

export default function QuestionNav(props) {
    const {setSearch, setLanguage, setDiff} = props;


    function handleSearch(e){
        e.preventDefault();
        setSearch(e.target.value);
    }
    function handleLanguageChange(e) {
        e.preventDefault();
        setLanguage(e.target.value);
    }

    function handleDiffChange(e) {
        e.preventDefault();
        setDiff(e.target.value);
    }

    return(
        <nav className="bg-primary">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
                        <li>
                            <p className={"block py-2 px-3 text-white rounded md:p-0"}>Languages</p>
                            <select name="language" id="languages" onChange={handleLanguageChange}>
                                <option value="any">Any</option>
                                <option value="python">Python</option>
                                <option value="rust">Rust</option>
                                <option value="go">Go</option>
                                <option value="kotlin">Kotlin</option>
                                <option value="java">Java</option>
                            </select>
                        </li>
                        <li>
                            <p className={"block py-2 px-3 text-gray-900 rounded md:p-0 dark:text-white dark:border-gray-700"}>Difficulty</p>
                            <select name="difficulty" id="difficulty" onChange={handleDiffChange}>
                                <option value="any">Any</option>
                                <option value="novice">Novice</option>
                                <option value="journeyman">Journeyman</option>
                                <option value="adept">Adept</option>
                                <option value="master">Master</option>
                                <option value="champion">Champion</option>
                                <option value="legend">Legend</option>
                                <option value="paragon">Paragon</option>
                            </select>
                        </li>
                    </ul>
                </div>
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span className="sr-only">Search icon</span>
                    </div>
                    <input type="text" onChange={handleSearch} id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-secondary dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
                </div>
            </div>
        </nav>
    );
}