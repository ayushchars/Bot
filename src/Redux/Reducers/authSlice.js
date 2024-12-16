import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    language: {}, 
    languageByDate: {},
    lastResult : {}
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.token = action.payload;
        },
        seveUser: (state, action) => {
            state.user = action.payload;
        },
        saveResult: (state, action) => {
            state.lastResult = action.payload;
        },
        savelanguage: (state, action) => {
            const { language, attempt, correct } = action.payload;
            const today = new Date().toISOString().split("T")[0];
            if (state.language[language]) {
                state.language[language].attempt += attempt;
                state.language[language].correct += correct;
            } else {
                state.language[language] = { attempt, correct };
            }
            if (!state.languageByDate[language]) {
                state.languageByDate[language] = {};
            }

            if (state.languageByDate[language][today]) {
                state.languageByDate[language][today].attempt += attempt;
                state.languageByDate[language][today].correct += correct;
            } else {
                state.languageByDate[language][today] = { attempt, correct };
            }
        },
        logout: (state, action) => {
            state.user = {};
            state.token = "";
            state.language = {};
            state.languageByDate = {};
            localStorage.removeItem("token");
        },
    },
});

export const { setAccessToken, seveUser, logout, savelanguage,saveResult } = authSlice.actions;

export default authSlice.reducer;
