import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name:'user',
    initialState:{
        user:null,
    },
    reducers:{
        setUser(state,action){
            const userData = action.payload;
            // const userData = JSON.parse(userInfo)
            if(userData){
                state.user = action.payload || null;
            }  
            else{
                state.user = null;
            }
        },
        addPost(state,action){
            
        },
        deletePost(state,action){
            
        },
        clearUserProfile(state) {
            state.user = null;
        },
    }
})

export const {setUser,clearUserProfile} = userSlice.actions;


export default userSlice.reducer;