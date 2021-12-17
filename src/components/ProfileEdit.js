import ProfileImgModal from 'Modal/profile/ProfileImgModal';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

const ProfileEdit = ({userObj}) => {
    const timestamp = userObj !== null ? userObj.timestamp : "";
    const email = userObj !== null ? userObj.email : "";
    const displayName = userObj !== null ? userObj.displayName : "";
    const photoURL = userObj !== null ? userObj.photoURL : "";
    const coverURL = userObj !== null ? userObj.coverURL : "";
    const followCnt = userObj !== null ? userObj.followCnt : "";
    const followingCnt = userObj !== null ? userObj.followingCnt : "";

    const [profileImg, setProfileImg] = useState("");
    const [coverImg, setCoverImg] = useState("");

    const [isModal, setIsModal] = useState(false);
    const [modalNum, setModalNum] = useState(0);
    const [modalContent, setModalContent] = useState(null);

    const setProfileModal = (img) =>{
        setProfileImg(img);
        setModalContent(
            <ProfileImgModal
                setModalContent={setModalContent} 
                userObj={userObj}
                setModalNum={setModalNum}
                profileImg={img}
                coverImg={coverURL}
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
                        coverURL !== "" && <img src={coverURL} 
                        alt="cover_image" /> 
                    }
                </div>
                <div className="profile_container base">
                    <form>
                        <button className="edit_profile" onClick={openModal}>Set up profile</button>
                    </form>
                    <img src={photoURL} 
                        alt="profile_image" /> 
                    <span className="profile_name">{displayName}</span>
                    <span className="user_id">{email}</span>
                    <span className="join_date">가입일 {moment(timestamp).format('ll')}</span>
                    <div className="follow_wrap">
                        <span className="f_cnt">{followCnt}</span>
                        <span className="f_text">팔로우 중</span>
                        <span className="f_cnt">{followingCnt}</span>
                        <span className="f_text">팔로워</span>
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