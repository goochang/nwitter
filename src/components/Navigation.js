import { withRouter } from "react-router";

const Navigation = ({userObj, location}) => {
    console.log(location)
    
    const url = window.location.href.split("/");
    const path = url[url.length-1];
    const pathName = path.charAt(0).toUpperCase() + path.slice(1);

    return (
        <div className="main_nav base">
            <span>{pathName !== "" ? (pathName.indexOf("verify") ? "Verify" : pathName): "Home" }</span>
        </div>
    )
}

export default withRouter(Navigation); 