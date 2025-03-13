import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page() {
  return (
    <div className='relative h-screen'>
      <div className='absolute inset-0 z-0 bg-cover bg-center' style={{ backgroundImage: "url('/home/home.png')" }}></div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
        <Card className='w-[90vw] md:w-[550px] md:px-6 bg-opacity-50 backdrop-blur-lg font-readex'>
          <CardHeader>
            <CardTitle className='text-4xl md:text-5xl text-center tracking-wider'>Velance</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col space-y-3'>
            <Button className='w-full text-lg tracking-wide' asChild>
              <Link href='/learn'>
                Learn
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
