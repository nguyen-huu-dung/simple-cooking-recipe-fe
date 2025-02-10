import { cn } from '@/utils/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

interface FooterProps {
    className?: string
}

export default function Footer({ className }: FooterProps) {
    // hooks
    const { t } = useTranslation('translation', { keyPrefix: 'footer' });

    return (
        <footer className='w-full h-16 bg-background shadow backdrop-blur flex items-center'>
            <div className={cn('flex items-center gap-1 text-muted-foreground flex-wrap', className)}>
                <span>{t('description')}</span>
                <Link
                    to='https://react.dev'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-4'
                >
                    React
                </Link>
                <Link
                    to='https://www.typescriptlang.org'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-4'
                >
                    TypeScript
                </Link>
                <Link
                    to='https://tailwindcss.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-4'
                >
                    TailwindCSS
                </Link>
                <Link
                    to='https://ui.shadcn.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-4'
                >
                    shadcn/ui
                </Link>
                <Link
                    to='https://mobx.js.org/README.html'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium underline underline-offset-4'
                >
                    Mobx
                </Link>
            </div>
        </footer>
    );
}
