import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { ThreeDots, Watch } from 'react-loader-spinner';

export default observer(function LoadingApi() {
    // store
    const { apiStore: { isLoading } } = useStore();

    return (
        isLoading ?
            (
                <div className='fixed flex gap-4 w-screen h-screen top-0 left-0 z-[9999] bg-[#ffffff00] items-center justify-center'>
                    <Watch
                        width={40}
                        height={40}
                        color='#743c1e'
                    />
                    <ThreeDots
                        width={60}
                        height={60}
                        color='#743c1e'
                    />
                </div>
            ) :
            <></>
    );
});
