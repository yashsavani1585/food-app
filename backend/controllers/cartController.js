import userModel from '../models/userModel.js';

// // add to cart

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ message: "Item added to cart successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });

    }
}


// remove items

const removeFromCart = async (req, res) => {
try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId]>0) {
        cartData[req.body.itemId] -= 1;

    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ message: "Item removed from cart successfully" });
}
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });

    }

}

// fetch user cart data 

const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, data: userData.cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });

}
}

export { addToCart, getCart, removeFromCart}