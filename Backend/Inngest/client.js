import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "peerpush",
    // Explicitly enable dev mode locally so it accepts the Dev Server's sync requests
    isDev: process.env.NODE_ENV !== "production" 
});