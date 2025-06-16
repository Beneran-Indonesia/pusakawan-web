import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useDesktopRatio } from '@/lib/hooks';

type ClassAccordionProps = {
    id: number; 
    title: string; 
    children: React.ReactNode; 
    isModule: boolean;
    isPostTest?: boolean;
}

export default function ClassAccordion({ id, title, children, isModule, isPostTest = false }: ClassAccordionProps) {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <Accordion expanded={expanded === `panel${id}`} sx={{ boxShadow: 1 }} disableGutters
            onChange={handleChange(`panel${id}`)} key={`accordion${id}`}>
            <AccordionTitle isModule={isModule} isPostTest={isPostTest} id={id}>{title}</AccordionTitle>
            <AccordionDetail>{children}</AccordionDetail>
        </Accordion>
    );
}
function AccordionTitle({ id, children, isModule, isPostTest = false }: { 
    id: number; 
    isModule: boolean; 
    isPostTest?: boolean;
    children: string 
}) {
    const isDesktopRatio = useDesktopRatio();
    return <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${id}bh-content`}
        id={`panel${id}bh-header`}
        sx={{ py: 1, px: 2 }}
    >
        <Box component="span" sx={{ width: isDesktopRatio ? '3%' : "12%", flexShrink: 0 }}>
            {
                isPostTest ? 
                    <LightbulbOutlinedIcon /> : 
                isModule
                    ? <InsertDriveFileIcon />
                    : <TextSnippetIcon />
            }
        </Box>
        <Typography variant='h5' component='h5' fontWeight={500}>
            {children}
        </Typography>
    </AccordionSummary>
}

function AccordionDetail({ children }: { children: React.ReactNode }) {
    return <AccordionDetails sx={{ px: 6, background: 'white' }}>
        {children}
    </AccordionDetails>
}