import { SelectedQuery } from "./state";
import { useAtom } from "jotai";

import { AQLParser, type IAST } from "../../src/index";
import { useEffect, useState } from "react";

interface ASTBlockProps {
    ast: IAST;
}

const ASTBlock: React.FC<ASTBlockProps> = ({ ast }) => {
    return (
        <div className="p-1 flex flex-col w-full">
            <p className="p-1 text-center bg-slate-200 w-full">
                {ast.type}
            </p>
            <div className="p-1 flex">
                {Object.keys(ast).map((key) => {
                    const value = ast[key as keyof IAST];

                    if (value === null) {
                        return null;
                    }

                    if (key === "type") {
                        return null;
                    }

                    if (typeof value === "string" || typeof value === "number") {
                        return (
                            <p key={key} className="p-1 bg-slate-200 w-full text-center m-1">
                                {value}
                            </p>
                        );
                    }

                    if (Array.isArray(value)) {
                        return value.map((subAst, index) => (
                            <ASTBlock key={`${key}-${index}`} ast={subAst as IAST} />
                        ));
                    }

                    if (typeof value === "object") {
                        return (
                            <ASTBlock key={key} ast={value as IAST} />
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

const ParserPanel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedQuery, _setSelectedQuery] = useAtom(SelectedQuery);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const [queryAST, setQueryAST] = useState<IAST | undefined>(undefined);

    useEffect(() => {
        try {
            const parser = AQLParser();
            const match = parser.parse(selectedQuery[0]);
            console.log(match);
            if (match.message) {
                setSuccess(false);
                setErrorMessage(match.message);
                setQueryAST(undefined);
                return;
            } else {
                setSuccess(true);
                console.log(match.ast);
                setQueryAST(match.ast);
            }
        } catch (e: unknown) {
            setErrorMessage((e as { message: string }).message);
            setSuccess(false);
        }
    }, [selectedQuery]);

    return (
        <div className="py-2 font-mono mx-2 overflow-x-scroll">
            <div className="p-2">
                {selectedQuery[0]}
            </div>

            {/* {success === true && <div className="text-green-500">Success</div>} */}
            {success === false &&
                <div className="text-red-600 text-sm bg-red-100 px-3 py-5 border border-red-200">
                    <p className="text-sm whitespace-pre-wrap">
                        {errorMessage}
                    </p>
                </div>
            }

            {queryAST && success && <ASTBlock ast={queryAST} />}
        </div>
    );
};

export default ParserPanel;