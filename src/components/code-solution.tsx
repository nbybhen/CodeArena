import { Editor } from "@monaco-editor/react";
import {useRef} from "react";

export default function CodeSolution(props) {
    let editorRef = useRef(null);

    const {name, lang, sol} = props;
    return (
        <div className={"border-t border-b border-r-2 w-full bg-secondary p-6 flex flex-col border-gray-700"}>
            <h5 className={"font-bold text-2xl"}>{name}</h5>
            <h1 className={"mt-2 mb-1 text-xl"}>{lang}</h1>
            <Editor height={sol.split('\n').length * 25} width={"40vw"} language={lang} value={sol} options={{fontSize: 14, scrollBeyondLastLine: false, scrollbar: {vertical: "hidden"}, readOnly: true, minimap: {enabled: false}, }} onMount={(e: any) => editorRef.current = e} theme={"vs-dark"} />
        </div>
    );
}