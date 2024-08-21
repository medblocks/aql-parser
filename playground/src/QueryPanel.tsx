import { useEffect, useState } from "react";
import { SelectedQuery } from "./state";
import { useAtom } from "jotai";

const initialQueries = [
    "select c as x where xds = 10 and y = $composition_id limit 20",
    "select c from EHR ex where sd = $id and x = 23 limit 5",
    `
SELECT
    e/ehr_id/value as ehrId,
    p/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as spo2Numerator
FROM EHR e
    CONTAINS COMPOSITION c
        CONTAINS OBSERVATION p[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]
WHERE
    p/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value/numerator <= 96
`,
    `SELECT
    obs/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude AS systolic,
    obs/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude AS diastlic,
    c/context/start_time AS date_time
FROM
    EHR [ehr_id/value=$ehrUid] CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1]
            CONTAINS OBSERVATION obs [openEHR-EHR-OBSERVATION.blood_pressure.v1]
WHERE
    obs/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude >= 140 OR
    obs/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude >= 90
ORDER BY
    c/context/start_time DESC
LIMIT 5`,
    "SELECT exam/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.anatomical_location.v1]/items[at0001]/value as location, exam/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as sign FROM EHR e CONTAINS COMPOSITION c CONTAINS OBSERVATION exam [openEHR-EHR-OBSERVATION.exam.v1] WHERE c/uid/value = $composition_id"
];

const QueryPanel = () => {
    const [queries, editQueries] = useState(initialQueries);
    const [newQuery, setNewQuery] = useState("");
    const [selectedQuery, setSelectedQuery] = useAtom(SelectedQuery);

    const handleSave = () => {
        if (newQuery.trim()) {
            editQueries([...queries, newQuery]);
            setSelectedQuery([newQuery, queries.length]);
            setNewQuery("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    const handleSelect = (index: number) => {
        setSelectedQuery([queries[index], index]);
    };


    useEffect(() => {
        setSelectedQuery([queries[0], 0]);
    }, [queries, setSelectedQuery]);

    return (
        <div className="font-mono text-sm px-2 mt-2">
            <div className="flex flex-col gap-y-1">
                {queries.map((query, index) => (
                    <div
                        contentEditable
                        suppressContentEditableWarning
 
                        onClick={() => handleSelect(index)}
                        key={index}
                        className={`hover:bg-slate-200 px-4 py-2 cursor-pointer ${selectedQuery[1] === index ? "border-l-4 border-solid border-indigo-500 bg-sky-200" : "bg-slate-100"}`}
                    >
                        {query}
                    </div>
                ))}
                <div className="bg-slate-200 px-4 py-2 flex justify-end">
                    <input
                        className="flex-grow outline-none bg-slate-200"
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <button className="px-2 py-1 bg-blue-300" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryPanel;