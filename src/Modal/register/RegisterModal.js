import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB } from "fbase";
import { isEmail } from "helpers/auth";
import { useState } from "react";
import PasswordModal from "./PasswordModal";
import "./register.css";

const RegisterModal = ({setModalContent, onRequestClose, refreshUser, _email, _nickname, _name, password, pImg, introduce}) => {
    const [name, setName] = useState(_name);
    const [nameCnt, setNameCnt] = useState(0);
    const [nameError, setNameError] = useState(false);

    const [nickname, setNickName] = useState(_nickname);
    const [nicknameCnt, setNickNameCnt] = useState(0);
    const [nicknameError, setNickNameError] = useState(false);

    const [email, setEmail] = useState(_email);
    const [emailError, setEmailError] = useState(false);

    const [isFocus, setIsFocus] = useState(0)

    const onChange = (event) => {
        const { target } = event;
        const { value } = target;
        if(target.type === 'text'){
            if(isFocus === 1){
                setName(value);
                setNameCnt(value.length)
                if(value === "" && name !== ""){ // 입력값을 다지운경우
                    setNameError("이름을 입력하세요")
                } else {
                    setNameError(false)
                }
            } else {
                setNickName(value);
                setNickNameCnt(value.length)
                if(value === "" && nickname !== ""){ // 입력값을 다지운경우
                    setNickNameError("닉네임을 입력하세요")
                } else {
                    setNickNameError(false)
                }
            }
            
        } else {
            setEmail(value);
            if(value === "" || isEmail(value)){
                setEmailError(false)
                getUser('email', value)
            } else {
                setEmailError("올바른 이메일을 입력해 주세요.")
            }
        }
    }
    const handleKeyDown = (event) => {
        if(isFocus === 1 && event.keyCode !== 8 && nameCnt >= 50){
            event.preventDefault();
        }
        if(isFocus === 2 && event.keyCode !== 8 && nicknameCnt >= 50){
            event.preventDefault();
        }   
    }

    const isValidation = () => {
        if(email !== undefined && !emailError && name !== undefined  && nickname !== undefined ) {
            return true;
        } else {
            return false;
        }
    }
    const goNext = () => {
        if(isValidation()){
            setModalContent(
                <PasswordModal 
                setModalContent={setModalContent}
                onRequestClose={onRequestClose}
                refreshUser={refreshUser}
                name={name}
                nickname={nickname}
                email={email}
                _password={password}
                pImg={pImg}
                introduce={introduce}
                />
            )
        }
    }

    const getUser = (type, value) => {
        const ref = firebaseDB.ref('users')
        .orderByChild(type)
        .equalTo(value)
        .once('value', snapshot => {
            if(snapshot.exists()){
                setEmailError("이미 등록된 이메일 입니다.")
            }
        });
    }

    return (
        <div className="register_modal rBase">
            <div className="rBase rCenter">
                <button className="iconBtn leftBtn" onClick={onRequestClose} >
                    <FontAwesomeIcon icon={faTimes} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="rBase">
                <span className="text1">
                    계정을 생성하세요
                </span>
            </div>
            <div className="rBase input_container">
                <label className={`rBase ${isFocus === 1 ? "focus" : ""} ${name !== "" ? "yesValue" : ""}
                ${nameError !== false ? "error": "" }`}>
                    <span className="value">이름</span>
                    <span className="nCnt">{nameCnt}/50</span>
                    <div className="input_wrap">
                        <input type="text" value={name} onChange={onChange} className="inputName" onKeyDown={handleKeyDown}
                        autoComplete="off" id="inputName" onFocus={()=> {setIsFocus(1)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>
                    <span className="error underInput">{nameError}</span>
                </label>
                <label className={`rBase ${isFocus === 2 ? "focus" : ""} ${name !== "" ? "yesValue" : ""}
                ${nicknameError !== false ? "error": "" }`}>
                    <span className="value">닉네임</span>
                    <span className="nCnt">{nicknameCnt}/50</span>
                    <div className="input_wrap">
                        <input type="text" value={nickname} onChange={onChange} className="inputNickName" onKeyDown={handleKeyDown}
                        autoComplete="off" id="inputNickName" onFocus={()=> {setIsFocus(2)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>
                    <span className="error underInput">{nicknameError}</span>
                </label>
                <label className={`rBase ${isFocus === 3 ? "focus" : ""} ${email !== "" ? "yesValue" : ""} ${emailError !== false ? "error": "" }`}>
                    <span className="value">이메일</span>
                    <div className="input_wrap">
                        <input type="email" value={email} onChange={onChange} className="inputEmail" 
                        autoComplete="off" id="inputEmail" onFocus={()=> {setIsFocus(3)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>
                    <span className="error underInput">{emailError}</span>
                </label>
            </div>

            <div className={`rBase next_container${isValidation() ? " active" : ""} `}>
                <button className="nextBtn" onClick={() => {goNext()} }>다음</button>
            </div>

        </div>
    )
}
export default RegisterModal;