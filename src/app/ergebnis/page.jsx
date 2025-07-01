"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ErgebnisPaginator from "../../components/ErgebnisPaginator";// Paginator holen

// durchschnitt berechnen
function berechneDurchschnitt(arr) {
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}

// verschiedene Intelligenztypen
const typen = [
    "linguistisch", "mathematisch", "räumlich", "körperlich",
    "musikalisch", "interpersonell", "intrapersonell", "naturalistisch"
];

export default function ErgebnisSeite() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    // antworten aus URL holen
    const answers = useMemo(() => { // useMemo ist ein REact Hook, sich das Ergebnis einer berechnung merkt, also es muss nicht bei jedem Render neu berechnet werden
        const data = searchParams.get("data");
        return data ? JSON.parse(data) : [];
    }, [searchParams]);

    // Durchschnittswerte berechnen
    const werte = useMemo(() => {
        const w = {};
        typen.forEach((typ, i) => {
            w[typ] = answers[i] ? berechneDurchschnitt(answers[i]) : "-";//führt für jeden Typ die berechnung des Durchschnitts durch
        });
        return w;
    }, [answers]);

    // hier ist der Prompt für die KI
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

    async function getKIResult() {// sendet den Prompt an die KI(oder besser gesagt die API) und holt das Ergebnis
        setLoading(true);
        setResult("");
        const res = await fetch("/api/perplexity", {// fetcht von der API
            method: "POST",
            headers: { "Content-Type": "application/json" },// es wird JSON gesendet
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (data.choices && data.choices[0]?.message?.content) {
            setResult(data.choices[0].message.content);//falls die KI eine Antwort liefert, wird sie angezeigt
        } else if (data.error) {
            //error handling, da es manchmal zu Fehlern kommt mit der API und dann nichts steht
            setResult("Fehler: " + data.error + (data.details ? " (" + data.details + ")" : ""));
        } else {
            setResult("Unbekannter Fehler. Es wurde keine KI-Antwort empfangen.");
        }
        setLoading(false);
    }

    useEffect(() => {// wenn die Antworten sich ändern, wird die KI abgefragt(falls es natürlich 8 Antworten sind, also alle Fragen beantwortet wurden)
        if (answers.length === 8) getKIResult();
    }, [answers]);

    if (loading) {//falls die KI noch am arbeiten ist
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

    if (!result) {//falls die Ki noch kein Ergebnis geliefert hat
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
        //die Komponente ErgebnisPaginator ist dafür zuständig, das fertige KiErgebnis und die Punktwerte schön anzuzeigen (zum Beispiel: mit Blättern, Download Button, usw.).
    );
}
