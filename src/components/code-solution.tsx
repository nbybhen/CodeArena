export default function CodeSolution(props) {
    const {name, lang, sol} = props;
    return (
        <div className={"mb-3 bg-secondary p-6 flex flex-col border-red-600"}>
            <h5 className={"font-bold text-2xl"}>{name}</h5>
            <h1 className={"mt-2 text-xl"}>{lang}</h1>
            <p className={"border-2 p-6 bg-primary w-fit"}>{sol}</p>
        </div>
    );
}