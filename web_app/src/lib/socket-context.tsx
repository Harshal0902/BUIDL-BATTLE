"use client"

import { createContext, useContext, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import { env } from '@/env'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = io(env.NEXT_PUBLIC_BACKEND_DEPLOYMENT)
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext)
}
