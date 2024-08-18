"use client"

import { NextUIProvider } from "@nextui-org/react"
import { SessionProvider } from "next-auth/react"
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
export default function Providers({children}:{children:React.ReactNode}){
    const [client] = useState(new QueryClient());

    return(
        <QueryClientProvider client={client}>
        <SessionProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>

        </SessionProvider>
    </QueryClientProvider>

    )
}