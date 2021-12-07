import { useEffect, useState } from "react";
import { withRouter } from "react-router";

const Navigation = ({userObj, location}) => {
    // home verify search
    const url = window.location.href.split("/");
    const path = url[url.length-1];
    const [pathName, setPathName] = useState("");
    
    useEffect( () => {
        if(url[4] === "search"){
            setPathName("Search");
        } else if(url[4] === "verify"){
            setPathName("Verify");
        } else {
            setPathName(path.charAt(0).toUpperCase() + path.slice(1));
        }
    }, [url, path])


    return (
        <div className="main_nav base">
            <span>{pathName !== "" ? (pathName.indexOf("verify") !== -1 ? "Verify" : pathName): "Home" }</span>
        </div>
    )
}

export default withRouter(Navigation); 