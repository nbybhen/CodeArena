"use client";
import {useState} from "react";

export default function QuestionNav() {
    const [language, setLanguage] = useState("any");

    function handleLanguageChange(event: any) {
        event.preventDefault();
        console.log("Selected: ", event.target.value);
    }

    return(
        <nav className="bg-primary">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded md:p-0" aria-current="page">Language</a>
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
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Difficulty</a>
                            <select name="difficulty" id="difficulty">
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
                <form className="flex float-right items-center max-w-sm">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <input type="text" id="simple-search" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-secondary dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                    </div>
                    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </button>
                </form>
            </div>
        </nav>
    );
}