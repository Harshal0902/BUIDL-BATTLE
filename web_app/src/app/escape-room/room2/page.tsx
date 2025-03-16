/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState, useEffect } from 'react'
import { useSTXWallet } from '@/context/StxContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Room2Menu from '@/components/Room2Menu'
import { request } from '@stacks/connect'

const riddles = [
    {
        riddle: `I light up the dark but I'm not the sun, I stand in a corner but help everyone. Flip a switch, and I will glow, Guiding your way with a gentle show.`,
        ans: 'Lamp',
        ansBlock: ['9-5', '8-5']
    },
    {
        riddle: `I have no feet, but I can move, Open me up, and you can prove. I lead to places new and old, With just a turn, my secrets unfold.`,
        ans: 'Door',
        ansBlock: ['7-5', '6-5', '5-5', '4-5']
    },
    {
        riddle: `I wave high for all to see, A symbol of strength and unity. Colors and words, I proudly display, Guiding the way, come what may.`,
        ans: 'Banner',
        ansBlock: ['12-1', '13-1', '13-2', '12-2']
    },
    {
        riddle: `I dance and flicker but have no feet, I bring you warmth and cook your meat. But beware, for if I grow wild, I can destroy in a manner not mild.`,
        ans: 'Fire',
        ansBlock: ['5-0', '4-0', '3-0', '2-0']
    }
]

export default function Page() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(0);
    const [phase, setPhase] = useState(0);
    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
    const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
    const [allRiddlesAnswered, setAllRiddlesAnswered] = useState(false);
    const [claimNFT, setClaimNFT] = useState(false);
    const boundaryThreshold = 64;

    const { isSTXConnected, connectSTXWallet } = useSTXWallet();

    const blockedCells = new Set([
        // '0-0',
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
        // @ts-ignore
        return blockedCells.has(`${cellX}-${cellY}`);
    };

    const checkRiddleAnswer = () => {
        const cellSize = 100;
        const cellX = Math.floor(position.x / cellSize);
        const cellY = Math.floor(position.y / cellSize);
        const currentCell = `${cellX}-${cellY}`;

        // console.log('Current Cell:', currentCell);

        const currentRiddle = riddles[currentRiddleIndex];
        // @ts-ignore
        if (currentRiddle.ansBlock.includes(currentCell)) {
            // @ts-ignore
            toast.success(`Correct answer! ${currentRiddle.ans}`);
            if (currentRiddleIndex < riddles.length - 1) {
                setCurrentRiddleIndex(currentRiddleIndex + 1);
            } else {
                toast.success('Answered all riddles!');
                setAllRiddlesAnswered(true);
            }
        }
    };

    useEffect(() => {
        const centerX = window.innerWidth / 2 - 47.5;
        const centerY = window.innerHeight / 2 - 79;
        setPosition({ x: centerX, y: centerY });
    }, []);

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

    useEffect(() => {
        checkRiddleAnswer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    // const handleCellClick = (x: number, y: number) => {
    //     console.log(`Clicked cell: (${x}, ${y})`);
    // };

    // const renderGrid = () => {
    //     if (typeof window === 'undefined') return null;

    //     const grid = [];
    //     const cellSize = 100;
    //     const columns = Math.ceil(window.innerWidth / cellSize);
    //     const rows = Math.ceil(window.innerHeight / cellSize);

    //     for (let y = 0; y < rows; y++) {
    //         for (let x = 0; x < columns; x++) {
    //             grid.push(
    //                 <div
    //                     key={`${x}-${y}`}
    //                     style={{
    //                         position: 'absolute',
    //                         left: x * cellSize,
    //                         top: y * cellSize,
    //                         width: cellSize,
    //                         height: cellSize,
    //                         border: '1px solid rgba(255,255,255,0.2)',
    //                         boxSizing: 'border-box',
    //                         cursor: 'pointer'
    //                     }}
    //                     onClick={() => handleCellClick(x, y)}
    //                 />
    //             );
    //         }
    //     }
    //     return grid;
    // };

    const ClaimNFT = async () => {
        setClaimNFT(true);
        const response = await request('stx_callContract', {
            contract: 'STXDTNZM0KRJZ7Q7ZPAW18P5Q6SGPVGJTV7V5NBX.valance-escape-room-nft',
            functionName: 'claim',
            network: 'testnet',
        });
        if (response.txid) {
            toast.success('NFT claimed successfully!');
        } else {
            toast.error('Failed to claim NFT');
        }
        setClaimNFT(false);
    };

    return (
        <div className='relative h-screen w-screen overflow-hidden'>
            <div className='absolute top-4 right-4 z-10'>
                <Room2Menu
                    position={position}
                    mapOffset={mapOffset}
                />
            </div>
            <div
                className='absolute inset-0 z-0 bg-cover bg-center'
                style={{
                    backgroundImage: "url('/escape-room/room2.png')",
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                }}
            ></div>

            {/* {renderGrid()} */}

            {isSTXConnected ? (
                <>
                    {allRiddlesAnswered ? (
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                            <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
                                <CardHeader>
                                    <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>Congratulations!</CardTitle>
                                </CardHeader>
                                <CardContent className='flex flex-col items-center justify-center space-y-3 text-2xl text-center'>
                                    You have answered all the riddles! Now you can clain your NFT!
                                    <Button onClick={ClaimNFT} disabled={claimNFT}>Min NFT</Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
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
                            <div className='absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg'>
                                <h2 className='text-lg font-bold'>Riddle:</h2>
                                {/* @ts-ignore */}
                                <p>{riddles[currentRiddleIndex].riddle}</p>
                            </div>
                        </>
                    )}
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
