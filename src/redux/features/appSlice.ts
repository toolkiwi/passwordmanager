import { AppInterface } from '@/interfaces/AppInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppInterface.State = {
    unlocked: false,
    unsaved: false,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUnlocked: (state: AppInterface.State, action: PayloadAction<AppInterface.State['unlocked']>) => {
            state.unlocked = action.payload;
        },
        setUnsaved: (state: AppInterface.State | null, action: PayloadAction<AppInterface.State['unsaved']>) => {
            if (!state) return;
            state.unsaved = action.payload;
            return state;
        },
    },
});

export const { setUnlocked, setUnsaved } = appSlice.actions;
export default appSlice.reducer;
