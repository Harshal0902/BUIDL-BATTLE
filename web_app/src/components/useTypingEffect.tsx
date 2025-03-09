/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useEffect, useState } from 'react'

enum Phase {
    Typing,
    Pausing,
}

const typingInterval = 12

export const useTypingEffect = (myService: string[]): { typedMyService: string, selectedMyService: string } => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [typedMyService, setTypedMyService] = useState('');
    const [phase, setPhase] = useState(Phase.Typing);

    useEffect(() => {
        switch (phase) {
            case Phase.Typing:
                {
                    // @ts-ignore
                    const nextTypedMyService = myService[selectedIndex].slice(
                        0,
                        typedMyService.length + 1
                    )

                    if (nextTypedMyService === typedMyService) {
                        setPhase(Phase.Pausing);
                        return;
                    }

                    const timeout = setTimeout(() => {
                        setTypedMyService(nextTypedMyService);
                    }, typingInterval);

                    return () => clearTimeout(timeout);
                }
            case Phase.Pausing:
            default:
                return;
        }
    }, [myService, typedMyService, phase, selectedIndex]);

    // @ts-ignore
    return { typedMyService, selectedMyService: myService[selectedIndex] };
}
