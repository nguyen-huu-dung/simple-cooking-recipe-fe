import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/utils/utils';

export default observer(function SidebarToggle() {
    // store
    const {
        uiStore: { isOpenSidebar, setOpenSidebar }
    } = useStore();

    return (
        <div className='invisible lg:visible absolute top-[12px] -right-[16px] z-20'>
            <Button
                onClick={() => setOpenSidebar()}
                className='rounded-md w-8 h-8'
                variant='outline'
                size='icon'
            >
                <ChevronLeft
                    className={cn(
                        'h-4 w-4 transition-transform ease-in-out duration-700',
                        isOpenSidebar === false ? 'rotate-180' : 'rotate-0'
                    )}
                />
            </Button>
        </div>
    );
});
