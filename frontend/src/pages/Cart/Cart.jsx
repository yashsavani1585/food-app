import { useContext } from 'react';
import './cart.css';
import { StoreContext } from '../../context/StoreContext';

import { useNavigate } from'react-router-dom';

const Cart = () => {
  const { food_list, cartItems, removeFromCart,getTotalCartAmount,url } = useContext(StoreContext);
  const navigate = useNavigate()

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-item-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-item-title cart-item-item'>
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p className='cross' onClick={() => removeFromCart(item._id)}>X</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <p>Delivery fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
            </div>
         
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className='cart-promoCode'>
          <div>
            <p>If you have a promo code,Enter it here</p>
            <div className='cart-promoCode-input'>
                <input type='text' placeholder='promo code' />
                <button>submit</button>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}

export default Cart;
