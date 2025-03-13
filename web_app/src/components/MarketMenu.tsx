"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/lib/socket-context'

export default function MarketMenu() {
    const [messages, setMessages] = useState<{ sender: string, message: string, isMine: boolean }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleChatMessage = (message: { sender: string, message: string, isMine?: boolean }) => {
            setMessages(prev => [...prev, { ...message, isMine: message.isMine ?? false }]);
        };

        socket.on('chat-message', handleChatMessage);

        return () => {
            socket.off('chat-message', handleChatMessage);
        };
    }, [socket]);

    const sendMessage = () => {
        if (inputValue.trim() && socket) {
            const message = {
                sender: 'You', // or use the actual username
                message: inputValue,
                isMine: true
            };
            socket.emit('send-chat', inputValue);
            setMessages(prev => [...prev, message]);
            setInputValue('');
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>Open Chat</DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Global Chat</DialogTitle>
                        <DialogDescription className="h-96 overflow-y-auto flex flex-col gap-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-[80%] p-2 rounded-lg ${msg.isMine
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                        }`}>
                                        {!msg.isMine && <span className="text-xs font-medium">{msg.sender}</span>}
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
