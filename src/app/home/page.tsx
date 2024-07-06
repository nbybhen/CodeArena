import SideBar from "@/components/side-bar";
import ArenaModeCard from "@/components/arena-mode-card";

export default function Home() {
    return (
        <div className={"flex h-screen w-screen bg-primary"}>
            <div className={"float-left"}>
                <SideBar />
            </div>
            <div className={"flex flex-col items-center ml-[200px] m-2 w-screen"}>
                <h2 className={"text-2xl font-bold mt-10"}>Select an Arena:</h2>
                <div className={"flex mt-3"}>
                    <div className={"mr-2"}>
                        <ArenaModeCard name={"Solo"} desc={"Sharpen your programming skills before entering the arena!"} path={"/solo"} />
                    </div>
                    <div className={"mr-2"}>
                        <ArenaModeCard name={"Clash"} desc={"Clash with fellow coders in a real-time game!"} path={"/clash"} />
                    </div>
                    <ArenaModeCard name={"Cooperate"} desc={"Fight against the clock with an ally to complete a problem!"} path={"/co-op"} />
                </div>

            </div>
        </div>
    );
}
