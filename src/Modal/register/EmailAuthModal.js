import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, firebaseDB, storageService } from "fbase";
import { sendEmail } from "helpers/auth";
import { useEffect, useState } from "react";
import IntroduceModal from "./IntroduceModal";
import { v4 as uuidv4 } from "uuid";
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
    const uploadToStorage = async (user, ref) => {
        await getFileBlob(pImg, ref, blob =>{
            ref.put(blob).then(async function(snapshot) {
               const downURL = await snapshot.ref.getDownloadURL();
     
                console.log("profile")
                await user.updateProfile({
                    photoURL: downURL
                }).then(function(){
                    addUser(user, downURL)
                });
    
            });
        })
    }
    
    const getFileBlob = function (url,ref, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            console.log("load")
            cb(xhr.response, ref);
        });
        xhr.send();
    };

    const profileUpdate = async () => {
        const user = authService.currentUser;
    
        if(pImg !== ""){
            const attachmentRef =  storageService
            .ref();
    
            const uploadRef = attachmentRef.child(`${user.uid}/profile/${uuidv4()}`);
            await uploadToStorage(user, uploadRef);
        }
    }

    const EmailRegister = async user =>  {
        
        await authService.
        createUserWithEmailAndPassword(user.email, user.password).
        then(async function(){
            await profileUpdate();
        });
    };

    const addUser = (user, downURL) => {
        firebaseDB.ref('users')
        .orderByChild('email')
        .startAt(user.email)
        .endAt(user.email+"\uf8ff")
        .once('value', snapshot => {
            if(!snapshot.exists()){
                console.log("회원가입")
                firebaseDB.ref('users').push({
                    uid: user.uid,
                    timestamp : user.metadata.creationTime ? user.metadata.creationTime : "",
                    name: user.name ? user.name : "",
                    displayName: user.nickname ? user.nickname : "",
                    email: user.email ? user.email : "",
                    introduce: user.introduce ? user.introduce : "",
                    photoURL: downURL ? downURL : "",
                    coverURL: "",
                }).then(function(){
                    sendEmail();
                });
            }
        });
    }
    useEffect(()=> {
        console.log("emailPage")
        //회원가입하고
        EmailRegister({email,name,nickname,password,pImg,introduce})
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