import { createSlice } from "@reduxjs/toolkit";


const formSlice = createSlice({
    name: "formData",
    initialState: {
        generalDetailData: {},
        promotionData: {},
        verifyTokenData: {},
    },
    reducers: {
        updateGeneralDetailPageData: (state, action) => {
            state.generalDetailData = action.payload;
        },
        updatePromotionPageData: (state, action) => {
            state.promotionData = action.payload;
        },
        updateVerifyTokenPageData: (state, action) => {
            state.verifyTokenData = action.payload;
        },
    }

})

export const { updateGeneralDetailPageData, updatePromotionPageData, updateVerifyTokenPageData } = formSlice.actions;
export default formSlice.reducer;
