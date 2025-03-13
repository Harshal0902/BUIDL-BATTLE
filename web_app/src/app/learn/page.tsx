"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTypingEffect } from '@/components/useTypingEffect'
import LearnMenu from '@/components/LearnMenu'
import { useSTXWallet } from '@/context/StxContext'
import { request } from 'sats-connect'
import { request as request2 } from '@stacks/connect'
import { toast } from 'sonner'
import { HeartHandshake } from 'lucide-react'

export default function Page() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(0);
    const [phase, setPhase] = useState(0);
    const [showCard, setShowCard] = useState(true);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [showHeartCard, setShowHeartCard] = useState(false);

    const { isSTXConnected, connectSTXWallet, disconnectSTXWallet } = useSTXWallet();

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

    const welcomeText = '🎉 Welcome to Velance! Learn how to interact with the app here. Use your keyboard arrow keys to move the player. You can also use A, W, S, D to control player movements.';
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
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'A', 'w', 'W', 's', 'S', 'd', 'D'].includes(e.key)) {
                return;
            }

            const step = 10;
            let newX = position.x;
            let newY = position.y;
            let newDirection = direction;
            let newPhase = phase;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    newX = position.x - step;
                    newDirection = 1;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    newX = position.x + step;
                    newDirection = 2;
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    newY = position.y - step;
                    newDirection = 3;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    newY = position.y + step;
                    newDirection = 0;
                    break;
            }

            if (!isCellBlocked(newX, newY)) {
                newPhase = (phase + 1) % 11;
                setDirection(newDirection);
                setPhase(newPhase);
                setPosition({ x: newX, y: newY });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    const signMessage = async () => {
        try {
            const message = 'This is a message';
            const response = await request('stx_signMessage', {
                message: message,
                publicKey: 'testing',
                parameterFormatVersion: 1
            });
            if (response.status === 'success') {
                toast.success('Signed message successfully!');
            } else {
                toast.error('Error signing message');
            }
            return response;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error signing message: ${error.message}`);
            } else {
                toast.error('Error signing message');
            }
        }
    }

    const sendSTX = async () => {
        const recipient = 'STXDTNZM0KRJZ7Q7ZPAW18P5Q6SGPVGJTV7V5NBX';
        const amount = '1000';

        try {
            const response = await request2('stx_transferStx', {
                amount: amount,
                recipient: recipient,
                network: 'testnet',
                // memo: 'A demo STX transaction on Stacks testnet'
            });
            if ('txid' in response) {
                toast.success('Transfer STX was successful!')
            } else {
                toast.error('Error sending transaction');
            }
        } catch {
            toast.error('Error sending transaction');
        }
    }

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

    const handleHeartClick = () => {
        setShowHeartCard(true);
    };

    const handleCloseHeartCard = () => {
        setShowHeartCard(false);
    };

    return (
        <div className='relative h-screen w-screen overflow-hidden'>
            <div className='absolute inset-0 z-0 bg-cover bg-center' style={{ backgroundImage: "url('/learn/learn.png')" }}></div>
            <div className='absolute top-4 right-4 z-10'>
                <LearnMenu />
            </div>
            <div className='absolute top-20 right-4 flex flex-col space-y-4'>
                {isSTXConnected ?
                    <Button variant='destructive' onClick={disconnectSTXWallet}>Disconnect Wallet</Button>
                    :
                    <Button className='text-white tracking-wider text-center' onClick={connectSTXWallet}>
                        Connect Wallet
                    </Button>
                }
                <Button className='text-white tracking-wider text-center' onClick={signMessage}>
                    Sign Message
                </Button>
                <Button className='text-white tracking-wider text-center' onClick={sendSTX}>
                    Send Transaction
                </Button>
            </div>
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
                    <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg'>
                        <CardHeader>
                            <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>Velance</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col space-y-3'>
                            <div className='tracking-wider text-center'>{typedMyService}</div>
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

            <div className='absolute bottom-12 left-6 backdrop-blur-xl'>
                <HeartHandshake
                    className='h-10 w-10 cursor-pointer hover:scale-110 transition-transform'
                    onClick={handleHeartClick}
                />
            </div>

            {showHeartCard && (
                <div className='absolute bottom-24 left-6 z-10'>
                    <Card className='w-[300px] md:w-[400px] bg-opacity-50 backdrop-blur-lg tracking-wider'>
                        <CardHeader>
                            <CardTitle className='text-xl tracking-wider'>New user?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <p>Are you new to Stacks or blockchain? No worries-we&apos;ve got you covered! Follow the steps below to familiarize yourself with the Stacks blockchain.</p>
                                <div>
                                    <p>1. Connect Your Wallet</p>
                                    <ul className='pl-4 list-disc'>
                                        <li>Click the first button at the top-right corner to connect or disconnect your wallet.</li>
                                    </ul>
                                </div>
                                <div>
                                    <p>2. Sign a Message</p>
                                    <ul className='pl-4 list-disc'>
                                        <li>Click the second button to sign a message.</li>
                                        <li>This can be used to authenticate ownership of an address or to signal a decision (e.g., agreeing to Terms of Service).</li>
                                    </ul>
                                </div>
                                <div>
                                    <p>3. Send a Transaction</p>
                                    <ul className='pl-4 list-disc'>
                                        <li>Click the second button to sign a message.</li>
                                        <li>Click the third button to send a transaction (e.g., transferring STX from your account to another recipient).</li>
                                    </ul>
                                </div>
                            </div>
                            <Button
                                className='mt-4 w-full'
                                onClick={handleCloseHeartCard}
                            >
                                Close
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
