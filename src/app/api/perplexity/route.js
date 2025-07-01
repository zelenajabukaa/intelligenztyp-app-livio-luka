export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            // dient als Vermittler zwischen der App und der Perplexity API
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,//der Bearer ist mein API Schlüssel, der in der .env Datei gespeichert ist
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar",// so heisst das schnelle und günstige Modell von Perplexity
                messages: [
                    // hier sagt man der Ki, wie sie sich verhalten soll
                    { role: "system", content: "Du bist ein freundlicher, motivierender Intelligenz-Test-Auswerter." },

                    // hier kommt der Prompt, also die Frage, die man der KI stellt
                    { role: "user", content: prompt }
                ],
                max_tokens: 300
            })
        });

        // prüfe, ob eine Antwort kommt
        if (!response.ok) {
            const text = await response.text();
            return new Response(JSON.stringify({ error: "API-Fehler", details: text }), { status: 500 });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server-Fehler", details: error.message }), { status: 500 });
    }
}

