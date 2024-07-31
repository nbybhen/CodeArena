import SideBar from "@/components/side-bar";

export default function Complete() {
    return(
        <div className={"flex h-screen w-screen"}>
            <SideBar/>
            <div className={"flex border-2"}>
                COMPLETED CLASH!!!
            </div>
        </div>
    )
}