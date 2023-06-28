import axios from "axios";
import Cookies from "js-cookie";
import {clearPermissions} from "../store/userPermisions";

export function Logout (dispatch) {
    const token = Cookies.get('x-access-token');
    const headers = {
            'x-access-token': token,
        };
    Cookies.remove('x-access-token');
    localStorage.removeItem("user")
    dispatch(clearPermissions());
    Cookies.set("session", 0)
    axios.get(`${process.env.REACT_APP_API_URL}/api/logout`, {
            headers:headers
        })
            .catch(error => console.log(error))
}