import axios from "axios";
import { Alert } from "react-native";


export const verifyPayment = async(updatePaidDate,nav , id) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const T = new Date();
  

  const timeStamp = T.getTime()/day;
  const paidDate = Math.round(timeStamp);

    try {



const options = {
  method: 'GET',
  url: 'https://api.lenco.co/access/v2/collections/' + id,
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'c940da4afe84ab10f8807c7f74e683d3b312b454acea23e1611656e65a6cc8f4'
  }
};

 /* const options = {
  method: 'GET',
  url: 'https://api.lenco.co/access/v2/settlements/'+ id,
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'c940da4afe84ab10f8807c7f74e683d3b312b454acea23e1611656e65a6cc8f4'
  }
};  */

const VerifyNotice = () =>
    Alert.alert("Verification Complete:", "Press ok to proceed", [
      { text: "Ok", onPress: () => nav.goBack() },
    ]);

                        

const response = await axios(options);
const settle = response.data.data.status;

console.log("Stuff goes crazy", response.data.data)
if (settle == "successful"){
  updatePaidDate(paidDate)
  VerifyNotice();

} else if (settle == "pay-offline"){
  Alert.alert("Verification Failed: ", "Payment is offline, if you entered the pin correctly then wait a bit and press verify button");
} 
else   {
  Alert.alert("Verification Failed: ", response.data.data.reasonForFailure);
  /* updatePaidDate(paidDate) */
}
    } catch (err) {
        console.error(err)
    }

    
}