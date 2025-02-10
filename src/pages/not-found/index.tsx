import WrapperSection from '@/components/layout/WrapperSection';
import NotFoundImg from '@/assets/images/notFound.jpg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ROUTES } from '@/configs/constants';
import { Button } from '@/components/common/Button';

export default function NotFoundPage() {
    // hooks
    const { t } = useTranslation();

    return (
        <WrapperSection className='flex-1 flex justify-center items-center'>
            <div className='w-full max-w-xl space-y-6'>
                <img
                    className='w-full rounded-sm '
                    src={NotFoundImg}
                    alt='not-found-image'
                    loading='lazy'
                />

                <h3 className='text-primary text-base font-semibold text-center'>{t('messages.not_found_page')}</h3>

                <div className='flex justify-center'>
                    <Link
                        to={ROUTES.home.href}
                    >
                        <Button>
                            {t('words_title.back_to_home')}
                        </Button>
                    </Link>
                </div>
            </div>
        </WrapperSection>
    );
}
