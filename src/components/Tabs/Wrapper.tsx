import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

type VerticalTabProps = {
    vertical: boolean;
    children: React.ReactNode;
    currentTabNumber: number;
    labels: string[];
    handleChange: (e: React.SyntheticEvent, newValue: number) => void;
    ariaLabel?: string;
}

export default function TabWrapper({ vertical, labels, currentTabNumber, handleChange, children, ariaLabel }: VerticalTabProps) {
    const t = useTranslations();
    return (
        <Box
            sx={vertical ? { display: 'flex' } : undefined}
        >
            <Tabs
                orientation={vertical ? "vertical" : "horizontal"}
                value={currentTabNumber}
                onChange={handleChange}
                aria-label={ariaLabel ? ariaLabel : vertical ? "Profile vertical tab" : "Class tab"}
                sx={!vertical ? { p: 0, } : { width: '20%' }}
                TabIndicatorProps={vertical ? { sx: { left: 0 } } : undefined}
            >
                {
                    labels.map((label) =>
                        <Tab label={label} key={`vertical tab ${label}`}
                            sx={!vertical ? { mr: 10, } : undefined}
                            {...a11yProps}
                        />)
                }
                {
                    vertical
                        ? <Button variant='contained' sx={{ mt: 3 }} fullWidth onClick={() => signOut({ callbackUrl: '/'})}>{t('log_out')}</Button>
                        : null
                }
            </Tabs>
                {children}
        </Box>
    );
}
