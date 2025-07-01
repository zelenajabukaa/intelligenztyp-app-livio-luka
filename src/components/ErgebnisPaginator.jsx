"use client";
import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
/*Was macht ReactMarkdown?
    Markdown ist eine einfache Auszeichnungssprache, die oft für Dokumentation und Blogs verwendet wird.
    Es rendert Markdown Text in HTML, damit er im Browser angezeigt werden kann.

    Was heisst das?
    Es nimmt mit # Überschriften, **fett**, Listen, Links und wandelt sie in HTML elemente um(bsp. <h1>, <strong>, <ul>, <li>, <a>)
*/
import remarkGfm from "remark-gfm";


//die Funktion versucht zuerst, den Text an leeren Zeilen (also doppeltem Zeilenumbruch) zu trennen.
// Wenn das nicht funktioniert, versucht sie es an Nummerierungen (1., 2., 3. usw.)
// Wenn das auch nicht klappt, versucht sie es an Sternchen (**).
// Wenn alles fehlschlägt, gibt sie den gesamten Text als eine Seite zurück.
function splitIntoPages(text) {

    let pages = text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (pages.length < 2) {
        pages = text.split(/(?=\d\.)/).map(s => s.trim()).filter(Boolean);
    }
    if (pages.length < 2) {
        pages = text.split(/\*\*/).map(s => s.trim()).filter(Boolean);
    }
    if (pages.length === 0) {
        pages = [text];
    }
    return pages;
}

export default function ErgebnisPaginator({ kiText, scores }) {
    const [page, setPage] = useState(0);
    const pages = useMemo(() => splitIntoPages(kiText), [kiText]);

    //Der KI Text (kiText) wird mit der Funktion splitIntoPages in mehrere Abschnitte (Seiten) geteilt.

    function handleDownload() {
        const blob = new Blob([kiText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "intelligenz_ergebnis.txt";
        //mit dem button „Ergebnis herunterladen“ kann man das komplette KI Ergebnis als .txt-Datei speichern.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="container">
            <h2>🎯 Dein Ergebnis</h2>
            <div className="scores">
                {Object.entries(scores).map(([typ, wert]) => (// hier wird die Punktzahl für jeden Intelligenztyp angezeigt
                    <div key={typ}><b>{typ}:</b> {wert}</div>
                ))}
            </div>
            <div className="page-content" style={{ minHeight: 120, marginBottom: 20 }}>{/* hier wird der Text der aktuellen Seite angezeigt*/}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {pages[page]}
                </ReactMarkdown>
            </div>
            <div className="buttons" style={{ marginBottom: 16 }}>{/* hier sind die Buttons zum Blättern*/}
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Zurück</button>
                <span style={{ margin: "0 16px" }}>Seite {page + 1} / {pages.length}</span>
                <button onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))} disabled={page === pages.length - 1}>Weiter</button>
            </div>
            <button onClick={handleDownload} style={{// der Button zum Herunterladen des Ergebnisses
                padding: "10px 24px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#F59E0B",
                color: "#fff",
                cursor: "pointer"
            }}>
                Ergebnis herunterladen
            </button>
            <style jsx>{`
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 24px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .scores {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 24px;
          margin-bottom: 24px;
          font-weight: bold;
          color: #333;
        }
        .page-content {
          font-size: 1.1rem;
          color: #444;
          text-align: left;
          white-space: pre-wrap;
        }
        .buttons button {
          margin: 0 8px;
          padding: 10px 24px;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          background-color: #3B82F6;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .buttons button:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
