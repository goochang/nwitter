import { withRouter } from "react-router";

const Navigation = ({userObj}) => {
    
    const url = window.location.href.split("/");
    const path = url[url.length-1];
    const pathName = path.charAt(0).toUpperCase() + path.slice(1);

    console.log(url)
    return (
        <div className="main_nav base">
            <span>{pathName !== "" ? pathName: "Home" }</span>
        </div>
    )
}

export default withRouter(Navigation); 