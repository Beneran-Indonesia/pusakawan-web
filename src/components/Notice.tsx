// menampilkan informasi penting di halaman

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from "react";

type NoticeBarProps = {
    children: React.ReactNode;
}

export default function NoticeBar({ children }: NoticeBarProps) {
    return (
        <Box bgcolor="yellowgreen" px={2} py={1}>
            <Typography variant="h6">
                {children}
            </Typography>
        </Box>
    )
}