import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const url = "http://localhost:3000";

    // Function to add items to cart
    const addToCart =async (itemId,event) => {

        if (event) {
            event.preventDefault();
        }
    
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token){
            await axios.post(url+"/api/cart/add", {itemId},{headers:{token}});
        }
    };

    // Function to remove items from cart
    const removeFromCart = async (itemId, event) => {
        // Prevent the default behavior if this is a button click
        if (event) {
            event.preventDefault();
        }
    
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if(token){
            await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}});
        } 
    };

    // Function to calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);

                // Ensure itemInfo exists before accessing its properties
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}}); 
            setCartItems(response.data.data);
        }
    

    // Load token from localStorage on component mount
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token")); 
            }
        
        }
        loadData();
    }, []);

    // Context value to be shared with components
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        setToken,
        token,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};
