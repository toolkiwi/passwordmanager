/**
 * Shared CN styles for list components
 */
export default {
    container: 'relative flex-1',
    wrapper: 'p-5 overflow-auto flex-1 h-full',
    rows_virtualizer: 'relative flex flex-col gap-5',
    list: 'mt-5 flex flex-col gap-4 p-5',
    list_item:
        'h-[100px] cursor-pointer p-5 border border-neutral-900 hover:bg-neutral-900/50 rounded-xl flex flex-row items-center group/li active:bg-neutral-900 max-sm:h-[85px]',
    list_item_content: 'flex-1 flex flex-row items-center',
    text_container: 'flex-1 px-5 max-sm:px-4 truncate',
    favicon_container:
        'w-12 h-12 flex items-center justify-center bg-muted/10 p-2 border-1 border-neutral-900 rounded-lg min-w-10 min-h-10',
    favicon: 'w-full h-full rounded-md',
    title: 'text-neutral-200 font-semibold text-md max-sm:text-[15px] truncate',
    actions: 'flex flex-row items-center gap-2.5 z-10 ',
    sub_title: 'text-neutral-500 text-sm',
    footer: 'p-5 flex flex-row items-center gap-5 max-sm:flex-col max-sm:gap-2.5 max-sm:px-0',
};
