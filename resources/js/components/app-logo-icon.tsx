import { SVGAttributes } from 'react';
import logo from '../../../public/assets/images/logo.png';
import { cn } from '@/lib/utils';

export default function AppLogoIcon(props: HTMLImageElement & { className?: string }) {
    return (
        <>
            <img src={logo} alt="logo" className={cn('w-72 h-72', props.className)} />
            <div className="flex flex-col text-sm font-serif">
                {/* <span className=" font-bold">Club </span> */}
                <span className=" font-bold">Tihad</span>
                <span className=" font-bold">Azemmour</span>
                {/* <span className=" font-bold">Women</span> */}
            </div>
        </>
    )
}
