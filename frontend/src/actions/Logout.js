import axios from "axios";
import Cookies from "js-cookie";

export function Logout () {
    // TODO when logout set seide nav bar to 0
    const token = Cookies.get('x-access-token');
    Cookies.remove("x-access-token")
    localStorage.removeItem("user")
    const headers = {
            'x-access-token': token,
        };
    return(
        axios.get(`${process.env.REACT_APP_API_URL}/api/logout`, {
            headers:headers
        })
            .catch(error => console.log(error))
    );
}