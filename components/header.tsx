import Link from "next/link";

export default function Header() {
    return (
        <header>
            <nav className="flex flex-wrap p-6 border-2 border-t-red-900 border-solid justify-between ">
                <div className="text-xl font-bold">
                    <a href="#">CodeWars</a>
                </div>
                <div className="w-full text-lg border-white border-2 ">
                    <div className="flex flex-grow order-2 lg:flex-grow">
                        <Link href="/home">Home</Link>
                        <Link href="/dashboard">Online IDE</Link>
                    </div>
                    <div className="inline-block float-right">
                        <Link className="" href="/dashboard">
                            Sign out
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
