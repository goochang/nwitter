import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService } from "fbase";
import { EmailRegister, sendEmail } from "helpers/auth";
import { useEffect, useState } from "react";
import IntroduceModal from "./IntroduceModal";
import "./register.css";

const EmailAuthModal = ({setModalContent, onRequestClose, email, name, nickname, password, pImg, introduce}) => {
    const [code, setCode] = useState("");
    const [isFocus, setIsFocus] = useState(0)

    const onChange = (event) => {
        const { target } = event;
        const { value } = target;
        setCode(value);
    }
    const goPrev = () => {
        setModalContent(
            <IntroduceModal
                setModalContent={setModalContent}
                onRequestClose={onRequestClose}
                name={name}
                nickname={nickname}
                email={email}
                password={password}
                pImg={pImg}
                _introduce={introduce}
            />
        )
    }
    useEffect(()=> {
        console.log("emailPage")
        //회원가입하고
        EmailRegister({email,name,nickname,password,pImg,introduce})
        //코드 보내기
        sendEmail();
    }, [])
    return (
        <div className="register_modal rBase">
            <div className="rBase rCenter">
                <button className="leftBtn iconBtn" onClick={goPrev} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="rBase">
                <span className="text1">
                    코드를 보내 드렸습니다
                </span>
            </div>
            <div className="rBase">
                <span className="text2">
                    {email} 인증을 위해 아래에 입력하세요.
                </span>
            </div>
            <div className="rBase input_container">
                <label className={`rBase ${isFocus === 1 ? "focus" : ""}`}>
                    <span className="value">확인 코드</span>
                    <div className="input_wrap">
                        <input type="text" value={code} onChange={onChange} className="inputName"
                        autoComplete="off" id="inputName" onFocus={()=> {setIsFocus(1)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>
                    <span className="underInput" onClick={sendEmail}>이메일 다시 받기</span>
                </label>
            </div>
        </div>
    )
}
export default EmailAuthModal;