const lang_icons = {
    python: <img key={"python"} className={"w-10"}  alt={"Python"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" />,
    rust: <img key={"rust"} className={"w-10"}  alt={"Rust"} src="https://www.rust-lang.org/logos/rust-logo-128x128.png" />,
    kotlin: <img key={"kotlin"} className={"w-10"}  alt={"Kotlin"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" />,
    java: <img key={"java"} className={"w-10"}  alt={"Java"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" />,
    go: <img key={"go"} className={"w-10"}  alt={"Go"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg" />,
    typescript: <img key={"ts"} className={"w-10"}  alt={"Typescript"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />,
    javascript: <img key={"js"} className={"w-10"}  alt={"Javascript"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />,
    c: <img key={"c"} className={"w-10"}  alt={"C"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" />,
    cpp: <img key={"cpp"} className={"w-10"}  alt={"C++"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" />,
    elixir: <img key={"elixir"} className={"w-10"}  alt={"Elixir"} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg" />,
}

export default function QuestionCard(props) {
    let {id, title, desc, langs, diff} = props;

    function createIcons() {
        let langIcons = [];
        langs.forEach(lang => {
            langIcons.push(lang_icons[lang]);
        });
        return langIcons;
    }

    return(
        <a href={`/solo/${id}`} className="transition flex w-full justify-between ease-in-out p-6 border-t border-b border-r border-gray-700 shadow hover:bg-gray-100 bg-secondary dark:border-gray-700 dark:hover:bg-gray-700">
            <div className={"border-white flex flex-col w-1/2"}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">{desc}</p>
            </div>
            <div className={"flex border-2 border-white float-right h-full w-1/4 justify-evenly items-center "}>
                {createIcons()}
                <p className={"font-bold"}>{diff}</p>
            </div>
        </a>
    )
}