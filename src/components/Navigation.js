import { firebaseDB } from "fbase";
import { getUserByUid } from "helpers/auth";
import { useEffect, useState } from "react";
import { withRouter } from "react-router";

const Navigation = withRouter(({match, location}) => {
    // home verify search
    const url = window.location.href.split("/");
    const path = url[url.length-1];
    const [pathName, setPathName] = useState("");
    
    useEffect( () => {
        if(url[4] === "search"){
            firebaseDB.ref('users')
            .orderByChild('uid')
            .equalTo(path)
            .once('value').then(c => {
                const user = c.val()        
                setPathName(user[Object.keys(user)[0]].displayName );
            });
        } else if(url[4] === "nweet"){
            setPathName("트윗")
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
});

export default withRouter(Navigation); 