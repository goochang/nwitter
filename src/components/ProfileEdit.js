import ProfileImgModal from 'Modal/ProfileImgModal';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

const ProfileEdit = ({userObj, cover}) => {
    const timestamp = userObj.timestamp;

    const [profileImg, setProfileImg] = useState("");
    const [coverImg, setCoverImg] = useState("");

    const [isModal, setIsModal] = useState(false);
    const [modalNum, setModalNum] = useState(0);
    const [modalContent, setModalContent] = useState(null);

    const setProfileModal = (img) =>{
        console.log(coverImg)
        setProfileImg(img);
        setModalContent(
            <ProfileImgModal
                setModalContent={setModalContent} 
                userObj={userObj}
                setModalNum={setModalNum}
                profileImg={img}
                coverImg={cover}
                openModal={openModal}
                setProfileImg={setProfileImg} setCoverImg={setCoverImg}
            />
        );
    }

    const openModal = () => {
        console.log(isModal)
        if(!isModal)
            setProfileModal(profileImg)
        setIsModal(!isModal);
        setModalNum(isModal ? 0 : 1);
    }

    const onRequestClose = async () => {
        openModal(); 
        setModalNum(0);
        setProfileModal("");        
    }

    return (
        <>
            <div className="profileEdit_container base">
                <div className="cover_image base">
                    {
                        cover !== "" && <img src={cover} 
                        alt="cover_image" /> 
                    }
                </div>
                <div className="profile_container base">
                    <form>
                        <button className="edit_profile" onClick={openModal}>Set up profile</button>
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