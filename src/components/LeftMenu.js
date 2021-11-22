import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCog, faHome, faHashtag, faUser } from "@fortawesome/free-solid-svg-icons";
const LeftMenu = ({}) => {
    return (
        <header>
            <div className="header_main">
                <div className="header_container">
                    <nav>
                        <Link to="/" style={{marginRight: 10}}>
                            <div className="header_content">
                            <FontAwesomeIcon icon={faTwitter} color={"04AAFF"} size="2x" />
                            </div>
                        </Link>
                        <Link to="/login">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHome} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            login
                            </span>
                            </div>
                        </Link>
                        <Link to="/explore">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faHashtag} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Explore
                            </span>
                            </div>
                        </Link>
                        <Link to="/profile">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Profile
                            </span>
                            </div>
                        </Link>
                        <Link to="/setting">
                            <div className="header_content">
                            <FontAwesomeIcon icon={faCog} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Setting
                            </span>
                            </div>
                        </Link>

                    </nav>
                </div>
            </div>
        </header>
    )
}

export default LeftMenu;