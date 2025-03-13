"use client"

import { createContext, useContext, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = io('http://localhost:3001')
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext)
}
