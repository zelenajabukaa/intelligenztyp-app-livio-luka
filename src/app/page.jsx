"use client";
/*
 * Einfache Startseite für unseren Intelligenztest
 * Zeigt Titel, Beschreibung und Startbutton
 */
export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">Garcijevic' IntelliType</h1>
        <h2 className="title">Entdecke deinen Intelligenztyp</h2>
      </div>

      <div className="description">
        <p>
          Finde heraus, welcher der 8 Intelligenztypen nach Howard Gardner
          bei dir am stärksten ausgeprägt ist. Beantworte einfach 32 kurze
          Fragen über dich selbst.
        </p>
        <p>
          1 = Trifft gar nicht zu, 5 = Trifft vollständig zu
        </p>
      </div>

      <div className="button-section">
        <button className="start-button" onClick={() => window.location.href = '/quiz'}>
          TEST STARTEN
        </button>
        <p className="tipp">Viel Spass</p>
      </div>

      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
          font-family: Arial, sans-serif;
          border: solid;
          border-radius: 0.8rem;
        }

        .header {
          margin-bottom: 30px;
        }

        .logo {
          font-size: 3rem;
          margin: 0;
          color: #333;
        }

        .title {
          font-size: 2.5rem;
          margin: 10px 0;
          color: #555;
          font-weight: normal;
        }

        .description {
          margin: 30px 0;
          padding: 0 20px;
        }

        .description p {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #666;
          margin: 0;
        }

        .button-section {
          margin-top: 40px;
        }

        .start-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 15px 40px;
          font-size: 1.3rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 15px;
          transition: background-color 0.3s;
        }

        .start-button:hover {
          background-color: #0056b3;
        }

        .tipp {
          color: #888;
          font-size: 1rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
