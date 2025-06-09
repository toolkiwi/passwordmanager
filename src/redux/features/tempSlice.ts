import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StateInterface {
    show_sidebar: boolean;
}
const initialState: StateInterface = {
    show_sidebar: false,
};

export const tempSlice = createSlice({
    name: 'temp',
    initialState,
    reducers: {
        setShowSidebar: (
            state: StateInterface,
            action: PayloadAction<StateInterface['show_sidebar']>,
        ) => {
            state.show_sidebar = action.payload;
        },
    },
});

export const { setShowSidebar } = tempSlice.actions;
export default tempSlice.reducer;
