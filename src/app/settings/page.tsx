"use client";
import SideBar from "@/components/side-bar";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    is_verified: boolean;
    is_admin: boolean;
    score: number;
    ranking: string;
    img: string;
}

export default function Settings() {
    let [username, setUsername] = useState<string>("");
    let [email, setEmail] = useState<string>("");
    let fileInput = useRef<HTMLInputElement>(null);
    let router = useRouter();

    async function getData() {
        let response = await axios.get("/api/users/me");

        let user: User = response.data.user;
        console.log("User: ", user);

        setUsername(user.username);
        setEmail(user.email);
    }
    useEffect(() => {
        getData();
    }, []);

    async function handleClick(event: any) {
        event.preventDefault();

        try {
            const formData = new FormData();

            formData.append("file", fileInput.current.files[0]);
            formData.set("username", username);
            formData.set("email", email);

            const response = await axios.post("/api/users/update_user", formData);

            if (response.data.success) {
                console.log("RESPONSE: ", response.data.message);
                window.localStorage.setItem("img", response.data.img);
                toast.success("Successfully updated profile!");
                setTimeout(() => {
                    router.push("/home");
                }, 1000);
            } else {
                console.log("ERROR: ", response.data.error);
                toast.error(response.data.error);
            }
        } catch (e) {
            toast.error(e.message);
            console.log("Error updating user!", e.message);
        }
    }

    return (
        <div className={"flex"}>
            <Toaster position={"top-center"} />
            <SideBar />
            <div className={"flex bg-primary border-2 justify-center items-center  w-full"}>
                <div className={"bg-secondary flex flex-col items-center border-2 border-gray-700 w-1/3"}>
                    <h1 className={"text-xl font-bold"}>Settings</h1>
                    <div className={"flex w-full"}>
                        <div className={"flex m-4 flex-col justify-evenly w-full"}>
                            <form>
                                <div className={"m-2"}>
                                    <label htmlFor="username" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                                        Username
                                    </label>
                                    <input
                                        id={"username"}
                                        defaultValue={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required={true}
                                        className="mt-1 p-5 w-full size-9 rounded-md border-gray-200 text-sm bg-primary text-gray-700 shadow-sm dark:text-gray-200"
                                    />
                                </div>

                                <div className={"m-2"}>
                                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                                        Email
                                    </label>
                                    <input
                                        id={"email"}
                                        defaultValue={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required={true}
                                        className="mt-1 w-full size-9 p-5 rounded-md border-gray-200 text-sm bg-primary text-gray-700 shadow-sm dark:text-gray-200"
                                    />
                                </div>

                                <div className={"m-2"}>
                                    <label htmlFor="pfp" className="block mt-3 text-lg font-medium text-gray-700 dark:text-gray-200">
                                        Profile Picture
                                    </label>
                                    <input id={"pfp"} ref={fileInput} type="file" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <button
                        type="submit"
                        onClick={handleClick}
                        className="w-full border-blue-600 bg-blue-600 px-12 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm  py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
