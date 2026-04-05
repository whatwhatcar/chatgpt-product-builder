/** Same-origin API (Wrangler / Worker-hosted site only). Never use /api/chat on github.io — it hits Pages, not your Worker → 405. */
function chatApiUrl() {
    const el = document.querySelector('meta[name="api-origin"]');
    const origin = el?.getAttribute("content")?.trim().replace(/\/$/, "") || "";
    if (origin) return `${origin}/api/chat`;

    const h = location.hostname;
    const sameOriginApi =
        h === "localhost" ||
        h === "127.0.0.1" ||
        h.endsWith(".workers.dev");
    if (sameOriginApi) return "/api/chat";

    return null;
}

export async function get_message(messages, product_list, selected_products) {
    try {
        const apiUrl = chatApiUrl();
        if (!apiUrl) {
            throw new Error(
                'Missing api-origin. In public/index.html set <meta name="api-origin" content="https://YOUR-worker.workers.dev"> (no trailing slash), commit, push, and wait for GitHub Pages to rebuild.'
            );
        }

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages,
                product_list,
                selected_products
            }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const msg = data.error || JSON.stringify(data);
            throw new Error(
                `Chat request failed (${res.status}): ${msg || res.statusText}`
            );
        }

        if (data.error && !data.reply) {
            throw new Error(data.error);
        }

        messages.push({ role: "assistant", content: data.reply });
        return data.reply;
    } catch (err) {
        return err instanceof Error ? err.message : "Something went wrong.";
    }
}