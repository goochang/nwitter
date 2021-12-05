import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB, storageService } from "fbase";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import CoverImgEditModal from "./CoverImgEditModal";
import ProfileImgModal from "./ProfileImgModal";


const CoverImgModal = ({setModalContent, userObj, setModalNum, profileImg, coverImg, setProfileImg, setCoverImg, openModal}) => {
    const history = useHistory();
    const onFileChange = (event) => {
        const { target: {files}, } = event;
        const theFile = files[0];
        
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget : {result }, } = finishedEvent;
            const prevCover = coverImg;
            setCoverImg(result);
            setModalContent(
                <CoverImgEditModal
                    setModalContent={setModalContent} 
                    userObj={userObj}
                    setModalNum={setModalNum}
                    profileImg={profileImg}
                    coverImg={result}
                    prevCover={prevCover}
                    openModal={openModal}
                    setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                />
            );
        }

        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }

    const uploadToStorage = async (isProfile, imageURL, ref) => {
        await getFileBlob(imageURL, ref, blob =>{
            ref.put(blob).then(async function(snapshot) {

               const downURL = await snapshot.ref.getDownloadURL();

               if(isProfile){   
                   console.log("profile")
                    await userObj.updateProfile({
                        photoURL: downURL
                    });
                    firebaseDB.ref('users/' + userObj.userId).update({
                        photoURL: downURL  
                    }).then(function(){
                        history.go(0);
                    });
                } else {
                    console.log("cover")
                    firebaseDB.ref('users/' + userObj.userId).update({
                        coverURL: downURL  
                    }).then(function(){
                        if(profileImg === ""){
                            history.go(0);
                        }                        
                    });
                }
            });
        })
   }

    const getFileBlob = function (url,ref, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            console.log("load")
            cb(xhr.response, ref);
        });
        xhr.send();
    };
    const profileUpdate = async (event) => {
        event.preventDefault();

        if(profileImg !== ""){
            
            const attachmentRef =  storageService
            .ref();

            const startNum = userObj.coverURL.lastIndexOf('%2F')+5;
            attachmentRef.child(`${userObj.uid}/profile/${userObj.photoURL.substr(startNum,36)}`).delete();

            const uploadRef = attachmentRef.child(`${userObj.uid}/profile/${uuidv4()}`);
            await uploadToStorage(true, profileImg, uploadRef);
        }
        if(coverImg !== ""){
            const attachmentRef =  storageService
            .ref();
            
            const startNum = userObj.coverURL.lastIndexOf('%2F')+3;
            attachmentRef.child(`${userObj.uid}/cover/${userObj.coverURL.substr(startNum,36)}`).delete();

            const uploadRef = attachmentRef.child(`${userObj.uid}/cover/${uuidv4()}`);
            await uploadToStorage(false, coverImg, uploadRef);
        }     
    }

    return (
        <div className="cover_modal base">
            <div className="profile_edit_nav base">
                <button className="cancelBtn" onClick={() => {
                        setModalNum(1);
                        setModalContent(
                            <ProfileImgModal 
                                setModalContent={setModalContent} 
                                userObj={userObj}
                                setModalNum={setModalNum}
                                profileImg={profileImg}
                                coverImg={coverImg}
                                openModal={openModal}
                                setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                        />);
                    }} >
                        <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                    </button>
                    <span>미디어 편집</span>
                    <div>
                        <button className="okBtn" onClick={(event) => profileUpdate(event)} >Save</button>
                    </div>
            </div>

            <div className="base">
                <div className="img_preview base center ">
                    {coverImg !== "" && (<img className="main_img" src={coverImg} alt="cover_img" />) }
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
                <input id="cover-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
            </div>
        </div>
    )
}

export default CoverImgModal; 