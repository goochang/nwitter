import CoverImgModal from 'Modal/CoverImgModal';
import ProfileImgEditModal from 'Modal/ProfileImgEditModal';
import ProfileImgModal from 'Modal/ProfileImgModal';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

const ProfileEdit = ({userObj}) => {
    const timestamp = userObj.timestamp;

    const [profileImg, setProfileImg] = useState("");
    const [coverImg, setCoverImg] = useState("");

    const [isModal, setIsModal] = useState(false);
    const [modalNum, setModalNum] = useState(0);
    const [modalContent, setModalContent] = useState(null);
    
    
    const onFileChange = (event) => {
        const { target: {files}, } = event;
        const theFile = files[0];
        
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget : {result }, } = finishedEvent;

            console.log(modalNum)
            switch(modalNum){
                case 1:
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
                    break;
                case 2:
                    break;
                case 3:
                    console.log(profileImg)
                    setCoverImg(result);
                    setModalContent(
                        <CoverImgModal 
                            setModalContent={setModalContent} 
                            userObj={userObj}
                            setModalNum={setModalNum}
                            profileImg={profileImg}
                            coverImg={result}
                            setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                        />
                    );
                    break;
                case 4: 
                    break;
                default:
                    break;
            }
        }

        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }

    const setProfileModal = (img) =>{
        setProfileImg(img);
        setModalContent(
            <ProfileImgModal
                setModalContent={setModalContent} 
                userObj={userObj}
                setModalNum={setModalNum}
                profileImg={img}
                coverImg={coverImg}
                setProfileImg={setProfileImg} setCoverImg={setCoverImg}
            />
        );
    }

    const openModal = () => {
        setIsModal(!isModal);
        setModalNum(isModal ? 0 : 1);
    }

    const onRequestClose = () => {
        openModal(); 
        setModalNum(0);
        setProfileModal("");
    }

    useEffect( () => {
        setProfileModal(profileImg);
        console.log(profileImg)
    },[])

    return (
        <>
            <div className="profileEdit_container base">
                <div className="cover_image base">
                </div>
                <div className="profile_container base">
                    <form>
                        <button className="edit_profile" onClick={openModal}>Set up profile</button>
                        
                        <input id="cover-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
                    </form>
                    <img src={userObj.photoURL} 
                        alt="profile_image" /> 
                    <span className="profile_name">{userObj.displayName}</span>
                    <span className="user_id">{userObj.userId}</span>
                    <span className="join_date">Joined {moment(timestamp).format('ll')}</span>
                    <div className="follow_wrap">
                        <span className="f_cnt">10</span>
                        <span className="f_text">Following</span>
                        <span className="f_cnt">0</span>
                        <span className="f_text">Followers</span>
                    </div>
                </div>

                <ReactModal 
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={false}
                    onRequestClose={()=> onRequestClose() }
                    isOpen={isModal}
                    ariaHideApp={false}
                    // contentLabel="Minimal Modal Example"
                    appElement={document.getElementById('app')}
                    className="setProfileModal base"
                >
                    {modalContent}
                </ReactModal>
            </div>
        </>

    )
}

export default ProfileEdit; 