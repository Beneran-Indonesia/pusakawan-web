import { Poppins } from 'next/font/google';

const PoppinsFont = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], preload: false });

export { PoppinsFont };