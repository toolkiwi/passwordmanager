import { HiOutlineFolderOpen } from 'react-icons/hi2';

export default function EmptyList({ title }: { title: string }) {
    return (
        <div className='flex-1 flex flex-col items-center justify-center mb-[95px]'>
            <div className='w-24 h-24 bg-neutral-950 rounded-full flex items-center justify-center mb-5'>
                <HiOutlineFolderOpen size={50} className='text-neutral-700' />
            </div>
            <div className='text-lg font-semibold text-neutral-800'>
                {title}
            </div>
        </div>
    );
}
