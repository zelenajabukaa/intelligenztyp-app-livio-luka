"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Fragenkatalog
const fragenKatalog = [
    {
        typ: "Linguistische Intelligenz",// Intelligenztyp oder auch der Titel des Katalogs
        icon: "📝",// ein Kleines Icon, damit es schöner für die Augen ist
        fragen: [
            "Ich kann meine Gedanken klar und verständlich in Worten ausdrücken.",
            "Ich lese gerne Bücher, Artikel oder Texte in meiner Freizeit.",
            "Beim Erklären komplexer Sachverhalte finde ich schnell die richtigen Worte.",
            "Ich merke mir Zitate, Gedichte oder Textpassagen leicht.",
        ],
    },
    {
        typ: "Logisch-Mathematische Intelligenz",
        icon: "🔢",
        fragen: [
            "Ich löse gerne Rätsel, Sudokus oder logische Aufgaben.",
            "Mathematische Probleme kann ich oft im Kopf durchrechnen.",
            "Ich erkenne schnell Muster und Zusammenhänge in Zahlen oder Daten.",
            "Bei Entscheidungen wäge ich systematisch Pro und Contra ab.",
        ],
    },
    {
        typ: "Räumliche Intelligenz",
        icon: "🗺️",
        fragen: [
            "Ich kann mir dreidimensionale Objekte gut im Kopf vorstellen und drehen.",
            "Landkarten und Wegbeschreibungen verstehe ich auf Anhieb.",
            "Beim Zusammenbauen von Möbeln brauche ich selten die Anleitung.",
            "Ich zeichne oder skizziere gerne zur Veranschaulichung von Ideen.",
        ],
    },
    {
        typ: "Körperlich-Kinästhetische Intelligenz",
        icon: "🤸",
        fragen: [
            "Neue Bewegungsabläufe beim Sport lerne ich schnell.",
            "Ich gestikuliere oft mit den Händen, wenn ich spreche.",
            "Handwerkliche Tätigkeiten fallen mir leicht.",
            "Ich muss Dinge anfassen und ausprobieren, um sie zu verstehen.",
        ],
    },
    {
        typ: "Musikalische Intelligenz",
        icon: "🎵",
        fragen: [
            "Ich erkenne sofort, wenn jemand falsch singt oder ein Instrument verstimmt ist.",
            "Melodien prägen sich mir schnell ein und ich summe oft vor mich hin.",
            "Ich kann den Rhythmus von Musik gut mit dem Körper nachahmen.",
            "Musik beeinflusst meine Stimmung und Konzentration stark.",
        ],
    },
    {
        typ: "Interpersonelle Intelligenz",
        icon: "🤝",
        fragen: [
            "Ich merke schnell, wenn sich die Stimmung einer Person ändert.",
            "In Gruppendiskussionen übernehme ich oft die Moderatorenrolle.",
            "Menschen vertrauen mir ihre Probleme und Sorgen an.",
            "Ich kann gut einschätzen, wie meine Worte bei anderen ankommen.",
        ],
    },
    {
        typ: "Intrapersonelle Intelligenz",
        icon: "🧠",
        fragen: [
            "Ich reflektiere regelmässig über meine Ziele und Motivationen.",
            "Meine Stärken und Schwächen kenne ich sehr gut.",
            "Ich brauche regelmässig Zeit für mich allein zum Nachdenken.",
            "Bei wichtigen Entscheidungen höre ich auf mein Bauchgefühl.",
        ],
    },
    {
        typ: "Naturalistische Intelligenz",
        icon: "🌱",
        fragen: [
            "Ich erkenne verschiedene Pflanzen- und Tierarten leicht.",
            "Wetterveränderungen spüre ich oft schon früh.",
            "In der Natur fühle ich mich besonders wohl und entspannt.",
            "Umweltthemen und Nachhaltigkeit sind mir sehr wichtig.",
        ],
    },
];

//Diese Funktion berechnet den Fortschritt in %, also 56% z.B
function getProgress(step, totalSteps) {
    return Math.round((step / totalSteps) * 100);
}

export default function QuizPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);//Speichert bei welchem Schritt man gerade ist (z.B Schritt 3 von 8).
    const [answers, setAnswers] = useState(
        Array(8)//es gibt 8 Gruppen mit je 4 Antworten (also 8x4 Felder).
            .fill(0)
            .map(() => Array(4).fill(3))
    );

    const current = fragenKatalog[step];// Aktuelle Frage
    const currentAnswers = answers[step];// Aktuelle Antwort

    // wird aufgerufen, wenn bei einem Radiobutton Antwort geändert wird -- er speichert die Antwort
    function handleRadioChange(qIdx, value) {
        const copy = answers.map((arr) => arr.slice());
        copy[step][qIdx] = value;
        setAnswers(copy);
    }

    //geht zum nächsten Schritt/Seite, solange noch nicht alle fertig sind.
    function handleNext() {
        if (step < 7) {
            setStep(step + 1);
        } else {
            router.push(
                "/ergebnis?data=" + encodeURIComponent(JSON.stringify(answers))
            );//beim letzten Schritt geht es zur Ergebnis Seite
        }
    }
    function handleBack() {//geht einen Schritt zurück
        if (step > 0) setStep(step - 1);
    }

    const progress = getProgress(step + 1, 8);//zeigz den Fortschritt in % an

    return (
        <div className="quiz-container">
            <div className="progress-row">// Fortschritt wird hier angezeigt
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }} />
                </div>
                <span className="schritt">Schritt {step + 1}/8</span>
            </div>
            <div className="kategorie">
                <span style={{ fontSize: 28 }}>{current.icon}</span> {current.typ}//zeigt das Icon und den Namen des aktuellen Intelligenztyps (Beispiel: 🧠 Sprachlich).


            </div>
            <div className="fragenblock">// Frage mit 5 Antworten, man kann nur eine auswählen
                {current.fragen.map((frage, qIdx) => (
                    <div key={qIdx} className="frage-block">
                        <div className="frage-text">{frage}</div>
                        <div className="radio-row">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <label key={val} className="radio-label">
                                    <input
                                        type="radio"
                                        name={`frage${qIdx}`}
                                        checked={currentAnswers[qIdx] === val}
                                        onChange={() => handleRadioChange(qIdx, val)}
                                    />
                                    <span>
                                        {[
                                            "Trifft gar nicht zu",
                                            "Trifft wenig zu",
                                            "Trifft teilweise zu",
                                            "Trifft größtenteils zu",
                                            "Trifft vollständig zu",
                                        ][val - 1]}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-row">
                <button onClick={handleBack} disabled={step === 0}>//Button zum zurückgehen
                    Zurück
                </button>
                <button onClick={handleNext}>//Button zum weitergehen
                    {step < 7 ? "Weiter" : "Fertig"}
                </button>
            </div>
            <style jsx>{`
        .quiz-container {
          max-width: 480px;
          margin: 40px auto;
          padding: 32px 20px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        }
        .progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .progress-bar {
          flex: 1;
          height: 12px;
          background: #f3f4f6;
          border-radius: 6px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #3B82F6;
          transition: width 0.3s;
        }
        .schritt {
          font-size: 1rem;
          color: #888;
          min-width: 80px;
          text-align: right;
        }
        .kategorie {
          font-size: 1.2rem;
          font-weight: bold;
          margin: 18px 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fragenblock {
          margin-bottom: 20px;
        }
        .frage-block {
          margin-bottom: 18px;
        }
        .frage-text {
          margin-bottom: 8px;
        }
        .radio-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .radio-label {
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .button-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        button {
          flex: 1;
          padding: 12px 0;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          background: #f3f4f6;
          color: #333;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:disabled {
          background: #eee;
          color: #bbb;
          cursor: not-allowed;
        }
        button:last-child {
          background: #3B82F6;
          color: #fff;
        }
        button:last-child:hover:not(:disabled) {
          background: #2563eb;
        }
      `}</style>
        </div>
    );
}
