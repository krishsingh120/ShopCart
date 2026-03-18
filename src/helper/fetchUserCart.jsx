import axios from "axios";
import { getCartbyUser } from "../apis/fakeStoreProdApi";

async function fetchUserCart(userId, setCart){
    const response = await axios.get(getCartbyUser(userId));
    setCart(response.data[0]);
}
export default fetchUserCart;