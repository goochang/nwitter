import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CoverImgModal from "./CoverImgModal";
import ProfileImgEditModal from "./ProfileImgEditModal";

const ProfileImgModal = ({setModalContent, userObj, setModalNum, profileImg, coverImg, setProfileImg, setCoverImg}) => {
    const onFileChange = (event) => {
        const { target: {files}, } = event;
        const theFile = files[0];
        
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget : {result }, } = finishedEvent;

            setProfileImg(result);
            setModalContent(
                <ProfileImgEditModal
                    setModalContent={setModalContent} 
                    userObj={userObj}
                    setModalNum={setModalNum}
                    profileImg={result}
                    coverImg={coverImg}
                    setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                />
            );
        }

        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }
    
    return (
        <div className="profile_modal base">
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

            <div className="img_preview base center ">
                <img className="main_img" src={profileImg === "" ? userObj.photoURL : profileImg} alt="profile_image" /> 
                <div className="profile_img_back"></div>
                <label htmlFor="profile-file">
                    <FontAwesomeIcon icon={faCamera} color={"rgb(217, 217, 217)"} size="2x" />
                </label>
            </div>

            <button onClick={() => {
                setModalNum(3);
                setModalContent(
                    <CoverImgModal 
                    setModalContent={setModalContent} 
                    userObj={userObj}
                    setModalNum={setModalNum}
                    profileImg={profileImg}
                    coverImg={coverImg}
                    setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                />);
            }} >skip</button>
            <input id="profile-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
        </div>
    )
}
export default ProfileImgModal;