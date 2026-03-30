'use client'

import { createContext } from 'react';
import { SiteSetting } from '@/payload-types';

export const SiteSettingsContext = createContext<SiteSetting['contactSection'] | null>(null);
