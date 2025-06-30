"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ErgebnisPaginator from "../../components/ErgebnisPaginator";

// Hilfsfunktion: Durchschnitt berechnen
function berechneDurchschnitt(arr) {
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}

const typen = [
    "linguistisch", "mathematisch", "räumlich", "körperlich",
    "musikalisch", "interpersonell", "intrapersonell", "naturalistisch"
];

export default function ErgebnisSeite() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    // Antworten aus URL holen
    const answers = useMemo(() => {
        const data = searchParams.get("data");
        return data ? JSON.parse(data) : [];
    }, [searchParams]);

    // Durchschnittswerte berechnen
    const werte = useMemo(() => {
        const w = {};
        typen.forEach((typ, i) => {
            w[typ] = answers[i] ? berechneDurchschnitt(answers[i]) : "-";
        });
        return w;
    }, [answers]);

    // Prompt generieren
    const prompt = `
Hier sind die Ergebnisse eines Intelligenz-Tests nach Howard Gardner (1 = gar nicht, 5 = voll ausgeprägt):
${typen.map(typ => `${typ.charAt(0).toUpperCase() + typ.slice(1)}: ${werte[typ]}`).join(', ')}
Bitte gib das Ergebnis in mehreren Abschnitten aus. Jeder Abschnitt soll einen kurzeb Fliesstext beinhalten. !!Verwende kein "1.", "2." oder andere Nummerierung!!. GEBE AUF KEINEN FALL DIE QUELLEN AN([1], [2], ...).

Halte dich immer an folgende Struktur:
Bestimme den dominanten Intelligenztyp (höchster Wert) in EINEM SATZ.
Erkläre diesen Typ IMMER in 2-3 Sätzen einfach und motivierend.
Gib 2-3 passende Berufsideen.

WICHTIG: SCHREIBE IMMER ALLES FERTIG, NIE EINEN TEIL ABSCHNEIDEN!

VERSUCHE WICHTIGE WÖRTER IMMER ZU FETT ZU MACHEN, DAMIT SIE HERVORSTECHEN!

HALTE DICH AN DIE REGELN: NIIIEEEE MEHR ALS 3 SÄTZE PRO ABSCHNITT, NIIIEEEE MEHR ALS 3 ABSCHNITTE!

UND BIIIITTTE MACHE DIE SÄTZE NICHT ZU LANG, MAXIMAL 20 WÖRTER PRO ABSCHNITT!
UND BITTE KEINE PUNKTZAHLEN, NUR TEXT!
`;

    async function getKIResult() {
        setLoading(true);
        setResult("");
        const res = await fetch("/api/perplexity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
            setResult(data.choices[0].message.content);
        } else if (data.error) {
            setResult("Fehler: " + data.error + (data.details ? " (" + data.details + ")" : ""));
        } else {
            setResult("Unbekannter Fehler. Es wurde keine KI-Antwort empfangen.");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (answers.length === 8) getKIResult();
    }, [answers]);

    if (loading) {
        return (
            <div style={{
                maxWidth: 500, margin: "40px auto", padding: 32, textAlign: "center",
                background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.08)"
            }}>
                <h2>Dein Ergebnis</h2>
                <p>KI wertet aus...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div style={{
                maxWidth: 500, margin: "40px auto", padding: 32, textAlign: "center",
                background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.08)"
            }}>
                <h2>Dein Ergebnis</h2>
                <p>Bitte warte, das Ergebnis wird berechnet...</p>
            </div>
        );
    }

    return (
        <ErgebnisPaginator kiText={result} scores={werte} />
    );
}
