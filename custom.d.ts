import { ProfileInput } from "@/types/form";
import {
    type DefaultSession,
    type DefaultUser,
} from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & ProfileInput;
    }

    interface User extends DefaultUser, ProfileInput {}
}

type MonochromePalette = {
    five: string;
    four: string;
    three: string;
    two: string;
    one: string;
    main: '#FFF',
}

// Augment the palette to include an monochrome color
declare module '@mui/material/styles' {
    interface Palette {
        monochrome: MonochromePalette;
    }

    interface PaletteOptions {
        monochrome?: MonochromePalette;
    }
}

// Update the Button's color options to include an monochrome option
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        monochrome: true;
    }
}

declare module "ErrorHandler" {
    type APIErrorMessageTypes = {
        type: string;
        message: string;
    }
}