import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CoverImgModal from "./CoverImgModal";

const ProfileImgModal = ({setModalContent, userObj, modalNum, setModalNum, profileImg, coverImg}) => {
    return (
        <div className="base">
            <div className="base center">
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="base">
                <span className="text1">
                    Prick a profile picture
                </span>
            </div>
            <div className="base">
                <span className="text2">
                    Have a favorite selfie? Upload it now.
                </span>
            </div>

            <div className="profile_img_preview base center ">
                <img src={profileImg === "" ? userObj.photoURL : profileImg} alt="profile_image" /> 
                <div className="profile_img_back"></div>
                <label htmlFor="profile-file">
                    <FontAwesomeIcon icon={faCamera} color={"rgb(217, 217, 217)"} size="2x" />
                </label>
            </div>

            <button onClick={() => {
                setModalNum(2);
                setModalContent(
                    <CoverImgModal 
                    setModalContent={setModalContent} 
                    userObj={userObj}
                    modalNum={modalNum}
                    setModalNum={setModalNum}
                    profileImg={profileImg}
                    coverImg={coverImg}
                />);
            }} >cover</button>
        </div>
    )
}

export default ProfileImgModal;