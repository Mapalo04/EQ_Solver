import axios from "axios";
import JWT from "expo-jwt";
import uuid from 'react-native-uuid';
import { getStudentInfo, updatePayment } from "./Index";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";

export const initiatePayment = async(updatePaymentinfo, phoneN, isp) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  

  const timeStamp = T.getTime()/day;
  const paidDate = Math.round(timeStamp);
  
  

    try {
    


      console.log("helo", isp, " numberrrr", phoneN)


const options = {
  method: 'POST',
  url: 'https://api.lenco.co/access/v2/collections/mobile-money',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'c940da4afe84ab10f8807c7f74e683d3b312b454acea23e1611656e65a6cc8f4'
  },
  data: {
    amount: 0.5,
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

console.log("Stuff goes crazy", response.data.data.id)
updatePaymentinfo(paidDate, settle)
    } catch (err) {
        console.error(err)
    }

    
}