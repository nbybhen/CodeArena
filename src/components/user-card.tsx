import Image from "next/image";

export default function UserCard(props) {
    let {username, ranking, img} = props;
    return (
        <a href={"#"} className="flex h-1/3 w-1/3 m-2 transition ease-in-out duration-300 max-w-sm p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 bg-secondary dark:border-gray-700 dark:hover:bg-gray-700">
            <div className={"border-2 w-full flex flex-col items-center"}>
                <Image src={`/uploads${img}`} width={100} height={100} className={"mb-10"} alt={"Profile Photo"}/>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{username}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">{ranking}</p>
            </div>
        </a>
    );
}