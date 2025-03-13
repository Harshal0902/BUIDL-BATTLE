"use client"

import React from 'react'
import { Map, Menu, CircleHelp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LearnMenu() {
    return (
        <div className='backdrop-blur-xl rounded-md px-6 py-1'>
            <div className='flex flex-row space-x-3 items-center justify-center'>
                <div>
                    <Dialog>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <DialogTrigger className='pt-1.5'>
                                        <Map className='text-white' />
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='tracking-wide'>View Map</p>
                                </TooltipContent>
                            </Tooltip>
                            <DialogContent className='max-w-[80vw] md:max-w-[60vw]'>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl tracking-wider'>View Map</DialogTitle>
                                    <DialogDescription>
                                        <Image src='/learn/learn.png' width='756' height='756' alt='map' className='w-full mt-4 rounded' />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </TooltipProvider>
                    </Dialog>
                </div>
                <div>
                    <Dialog>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <DialogTrigger className='pt-1.5'>
                                        <CircleHelp className='text-white' />
                                    </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='tracking-wide'>Help</p>
                                </TooltipContent>
                            </Tooltip>
                            <DialogContent className='max-w-[80vw] md:max-w-[60vw]'>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl tracking-wider'>Help</DialogTitle>
                                    <DialogDescription className='flex flex-col space-y-3 tracking-widest max-h-[60vh] overflow-auto'>
                                        <div className='flex flex-col space-y-2'>
                                            <div className='font-semibold'>How to control user?</div>
                                            <div>
                                                <div>1. Use your keyboard arrow keys to move the player.</div>
                                                <div>2. You can also use A, W, S, D to control player movements.</div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2'>
                                            <div className='font-semibold'>What is &apos;Learn&apos;?</div>
                                            <div>
                                                The Learn page helps you understand how to interact with the app. Whether you&apos;re a new user or completely new to blockchain, you can come here to learn about the Stacks chain and how to interact with it.
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2'>
                                            <div className='font-semibold'>What is &apos;Escape Room&apos; and how to enter?</div>
                                            <div>
                                                The Escape Room is a virtual world full of riddles and challenges. You can play alone or with your squad to earn an exclusive NFT upon completion.
                                                <div className='flex flex-col space-y-1 pl-2'>
                                                    <div>- Invite other players by sending them the invite link located at the top-left corner of the page.</div>
                                                    <div>- Solve the puzzles and complete the Escape Room.</div>
                                                    <div>- Once you finish, you can mint your exclusive NFT as a reward.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2'>
                                            <div className='font-semibold'>What is &apos;Marketplace&apos;?</div>
                                            <div>
                                                The Marketplace is a place to socialize, buy/sell NFTs, STX, and other tokens with other users.
                                                <div className='flex flex-col space-y-1 pl-2'>
                                                    <div>- Global Market: Interact and trade with all players.</div>
                                                    <div>- Private Market: Join a market using an invite link for exclusive trading.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </TooltipProvider>
                    </Dialog>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger className='pt-1.5'>
                            <Menu className='text-white' />
                        </DialogTrigger>
                        <DialogContent className='max-w-[80vw] md:max-w-[20vw]'>
                            <DialogHeader>
                                <DialogTitle className='text-2xl tracking-wider'>Menu</DialogTitle>
                                <DialogDescription className='flex flex-col space-y-3 tracking-widest max-h-[60vh] overflow-auto'>
                                    <Button className='w-full text-lg tracking-wide' asChild>
                                        <Link href='/'>
                                            Home
                                        </Link>
                                    </Button>
                                    <Button className='w-full text-lg tracking-wide' asChild>
                                        <Link href='/escape-room'>
                                            Enter Escape Room
                                        </Link>
                                    </Button>
                                    <Button className='w-full text-lg tracking-wide' asChild>
                                        <Link href='/market'>
                                            Marketplace
                                        </Link>
                                    </Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
