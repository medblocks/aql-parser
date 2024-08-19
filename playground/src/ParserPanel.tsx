import { SelectedQuery } from "./state";
import { useAtom } from "jotai";

import { AQLParser } from "../../src/index";
import { useEffect, useState } from "react";

const ParserPanel = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedQuery, _setSelectedQuery] = useAtom(SelectedQuery);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        try {
            const parser = AQLParser();
            const match = parser.parse(selectedQuery[0]);
            console.log(match);
            if (match.message) {
                setSuccess(false);
                setErrorMessage(match.message);
                return
            }else{
                setSuccess(true);
            }

        } catch (e: unknown) {
            setErrorMessage((e as { message: string }).message);
            setSuccess(false);
        }
    }, [selectedQuery]);

    return (
        <div className="py-2 font-mono mx-2" >

            <div className="p-2" >
                {selectedQuery[0]}
            </div>

            {success === true && <div className="text-green-500" >Success</div>}
            {success === false && 
            <div className="text-red-600 text-sm bg-red-100 px-3 py-5 border border-red-200 " >
                <p className="text-sm whitespace-pre-wrap" >
                {errorMessage}
                </p>
                </div>
            }



        </div>
    )
}


export default ParserPanel;