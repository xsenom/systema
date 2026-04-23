import { useEffect, useState } from "react";

export function getEmailFromWindow(defaultEmail = "demo@sistema.local"): string {
    if (typeof window === "undefined") {
        return defaultEmail;
    }

    return new URLSearchParams(window.location.search).get("email") || defaultEmail;
}

export function useEmailParam(defaultEmail = "demo@sistema.local"): string {
    const [email, setEmail] = useState(defaultEmail);

    useEffect(() => {
        setEmail(getEmailFromWindow(defaultEmail));
    }, [defaultEmail]);

    return email;
}
