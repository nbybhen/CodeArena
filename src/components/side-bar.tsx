"use client";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {getDataFromToken} from "@/helpers/getDataFromToken";

interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    is_verified: boolean,
    is_admin: boolean,
    score: number,
    ranking: string,
    img: string
}

export default function SideBar() {
    let [username, setUsername] = useState<string>("");
    let [score, setScore] = useState<number>(0);
    let [rank, setRank] = useState<string>("");
    let [pfp, setPfp] = useState("");

    const router = useRouter();

    useEffect(() => {
        // An attempt at fixing error where site is re-hosted and token remains since it was logged in previously,
        // but no data is contained within it 
        async function GET() {
            try {
                const response = await axios.get("/api/users/me");

                console.log("RESPONSE: ", response.data.user);

                if(response.data.user) {
                    let me: User = response.data.user;
                    console.log("Me! ", me);
                    setUsername(me.username);
                    setScore(me.score);
                    setRank(me.ranking);
                    setPfp(me.img);
                }
                else {
                    console.log("Error! ");
                    toast.error("Failed to find user token.");
                    await logout(null);
                }

            } catch (e: any) {
                console.log("Not working?");
                console.log("Err: ",e);
                
            } 
        }
        
        GET();

    }, []);

    async function logout(event: any) {
        if(event) {
            event.preventDefault();
        }

        try {
            let response = await axios.get("/api/users/logout");
            console.log("Logged out successfully!", response);
            toast.success("Logged out successfully!");
            router.push("/login");
        } catch (err) {
            toast.error(err.message);
            console.log("Error logging out", err.message);
        }
    }

    return (
        <header>
        <div className="h-screen border-gray-700 flex flex-col max-w-[250px] border-2 px-3 py-4 bg-secondary">
            <ul className="space-y-2 font-medium">
                <li className={"font-bold border-2 flex flex-col justify-center text-center items-center p-2 whitespace-pre-line text-cyan-500"}>
                    <Image src={`/uploads/${window.localStorage.getItem("img")}`} alt={"Profile Picture"} width={120} height={120} objectFit={"cover"} />
                    <p className={"text-xl w-full"}>{window.localStorage.getItem("username")}</p>
                    <p className={"text-med"}>{window.localStorage.getItem("ranking")}</p>
                    <p className={"text-l pr-1"}>[{window.localStorage.getItem("score")}]</p>
                </li>

                <li className={"border-t dark:border-gray-700 mt-4 pt-4"}>
                    <Link href={"/home"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill={"currentColor"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
                        </svg>
                        <span className="ms-3">Home</span>
                    </Link>
                </li>
                <li>
                    <Link href={"/users"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                    </Link>
                </li>
                <li>
                    <Link href={"/ide"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"} fill={"currentColor"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Online IDE</span>
                    </Link>
                </li>
                <li>
                    <Link href={"/new-question"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"} fill={"currentColor"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path  d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">New Question</span>
                    </Link>
                </li>
            </ul>
            <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <li>
                    <Link href={"/docs"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                            <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"/>
                        </svg>
                        <span className="ms-3">Documentation</span>
                    </Link>
                </li>
                <li>
                    <Link href={"/settings"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill={"currentColor"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/>
                        </svg>
                        <span className="ms-3">Settings</span>
                    </Link>
                </li>
                <li>
                    <Link onClick={logout} href={"/login"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                        </svg>
                        <span className="ms-3">Sign out</span>
                    </Link>
                </li>
            </ul>
        </div>
        </header>
    );
}
