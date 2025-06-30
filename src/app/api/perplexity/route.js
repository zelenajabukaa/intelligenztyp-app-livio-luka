// src/app/api/perplexity/route.js
export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: "Du bist ein freundlicher, motivierender Intelligenz-Test-Auswerter." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 300
            })
        });

        // Prüfe, ob eine Antwort kommt
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

