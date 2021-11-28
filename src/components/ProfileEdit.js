import { firebaseDB } from 'fbase';
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

    const setProfileModal = (img) =>{
        setProfileImg(img);
        setModalContent(
            <ProfileImgModal
                setModalContent={setModalContent} 
                userObj={userObj}
                setModalNum={setModalNum}
                profileImg={img}
                coverImg={coverImg}
                openModal={openModal}
                setProfileImg={setProfileImg} setCoverImg={setCoverImg}
            />
        );
    }

    const openModal = () => {
        setIsModal(!isModal);
        setModalNum(isModal ? 0 : 1);
    }

    const onRequestClose = async () => {
        openModal(); 
        setModalNum(0);
        setProfileModal("");

        const downURL = 'https://firebasestorage.googleapis.com/v0/b/nwitter-58cb4.appspot.com/o/TdD3CTbWVdUSLWya91csjNVZdWJ3%2F29d19292-1a9d-4ec2-9964-ee6ca07e32bd?alt=media&token=fc249db2-e1f4-471d-a9b5-dd06e689b920';
        firebaseDB.ref().child('/users/LSKNYM5cFZbU1eN7E12O').update({
            photoURL: downURL,
            coverURL: downURL
        });
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