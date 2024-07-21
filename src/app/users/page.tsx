"use client";
import SideBar from "@/components/side-bar";
import UserCard from "@/components/user-card";
import {useEffect, useState} from "react";
import axios from "axios";

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

export default function Users() {
    const [users, setUsers] = useState([]);


    useEffect(() => {
        async function getUsers() {
            setUsers([]);

            let response = await axios.get("/api/users/get_users");
            console.log("Response: ", response.data.users);

            response.data.users.forEach((user: User) => {
                setUsers(prevUsers => [...prevUsers, {username: user.username, ranking: user.ranking, img: user.img}])
            });

        }

        getUsers();
    }, []);

    function makeUserCards() {
        let userCards = [];
        users.forEach((user: {username: string, ranking: string, img: string}) => {
            userCards.push(<UserCard key={user.username} username={user.username} ranking={user.ranking} img={user.img}  />)
        });
        return userCards;
    }

    useEffect(() => {

    }, [users]);

    return(
      <div className={"flex h-screen"}>
          <SideBar/>
          <div className={"flex h-full justify-center flex-wrap overflow-y-auto border-2"}>
              {makeUserCards()}
          </div>
      </div>
    );
}