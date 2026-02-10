import { SVGAttributes } from 'react';
import logo from '../../../public/assets/images/logo.png';
import { cn } from '@/lib/utils';

export default function AppLogoIcon(props: HTMLImageElement & { className?: string }) {
    return <img src={logo} alt="logo" className={cn('w-72 h-72', props.className)} />;
}
