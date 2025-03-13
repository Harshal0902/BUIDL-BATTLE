"use client"

import React, { createContext, useContext } from 'react'
import { connect, disconnect } from '@stacks/connect'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { toast } from 'sonner'

interface STXWalletContextType {
    STXAddress?: string;
    isSTXConnected: boolean;
    connectSTXWallet: () => Promise<void>;
    disconnectSTXWallet: () => Promise<void>;
}

const STXWalletContext = createContext<STXWalletContextType | undefined>(undefined);

export const STXWalletProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    const [STXAddress, setSTXAddress] = useLocalStorage<string>('STXAddress');

    const isSTXConnected = !!STXAddress;

    const connectSTXWallet = async () => {
        try {
            const response = await connect();
            const paymentAddressItem = response.addresses.find(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                (address) => address.purpose === 'stacks'
            );
            setSTXAddress(paymentAddressItem?.address);
            toast.success('Wallet connected successfully!')
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Wallet connection failed!');
        }
    };

    const disconnectSTXWallet = async () => {
        try {
            disconnect();
            setSTXAddress(undefined);
            toast.success('Wallet disconnected successfully!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Wallet disconnection failed!');
        }
    };

    return (
        <STXWalletContext.Provider value={{
            STXAddress,
            isSTXConnected,
            connectSTXWallet,
            disconnectSTXWallet
        }
        }>
            {children}
        </STXWalletContext.Provider>
    );
};

export const useSTXWallet = () => {
    const context = useContext(STXWalletContext);
    if (!context) {
        throw new Error('useSTXWallet must be used within a STXWalletProvider');
    }
    return context;
};
