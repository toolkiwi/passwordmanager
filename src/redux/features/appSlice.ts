import { AppInterface } from '@/interfaces/AppInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppInterface.State = {
    unlocked: false,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUnlocked: (state: AppInterface.State, action: PayloadAction<AppInterface.State['unlocked']>) => {
            state.unlocked = action.payload;
        },
    },
});

export const { setUnlocked } = appSlice.actions;
export default appSlice.reducer;
