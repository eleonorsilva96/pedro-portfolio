'use client';

import { useEffect } from "react"


export const useScrollLock = (element: boolean) => {
    useEffect(() => {
        // remove scroll from body if element/modal shows up
        if (element) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // reset when component unmounts 
        return () => {
            document.body.style.overflow = '';
        };

    }, [element]) // re-run
}

export const formatPhoneNumber = (number: string) => {
    return number.replace(/\s+/g, "");
}

export const saveScrollPosition = () => {
    sessionStorage.setItem("projectScrollPos", window.scrollY.toString());
};