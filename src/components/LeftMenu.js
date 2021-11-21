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
                            <div>
                            <FontAwesomeIcon icon={faTwitter} color={"04AAFF"} size="2x" />
                            </div>
                        </Link>
                        <Link to="/">
                            <div>
                            <FontAwesomeIcon icon={faHome} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Home
                            </span>
                            </div>
                        </Link>
                        <Link to="/explore">
                            <div>
                            <FontAwesomeIcon icon={faHashtag} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Explore
                            </span>
                            </div>
                        </Link>
                        <Link to="/profile">
                            <div>
                            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
                            <span style={{marginTop: 10}}>
                            Profile
                            </span>
                            </div>
                        </Link>
                        <Link to="/setting">
                            <div>
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