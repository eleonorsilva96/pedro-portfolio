import { Quicksand, Open_Sans, Lemon, Mulish, Special_Elite } from 'next/font/google';

export const quicksand = Quicksand({ 
    subsets: ['latin'],
    variable: '--font-quicksand' 
});

export const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-opensans'
});

export const lemon = Lemon({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-lemon'
});

export const mulish = Mulish({
    subsets: ['latin'],
    variable: '--font-mulish'
});

export const specialElite = Special_Elite({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-special'
})
