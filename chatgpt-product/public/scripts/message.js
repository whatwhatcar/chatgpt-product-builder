/** Same-origin API (Wrangler / Worker-hosted site only). Never use /api/chat on github.io — it hits Pages, not your Worker → 405. */
function chatApiUrl() {
    const metaOrigin = document
        .querySelector('meta[name="api-origin"]')
        ?.getAttribute("content")
        ?.trim()
        .replace(/\/$/, "");

    if (metaOrigin) return `${metaOrigin}/api/chat`;

    const { hostname } = location;
    const isSameOrigin =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".workers.dev");

    return isSameOrigin ? "/api/chat" : null;
}

// Safely parse JSON response
async function safeJson(res) {
    try {
        return await res.json();
    } catch {
        return {};
    }
}

// Build consistent error message
function buildError(res, data) {
    const msg = data?.error || JSON.stringify(data);
    return `Chat request failed (${res.status}): ${msg || res.statusText}`;
}


export async function get_message(messages, product_list, selected_products) {
    const apiUrl = chatApiUrl();

    if (!apiUrl) {
        return 'Missing api-origin. Set <meta name="api-origin" content="https://YOUR-worker.workers.dev"> (no trailing slash).';
    }

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages,
                product_list,
                selected_products,
            }),
        });

        const data = await safeJson(res);

        if (!res.ok) {
            throw new Error(buildError(res, data));
        }

        if (data.error && !data.reply) {
            throw new Error(data.error);
        }

        const reply = data.reply ?? "";
        messages.push({ role: "assistant", content: reply });

        return reply;
    } catch (err) {
        console.error("Error getting message:", err);
        return err instanceof Error ? err.message : "Something went wrong.";
    }
}