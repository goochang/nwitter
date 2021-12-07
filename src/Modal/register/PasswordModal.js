import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB } from "fbase";
import { getUser, isEmail } from "helpers/auth";
import { useEffect, useState } from "react";
import PImgModal from "./PImgModal";
import "./register.css";
import RegisterModal from "./RegisterModal";

const PasswordModal = ({setModalContent, onRequestClose, refreshUser, email, name, nickname, _password, pImg, introduce}) => {
    // useEffect( () => {
    //     console.log(email)
    // },)
    const [password, setPassword] = useState(_password !== undefined ? _password : "");
    const [passwordError, setPasswordError] = useState(false);

    const [isFocus, setIsFocus] = useState(0)
    const [isPassShow, setIsPassShow] = useState(false)

    const onChange = (event) => {
        const { target } = event;
        const { value } = target;
        setPassword(value);
        if(value.length < 6 ){
            setPasswordError("비밀번호를 6자 이상 입력하세요")
        } else if(value === "" && password !== ""){ // 입력값을 다지운경우
            setPasswordError("비밀번호를 입력하세요")
        } else {
            setPasswordError(false)
        }
    }

    const isValidation = () => {
        if(password !== "" && password.length >= 6 ) {
            return true;
        } else {
            return false;
        }
    }
    const handleEvent = (event) => {
        if (event.type === "mousedown") {
            setIsPassShow(true)
        } else {
            setIsPassShow(false)
        }
    }   
    const setPrev = () => {
        setModalContent(
            <RegisterModal 
            setModalContent={setModalContent}
            onRequestClose={onRequestClose}
            refreshUser={refreshUser}
            _email={email}
            _name={name}
            _nickname={nickname}
            password={password}
            pImg={pImg}
            introduce={introduce}
            />
        )
    }
    const goNext = () => {
        // if(isValidation()){
            setModalContent(
                <PImgModal 
                setModalContent={setModalContent}
                onRequestClose={onRequestClose}
                refreshUser={refreshUser}
                name={name}
                nickname={nickname}
                email={email}
                password={password}
                _pImg={pImg}
                introduce={introduce}
                />
            )
        // }
    }
    return (
        <div className="register_modal rBase">
            <div className="rBase rCenter">
                <button className="leftBtn iconBtn" onClick={setPrev} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="rBase">
                <span className="text1">
                    비밀번호가 필요합니다
                </span>
            </div>
            <div className="rBase">
                <span className="text2">
                    비밀번호는 6자 이상이어야 합니다
                </span>
            </div>
            <div className="rBase input_container">
                <label className={`rBase ${isFocus === 1 ? "focus" : ""} ${password !== "" ? "yesValue" : ""}
                ${passwordError !== false ? "error": "" }`}>
                    <span className="value">비밀번호</span>
                    <div className="input_wrap">
                        <input type={isPassShow ? "text" : "password"} value={password} onChange={onChange} className="inputPassword"
                        autoComplete="off" id="inputName" onFocus={()=> {setIsFocus(1)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>
                    { passwordError === false && password !== ""
                    ? (<span className="underInput show_pass" onMouseDown={handleEvent} onMouseUp={handleEvent}>{isPassShow ? "비밀번호보기": "숨기기"}</span>) 
                    : (<span className="underInput error">{passwordError}</span>)}
                    
                </label>
            </div>

            <div className={`rBase next_container${isValidation() ? " active" : ""} `}>
                <button className="nextBtn" onClick={() => {goNext()} }>다음</button>
            </div>
        </div>
    )
}
export default PasswordModal;