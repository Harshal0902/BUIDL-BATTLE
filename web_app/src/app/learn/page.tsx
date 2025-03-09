"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTypingEffect } from '@/components/useTypingEffect'

export default function Page() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(0);
    const [phase, setPhase] = useState(0);
    const velocity = useRef({ x: 0, y: 0 });
    const [showCard, setShowCard] = useState(true);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [usedKeys, setUsedKeys] = useState(new Set<string>());
    const [showCongrats, setShowCongrats] = useState(false);

    const speed = 150;

    const blockedCells = new Set([
        '0-0', '1-0', '1-1', '0-1', '0-2', '1-2', '0-3', '1-3', '0-4', '1-4', '2-4',
        '0-5', '1-5', '2-5', '3-5', '3-6', '2-6', '1-6', '0-6', '2-7', '1-7', '0-7',
        '3-7', '3-6', '3-5', '4-5', '6-5', '6-6', '6-7', '7-7', '7-6', '7-5', '8-5',
        '9-5', '9-6', '10-7', '10-6', '11-6', '11-7', '11-5', '12-5', '12-6', '12-7',
        '13-7', '14-7', '15-7', '15-6', '14-6', '13-6', '13-5', '14-5', '15-5', '15-4',
        '14-4', '13-4', '13-3', '14-3', '15-3', '15-2', '14-2', '13-2', '13-1', '14-1',
        '15-1', '14-0', '13-0', '12-0', '11-0', '10-0', '9-0', '8-0', '7-0', '6-0',
        '5-0', '3-0', '3-1', '3-2'
    ]);

    const isCellBlocked = (x: number, y: number) => {
        const cellSize = 100;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        return blockedCells.has(`${cellX}-${cellY}`);
    };

    const welcomeText = 'Welcome to APP NAME! Learn how to interact with the app here!';
    const { typedMyService } = useTypingEffect([welcomeText]);

    useEffect(() => {
        if (typedMyService === welcomeText) {
            setButtonEnabled(true);
        }
    }, [typedMyService]);

    useEffect(() => {
        const centerX = window.innerWidth / 2 - 47.5;
        const centerY = window.innerHeight / 2 - 79;
        setPosition({ x: centerX, y: centerY });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const step = 10;
            let newX = position.x;
            let newY = position.y;

            setUsedKeys(prev => new Set(prev).add(e.key));

            switch (e.key) {
                case 'ArrowLeft':
                    newX = position.x - step;
                    setDirection(1);
                    velocity.current.x = -speed;
                    break;
                case 'ArrowRight':
                    newX = position.x + step;
                    setDirection(2);
                    break;
                case 'ArrowUp':
                    newY = position.y - step;
                    setDirection(3);
                    break;
                case 'ArrowDown':
                    newY = position.y + step;
                    setDirection(0);
                    break;
            }

            if (!isCellBlocked(newX, newY)) {
                setPosition({ x: newX, y: newY });
                setPhase(prev => (prev + 1) % 11);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    // Check if all arrow keys have been used
    useEffect(() => {
        if (usedKeys.has('ArrowLeft') && usedKeys.has('ArrowRight') &&
            usedKeys.has('ArrowUp') && usedKeys.has('ArrowDown')) {
            setShowCongrats(true);
        }
    }, [usedKeys]);

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

    const handleGetStarted = () => {
        setShowCard(false);
    };

    return (
        <div className='relative h-screen w-screen overflow-hidden'>
            <div className='absolute inset-0 z-0 bg-cover bg-center' style={{ backgroundImage: "url('/learn/learn.png')" }}></div>
            {/* {renderGrid()} */}
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
            {showCard && (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                    <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
                        <CardHeader>
                            <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>APP NAME</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col space-y-3'>
                            <div className='tracking-wider'>{typedMyService}</div>
                            <Button
                                onClick={handleGetStarted}
                                disabled={!buttonEnabled}
                            >
                                Get started!
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {!showCard && !showCongrats && (
                <div className='absolute bottom-4 right-4 z-10'>
                    <Card className='w-[300px] bg-opacity-50 backdrop-blur-lg font-readex'>
                        <CardContent className='p-4'>
                            <div className='text-sm tracking-wider'>
                                Use your keyboard arrow keys to move player
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {showCongrats && (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                    <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
                        <CardContent className='p-6'>
                            <div className='text-lg tracking-wider text-center'>
                                Congratulations on taking your first steps!<br />
                                Now, to get familiar with the platform, let&apos;s start with some basics.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
