import SideBar from "@/components/side-bar";
import UserCard from "@/components/user-card";

export default function Users() {
    return(
      <div className={"flex h-screen"}>
          <SideBar/>
          <div className={"w-full border-2"}>
              <UserCard/>
          </div>
      </div>
    );
}