import SideBar from "@/components/side-bar";
import Card from "@/components/card";

export default function Home() {
    return (
        <div className={"flex h-screen w-screen bg-primary"}>
            <div className={"float-left"}>
                <SideBar />
            </div>
            <div className={"flex flex-col items-center m-2 w-screen"}>
                <h2 className={"text-2xl font-bold mt-10"}>Select an Arena:</h2>
                <div className={"flex mt-3"}>
                    <div className={"mr-2"}>
                        <Card name={"Solo"} desc={"Sharpen your programming skills before entering the arena!"} />
                    </div>
                    <div className={"mr-2"}>
                        <Card name={"Clash"} desc={"Clash with fellow coders in a real-time game!"} />
                    </div>
                    <Card name={"Cooperate"} desc={"Fight against the clock with an ally to complete a problem!"} />
                </div>

            </div>
        </div>
    );
}
