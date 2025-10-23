import { createSlice } from "@reduxjs/toolkit";

const initialState={
  items:[],
  status:null
}

const ProductSlice=createSlice({
    name:"Products",
    initialState,
    reducers:{}
})
export default ProductSlice.reducer