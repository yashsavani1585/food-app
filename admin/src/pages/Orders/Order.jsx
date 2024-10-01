import { useState, useEffect } from 'react';
import './order.css';
import axios from 'axios';
import { toast } from "react-toastify";
import { assets } from '../../assets/assets';

const Order = ({ url }) => {
  const [order, setOrder] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrder(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event,orderId) => {
      const response = await axios.post(url+"/api/order/status",{
        orderId,
        status: event.target.value,
      })
      if(response.data.success){
       
        await fetchAllOrders();
        
      }
      else{
        toast.error("Failed to update status");
      }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className='order-list'>
        {order.map((orders, index) => (
          <div key={index} className='order-items'>
            <img src={assets.parcel_icon} alt='Parcel Icon' />
            <div>
             <p className='order-item-food'>
              {orders.items.map((item,index)=>{
                if(index === orders.items.length - 1){
                  return item.name+"X"+item.quantity;

                }else{
                  return item.name+"X"+item.quantity+", ";
                }
              })}
             </p>
             <p className='order-item-name'>
              {orders.address.firstName+" "+orders.address.lastName}

             </p>
             <div className='order-item-address'>
             <p> {orders.address.street+","}
             </p>
             <p>{orders.address.city+", "+orders.address.state+","+orders.address.country+","+orders.address.Zipcode}</p>
             </div>
             <p className='order-item-phone'>
              {orders.address.phone}
             </p>
            </div>
            <p>Items : {orders.items.length}</p>
            <p>${orders.amount}</p>
            <select onChange={(event)=>statusHandler(event,orders._id)} value={orders.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out Of Delivery">Out Of Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
