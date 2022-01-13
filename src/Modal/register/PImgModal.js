import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB } from "fbase";
import { getUser, isEmail } from "helpers/auth";
import { useEffect, useState } from "react";
import IntroduceModal from "./IntroduceModal";
import "./register.css";
import RegisterModal from "./RegisterModal";
import PImg from '../../img/default_profile_normal.png';
import PImgEditModal from "./PImgEditModal";
import PasswordModal from "./PasswordModal";

const PImgModal = ({setModalContent, onRequestClose, refreshUser, email, name, nickname, password, _pImg, introduce}) => {
    const [pImg, setPImg] = useState(_pImg);

    const onFileChange = (event) => {
        const { target: {files}, } = event;
        const theFile = files[0];
        
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget : {result }, } = finishedEvent;
            setPImg(result);
            setModalContent(
                <PImgEditModal
                    setModalContent={setModalContent}
                    onRequestClose={onRequestClose}
                    refreshUser={refreshUser}
                    email={email}
                    name={name}
                    nickname={nickname}
                    password={password}
                    _pImg={result}
                    introduce={introduce}
                />
            );
        }
        if(theFile !== undefined)
            reader.readAsDataURL(theFile);
    }
    const isValidation = () => {
        if(pImg !== undefined ) {
            return true;
        } else {
            return false;
        }
    }
    const setPrev = () => {
        setModalContent(
            <PasswordModal 
            setModalContent={setModalContent}
            onRequestClose={onRequestClose}
            refreshUser={refreshUser}
            email={email}
            name={name}
            nickname={nickname}
            _password={password}
            pImg={_pImg}
            introduce={introduce}
            />
        )
    }
    const goNext = () => {
        setModalContent(
            <IntroduceModal 
            setModalContent={setModalContent}
            onRequestClose={onRequestClose}
            refreshUser={refreshUser}
            name={name}
            nickname={nickname}
            email={email}
            password={password}
            pImg={_pImg}
            _introduce={introduce}
            />
        )
    }
    return (
        <div className="register_modal pImgModal rBase">
            <div className="rBase rCenter">
                <button className="leftBtn iconBtn" onClick={setPrev} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="rBase">
                <span className="text1">
                    프로필 사진 선택하기
                </span>
            </div>
            <div className="rBase">
                <span className="text2">
                    마음에 드는 사진이 있나요? 지금 업로드하세요
                </span>
            </div>
            <div className="img_preview base center ">
                <img className="main_img" src={pImg === undefined ? PImg : pImg} alt="profile_image" /> 
                <div className="profile_img_back"></div>
                <label htmlFor="profile-file">
                    <FontAwesomeIcon icon={faCamera} color={"rgb(217, 217, 217)"} size="2x" />
                </label>
            </div>

            {/* <div className={`rBase next_container${isValidation() ? " active" : ""} `}> */}
            <div className={`rBase`}>
                <button className="nextBtn" onClick={() => {goNext()} }>다음</button>
            </div>
            <input id="profile-file" type="file" accept="image/*"  onChange={onFileChange} style={{opacity:0}} />
        </div>
    )
}
export default PImgModal;