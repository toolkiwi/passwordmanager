/**
 * Shared CN styles for list components
 */
export default {
    container: 'relative flex-1',
    wrapper: 'p-5 overflow-auto flex-1 h-full max-h-[calc(100vh-175px)]',
    rows_virtualizer: 'relative flex flex-col gap-5',
    list: 'mt-5 flex flex-col gap-4 p-5',
    list_item:
        'h-[100px] cursor-pointer p-5 border border-neutral-900 hover:bg-neutral-900/50 rounded-xl flex flex-row items-center group/li active:bg-neutral-900',
    list_item_content: 'flex-1 flex flex-row items-center',
    text_container: 'flex-1 px-5',
    favicon_container:
        'w-12 h-12 flex items-center justify-center bg-black/80 p-2 border-1 border-neutral-900 rounded-lg',
    favicon: 'w-full h-full rounded-md',
    title: 'text-neutral-200 font-semibold text-md',
    actions: 'flex flex-row items-center gap-2.5 z-10',
    sub_title: 'text-neutral-500 text-sm',
};
