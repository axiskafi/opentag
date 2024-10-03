import Echo from "laravel-echo";
import Pusher from "pusher-js"; // If you're using Pusher's JS library for reverb, keep this import
import Env from "./env"; // Custom env config

// Define global types for Pusher and Echo
declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo;
    }
}

// Initialize laraEcho and pvtlaraEcho only in the browser
let laraEcho: Echo;
let pvtlaraEcho: ((token: string) => Echo);

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    laraEcho = new Echo({
        broadcaster: "reverb", // Use your custom broadcaster (reverb)
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY, // Custom app key
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST, // Custom WebSocket host
        wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT), // Custom WebSocket port
        wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT), // Custom WebSocket secure port
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
        enabledTransports: ["ws", "wss"], // WebSocket and secure WebSocket
    });

    pvtlaraEcho = (token: string) => {
        return new Echo({
            broadcaster: "reverb", // Custom broadcaster
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY, // Custom app key
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST, // Custom WebSocket host
            wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT), // Custom WebSocket port
            wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT), // Custom WebSocket secure port
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http") === "https",
            authEndpoint: Env.API_URL + "/api/broadcasting/auth", // Authentication endpoint
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            enabledTransports: ["ws", "wss"], // WebSocket and secure WebSocket
        });
    };
}

export { laraEcho, pvtlaraEcho };
