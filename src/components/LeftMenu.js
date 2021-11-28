import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog, faHome, faHashtag, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { authService } from "fbase";

const LeftMenu = (userObj) => {
    const history = useHistory();
    
    const onLogoutClick = () => {
        authService.signOut();
        history.push("/");
    }
    useEffect(() => {
        // if(!userObj){
        //     onLogoutClick()
        // }
    }, );
    return (
        <header>
            <div className="header_main">
                <div className="header_container">
                    <nav>
                        <Link to="/" style={{marginRight: 10}}>
                            <div className="header_content">
                            <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHome} color={"rgb(217, 217, 217)"} size="2x" />
                            <span style={{marginTop: 10}}>
                            login
                            </span>
                            </div>
                        </Link>
                        <Link to="/explore">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHashtag} color={"rgb(217, 217, 217)"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Explore
                            </span>
                            </div>
                        </Link>
                        <Link to="/setting">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faCog} color={"rgb(217, 217, 217)"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Setting
                            </span>
                            </div>
                        </Link>

                        { userObj && (
                            <Link to="/profile">
                                <div className="header_content">
                                <FontAwesomeIcon icon={faUser} color={"rgb(217, 217, 217)"} size="2x" />
                                <span style={{marginTop: 10}}>
                                Profile
                                </span>
                                </div>
                            </Link>,
                            <span className="logOutBtn" onClick={onLogoutClick}>
                                Log Out
                            </span>
                        )
                        }
                    </nav>

                    
                </div>
            </div>
        </header>
    )
}

export default LeftMenu;