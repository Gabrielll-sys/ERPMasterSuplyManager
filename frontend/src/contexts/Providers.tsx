"use client"

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from "next-auth/react"
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./AuthContext";

export default function Providers({children}:{children:React.ReactNode}){
    const [client] = useState(new QueryClient());

    return(
        <QueryClientProvider client={client}>
        <SessionProvider>
            <AuthProvider>
                <NextUIProvider>
                    {children}
                </NextUIProvider>
            </AuthProvider>
        </SessionProvider>
    </QueryClientProvider>
    )
}