import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog, faHome, faHashtag, faUser } from "@fortawesome/free-solid-svg-icons";
import { authService } from "fbase";

const LeftMenu = ({userObj, logout}) => {
    const history = useHistory();
    
    const onLogoutClick = () => {
        logout();
        authService.signOut();
    }

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
                        { !userObj && (
                        <Link to="/login">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHome} color={"rgb(217, 217, 217)"} size="2x" />
                            <span style={{marginTop: 10}}>
                            login
                            </span>
                            </div>
                        </Link>
                        )}
                        <Link to="/follow">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHashtag} color={"rgb(217, 217, 217)"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Follow
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
                            </Link>
                        )}
                        { userObj && (
                            <span className="logOutBtn" onClick={onLogoutClick}>
                                Log Out
                            </span>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default LeftMenu;