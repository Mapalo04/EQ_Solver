import axios from "axios";
import uuid from 'react-native-uuid';


export const initiatePayment = async(updatePaymentId, setPaying, phoneN, isp, price = 0.5) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  

  const timeStamp = T.getTime()/day;
  const paidDate = Math.round(timeStamp);
  
  

    try {



const options = {
  method: 'POST',
  url: 'https://api.lenco.co/access/v2/collections/mobile-money',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'c940da4afe84ab10f8807c7f74e683d3b312b454acea23e1611656e65a6cc8f4'
  },
  data: {
    amount: price,
    reference: String(uuid.v4()),
    phone: phoneN,
    operator: isp,
    country: 'zm',
    bearer: 'customer'
  }
};

/* const options = {
  method: 'GET',
  url: 'https://api.lenco.co/access/v2/settlements/da5084eb-770c-4c3a-9dad-9d5f4ed7d99c',
  headers: {
    accept: 'application/json',
    Authorization: 'c940da4afe84ab10f8807c7f74e683d3b312b454acea23e1611656e65a6cc8f4'
  }
}; */



                        

const response = await axios(options);
const settle = response.data.data.id;

console.log("Stuff goes crazy", response.data.data.status)
console.log("paying calll ", settle);
updatePaymentId(settle)
setPaying(true);
    } catch (err) {
        console.error(err)
    }

    
}