import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImgModal from "./ProfileImgModal";

const CoverImgModal = ({setModalContent, userObj, setModalNum, profileImg, coverImg}) => {

    return (
        <div className="cover_modal base">
            <div className="base center">
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="base">
                <span className="text1">
                    Prick a header
                </span>
            </div>
            <div className="base">
                <span className="text2">
                    People who visit your profile will see it. Show your style.
                </span>
            </div>

            <div className="base">
                <div className="img_preview base center ">
                    <img className="main_img" src={coverImg === "" ? userObj.photoURL : coverImg} alt="cover_image" /> 
                    <div className="profile_img_back"></div>
                    <label htmlFor="cover-file">
                        <FontAwesomeIcon icon={faCamera} color={"rgb(217, 217, 217)"} size="2x" />
                    </label>
                </div>
                <div className="base sub_img_container">
                    <img className="sub_img" src={profileImg === "" ? userObj.photoURL : profileImg} alt="profile_image" /> 
                    <span className="profile_name">{userObj.displayName}</span>
                    <span className="user_id">{userObj.userId}</span>
                </div>
            </div>

            <button onClick={() =>  {
                setModalNum(1);
                setModalContent(
                    <ProfileImgModal 
                    setModalContent={setModalContent} 
                    userObj={userObj}
                    setModalNum={setModalNum}
                    profileImg={profileImg}
                    coverImg={coverImg}
                />);
            }} >go profile</button>
        </div>
    )
}

export default CoverImgModal; 