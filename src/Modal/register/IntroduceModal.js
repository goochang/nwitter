import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import EmailAuthModal from "./EmailAuthModal";
import PImgEditModal from "./PImgEditModal";
import PImgModal from "./PImgModal";
import "./register.css";
import RegisterModal from "./RegisterModal";

const IntroduceModal = ({setModalContent, onRequestClose, email, name, nickname, password, pImg, _introduce}) => {
    const [introduce, setIntroduce] = useState(_introduce);
    const [textCnt, setTextCnt] = useState(_introduce===undefined ? 0 :  _introduce.length);

    const [isFocus, setIsFocus] = useState(0)

    const onChange = (event) => {
        const { target } = event;
        const { value } = target;
        setIntroduce(value);
        setTextCnt(value.length)
    }
    
    const handleKeyDown = (event) => {
        if(event.keyCode !== 8 && textCnt >= 160){
            event.preventDefault();
        }
    }
    
    const setPrev = () => {
        setModalContent(
            <PImgModal 
            setModalContent={setModalContent}
            onRequestClose={onRequestClose}
            email={email}
            name={name}
            nickname={nickname}
            password={password}
            _pImg={pImg}
            introduce={introduce}
            />
        )
    }
    const goNext = () => {
        setModalContent(
            <EmailAuthModal 
            setModalContent={setModalContent}
            onRequestClose={onRequestClose}
            name={name}
            nickname={nickname}
            email={email}
            password={password}
            pImg={pImg}
            introduce={introduce}
            />
        )
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
                    자신을 소개해 주세요
                </span>
            </div>
            <div className="rBase">
                <span className="text2">
                    나만의 특별한 점이 있다면 무엇인가요?<br/><br/>너무 깊이 생각하지 말고 가볍게 이야기해 보세요.
                </span>
            </div>
            <div className="rBase input_container">
                <label className={`rBase ${isFocus === 1 ? "focus" : ""} ${introduce !== "" ? "yesValue" : ""}`}>
                    <span className="value introduce">자기소개</span>
                    <span className="nCnt">{textCnt}/160</span>
                    <div className="input_wrap">
                        <textarea value={introduce} onChange={onChange} className="inputintroduce" spellCheck="false" onKeyDown={handleKeyDown}
                        autoComplete="off" id="inputName" onFocus={()=> {setIsFocus(1)}} onBlur={()=> {setIsFocus(0)}} />
                    </div>                    
                </label>
            </div>

            <div className={`rBase next_container$ active`}>
                <button className="nextBtn" onClick={goNext}>다음</button>
            </div>
        </div>
    )
}
export default IntroduceModal;