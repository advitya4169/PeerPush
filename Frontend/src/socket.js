import {io} from "socket.io-client";
const socket = io(`${import.meta.env.VITE_API_URL}`,{
    autoConnect:true
});
export default socket;