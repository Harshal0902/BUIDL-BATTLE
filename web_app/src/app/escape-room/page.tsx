import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
    return (
        <div className='relative h-screen'>
            <div className='absolute inset-0 z-0 bg-cover bg-center' style={{ backgroundImage: "url('/home/home.png')" }}></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                <Card className='w-[90vw] md:w-[60vw] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
                    <CardHeader>
                        <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>Escape Room</CardTitle>
                        <CardDescription className='text-center text-lg tracking-wider'>Enter the Escape Room of your choice and solve it to earn a Limited Edition NFT as a reward.</CardDescription>
                    </CardHeader>
                    <CardContent className='grid grid-cols-2 gap-4 items-center justify-center'>
                        <div className='col-span-1'>
                            <Link href='/escape-room/room1'>
                                <Image src='/escape-room/room1.png' alt='room1' width='355' height='755' className='rounded' />
                            </Link>
                        </div>

                        <div className='col-span-1'>
                            <Link href='/escape-room/room2'>
                                <Image src='/escape-room/room2.png' alt='room1' width='355' height='755' className='rounded' />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
