export default function UserCard() {
    return (
        <a href={"#"} className="block transition ease-in-out duration-300 max-w-sm p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 bg-secondary dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">NAME</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">DESC</p>
        </a>
    );
}