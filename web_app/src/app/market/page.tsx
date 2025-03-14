"use client"

import React, { useState, useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'
import MarketMenu from '@/components/MarketMenu'
import { env } from '@/env'
import { useSTXWallet } from '@/context/StxContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Page() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(0);
    const [phase, setPhase] = useState(0);
    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
    const [otherPlayers, setOtherPlayers] = useState<Record<string, { position: { x: number, y: number }, direction: number, phase: number }>>({});
    const boundaryThreshold = 64;
    const [socket, setSocket] = useState<Socket | null>(null);

    const { isSTXConnected, connectSTXWallet } = useSTXWallet();

    const blockedCells = new Set([
        '0-0',
        // '1-0', '1-1', '0-1', '0-2', '1-2', '0-3', '1-3', '0-4', '1-4', '2-4',
        // '0-5', '1-5', '2-5', '3-5', '3-6', '2-6', '1-6', '0-6', '2-7', '1-7', '0-7',
        // '3-7', '3-6', '3-5', '4-5', '6-5', '6-6', '6-7', '7-7', '7-6', '7-5', '8-5',
        // '9-5', '9-6', '10-7', '10-6', '11-6', '11-7', '11-5', '12-5', '12-6', '12-7',
        // '13-7', '14-7', '15-7', '15-6', '14-6', '13-6', '13-5', '14-5', '15-5', '15-4',
        // '14-4', '13-4', '13-3', '14-3', '15-3', '15-2', '14-2', '13-2', '13-1', '14-1',
        // '15-1', '14-0', '13-0', '12-0', '11-0', '10-0', '9-0', '8-0', '7-0', '6-0',
        // '5-0', '3-0', '3-1', '3-2'
    ]);

    const isCellBlocked = (x: number, y: number) => {
        const cellSize = 100;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        return blockedCells.has(`${cellX}-${cellY}`);
    };

    useEffect(() => {
        const newSocket = io(env.NEXT_PUBLIC_BACKEND_DEPLOYMENT, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        setSocket(newSocket);

        newSocket.on('players-update', (players: Record<string, { position: { x: number, y: number }, direction: number, phase: number }>) => {
            setOtherPlayers(players);
        });

        newSocket.on('player-moved', (playerData: { id: string, position: { x: number, y: number }, direction: number, phase: number }) => {
            setOtherPlayers(prevPlayers => ({
                ...prevPlayers,
                [playerData.id]: {
                    position: playerData.position,
                    direction: playerData.direction,
                    phase: playerData.phase
                }
            }));
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('player-move', { position, direction, phase });
        }
    }, [position, direction, phase, socket]);

    useEffect(() => {
        const centerX = window.innerWidth / 2 - 47.5;
        const centerY = window.innerHeight / 2 - 79;
        setPosition({ x: centerX, y: centerY });
    }, []);

    // useEffect(() => {
    //     const handleMouseMove = (e: MouseEvent) => {
    //         if (e.buttons !== 2) return; // Only respond to right mouse button (buttons value 2)

    //         const step = 10;
    //         let newMapOffsetX = mapOffset.x;
    //         let newMapOffsetY = mapOffset.y;

    //         // Calculate movement based on mouse movement
    //         const movementX = e.movementX;
    //         const movementY = e.movementY;

    //         newMapOffsetX = mapOffset.x - movementX;
    //         newMapOffsetY = mapOffset.y - movementY;

    //         setMapOffset({ x: newMapOffsetX, y: newMapOffsetY });
    //     };

    //     window.addEventListener('mousemove', handleMouseMove);
    //     return () => window.removeEventListener('mousemove', handleMouseMove);
    // }, [mapOffset]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'A', 'w', 'W', 's', 'S', 'd', 'D'].includes(e.key)) {
                return;
            }

            const step = 10;
            let newX = position.x;
            let newY = position.y;
            let newDirection = direction;
            let newPhase = phase;
            let newMapOffsetX = mapOffset.x;
            let newMapOffsetY = mapOffset.y;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX = position.x - step;
                    newDirection = 1;
                    if (newX < boundaryThreshold) {
                        newMapOffsetX = mapOffset.x + step;
                        newX = boundaryThreshold;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX = position.x + step;
                    newDirection = 2;
                    if (newX > window.innerWidth - boundaryThreshold - 95) {
                        newMapOffsetX = mapOffset.x - step;
                        newX = window.innerWidth - boundaryThreshold - 95;
                    }
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY = position.y - step;
                    newDirection = 3;
                    if (newY < boundaryThreshold) {
                        newMapOffsetY = mapOffset.y + step;
                        newY = boundaryThreshold;
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY = position.y + step;
                    newDirection = 0;
                    if (newY > window.innerHeight - boundaryThreshold - 158) {
                        newMapOffsetY = mapOffset.y - step;
                        newY = window.innerHeight - boundaryThreshold - 158;
                    }
                    break;
            }

            if (!isCellBlocked(newX, newY)) {
                newPhase = (phase + 1) % 11;
                setDirection(newDirection);
                setPhase(newPhase);
                setPosition({ x: newX, y: newY });
                setMapOffset({ x: newMapOffsetX, y: newMapOffsetY });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position, mapOffset]);

    return (
        <div className='relative h-screen w-screen overflow-hidden'>
            <div className='absolute top-4 right-4 z-10'>
                <MarketMenu
                    position={position}
                    mapOffset={mapOffset}
                    otherPlayers={otherPlayers}
                />
            </div>
            <div
                className='absolute inset-0 z-0 bg-cover bg-center'
                style={{
                    backgroundImage: "url('/market/market.png')",
                    transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(18)`,
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundSize: '50% 50%'
                }}
            ></div>

            {isSTXConnected ? (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            left: position.x,
                            top: position.y,
                            width: '95px',
                            height: '158px',
                            backgroundImage: 'url(/user_movement.png)',
                            backgroundPosition: `-${phase * 95}px -${direction * 158}px`,
                            transition: 'left 0.1s, top 0.1s',
                            zIndex: 1
                        }}
                    />
                    {
                        Object.entries(otherPlayers).map(([id, player]) => {
                            if (player.position.x === 0 && player.position.y === 0) return null;
                            return (
                                <div
                                    key={id}
                                    style={{
                                        position: 'absolute',
                                        left: player.position.x + mapOffset.x,
                                        top: player.position.y + mapOffset.y,
                                        width: '95px',
                                        height: '158px',
                                        backgroundImage: 'url(/user_movement.png)',
                                        backgroundPosition: `-${player.phase * 95}px -${player.direction * 158}px`,
                                        transition: 'left 0.1s linear, top 0.1s linear',
                                        zIndex: 1
                                    }}
                                />
                            );
                        })
                    }
                </>
            ) : (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                    <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
                        <CardHeader>
                            <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>Velance</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col space-y-3 text-2xl text-center'>
                            Wallet Not Connected!
                            <Button onClick={connectSTXWallet}>Connect wallet</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div >
    )
}
