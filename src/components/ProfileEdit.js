import CoverImgModal from 'Modal/CoverImgModal';
import ProfileImgModal from 'Modal/ProfileImgModal';
import moment from 'moment';
import 'moment/locale/ko';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import PImg from '../img/default_profile_normal.png';

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
            console.log(theFile)
            console.log(modalNum)
            if(modalNum === 1){
                setProfileModal(result);
            } else {
                setCoverModal(result);
            }
        }

        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }

    const setProfileModal = (img) =>{
        setModalContent(
            <ProfileImgModal 
                setModalContent={setModalContent} 
                userObj={userObj}
                modalNum={modalNum}
                setModalNum={setModalNum}
                profileImg={img}
                coverImg={coverImg}
            />
        );
    }
    const setCoverModal = (img) =>{
        setModalContent(
            <CoverImgModal 
                setModalContent={setModalContent} 
                userObj={userObj}
                modalNum={modalNum}
                setModalNum={setModalNum}
                profileImg={profileImg}
                coverImg={img}
            />
        );
    }

    const openModal = () => {
        setIsModal(!isModal);
        setModalNum(isModal ? 0 : 1);
    }

    useEffect( () => {
        setProfileModal(profileImg);
    },[])

    return (
        <>
            <div className="profileEdit_container base">
                <div className="cover_image base">
                </div>
                <div className="profile_container base">
                    <form>
                        <button className="edit_profile" onClick={openModal}>Set up profile</button>
                        <input id="profile-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
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
                    onRequestClose={()=> openModal()}
                    isOpen={isModal}
                    ariaHideApp={false}
                    contentLabel="Minimal Modal Example"
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