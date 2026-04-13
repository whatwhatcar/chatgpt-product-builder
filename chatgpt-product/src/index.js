const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function jsonResponse(obj, status = 200, corsHeaders) {
	return new Response(JSON.stringify(obj), {
		status,
		headers: {
			...corsHeaders,
			"Content-Type": "application/json; charset=utf-8",
		},
	});
}

function withCors(response) {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
	async fetch(request, env) {
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		const url = new URL(request.url);

		if (url.pathname === "/message") {
			return new Response("Hello, World!", {
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
			});
		}

		if (url.pathname === "/random") {
			return new Response(crypto.randomUUID(), {
				status: 200,
				headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
			});
		}

		if (request.method === "POST" && url.pathname === "/api/chat") {
			if (!env.OPENAI_API_KEY) {
				return jsonResponse(
					{
						error:
							"Missing OPENAI_API_KEY. For local dev: create chatgpt-product/.dev.vars with OPENAI_API_KEY=sk-... and restart wrangler. For production: npx wrangler secret put OPENAI_API_KEY then deploy.",
					},
					503,
					corsHeaders
				);
			}

			let body;
			try {
				body = await request.json();
			} catch {
				return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
			}

			const incoming = Array.isArray(body.messages) ? body.messages : [];
			const product_list = Array.isArray(body.product_list) ? body.product_list : [];
			const selected_products = Array.isArray(body.selected_products) ? body.selected_products : [];

			const systemPrompt =
				env.SYSTEM_PROMPT ??
				"You are a helpful beauty and skincare advisor. Keep answers concise and friendly.";

			const messages = [
				{
					role: "system",
					content: systemPrompt
				},
				{
					role: "system",
					content: `Available products: ${JSON.stringify(product_list)}`
				},
				{
					role: "system",
					content: `Selected products: ${JSON.stringify(selected_products)}`
				},
				...incoming
			];
			const model = env.OPENAI_MODEL ?? "gpt-4o-mini";

			const payload = {
				model,
				messages,
			};

			const temp = env.OPENAI_TEMPERATURE;
			if (temp !== undefined && temp !== "") {
				const n = Number(temp);
				if (!Number.isNaN(n)) payload.temperature = n;
			}

			const maxTok = env.OPENAI_MAX_TOKENS;
			if (maxTok !== undefined && maxTok !== "") {
				const n = Number(maxTok);
				if (!Number.isNaN(n) && n > 0) payload.max_tokens = n;
			}

			const openaiRes = await fetch(OPENAI_URL, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.OPENAI_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const raw = await openaiRes.text();
			let data;
			try {
				data = JSON.parse(raw);
			} catch {
				return jsonResponse(
					{ error: "OpenAI returned non-JSON", detail: raw.slice(0, 500) },
					502,
					corsHeaders
				);
			}

			if (!openaiRes.ok) {
				const msg = data?.error?.message ?? raw.slice(0, 500);
				return jsonResponse({ error: msg }, openaiRes.status, corsHeaders);
			}

			const reply = data?.choices?.[0]?.message?.content;
			if (typeof reply !== "string") {
				return jsonResponse({ error: "Unexpected OpenAI response shape" }, 502, corsHeaders);
			}

			return jsonResponse({ reply }, 200, corsHeaders);
		}

		if (env?.ASSETS && typeof env.ASSETS.fetch === "function") {
			return env.ASSETS.fetch(request);
		}

		return new Response("Not Found", { status: 404, headers: corsHeaders });
	},
};
