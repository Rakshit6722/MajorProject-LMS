import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


const initialState = {
    cart:localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[],
    total:localStorage.getItem("total")?JSON.parse(localStorage.getItem("total")):null,
    totalItems:localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem("totalItems")):0
}

const cartSlice = createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        addToCart(state,action){
            const course = action.payload
            const index = state.cart.findIndex((item)=>item._id === course._id)

            //if the course is already in the cart, do not modigy the quantity
            if(index>=0){
                toast.error("Course already in the cart")
                return
            }

            //push the course in the cart arr if not present
            state.cart.push(course)

            //increment totalItems
            state.totalItems++;
            //update the total price in the cart
            state.total += course.price;

            //update the localStorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

            toast.success("Course added to Cart")

        },
        removeFromCart(state,action){
            const course = action.payload
            const index = state.cart.findIndex((item)=>item._id === course._id)

            //if course is found remove it
            if(index>=0){
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index,1)

                //update localStorage
                localStorage.setItem("cart",JSON.stringify(state.cart))
                localStorage.setItem("total",JSON.stringify(state.total))
                localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

                toast.success("Course removed from cart")
            }
        },
        resetCart(state,action){
            state.cart = []
            state.total = 0
            state.totalItems = 0

            //update local storage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        }
    }
})

export const {addToCart,removeFromCart,resetCart} = cartSlice.actions
export default cartSlice.reducer