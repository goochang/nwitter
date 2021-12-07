import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, firebaseDB, storageService } from "fbase";
import { sendEmail } from "helpers/auth";
import { useEffect, useState } from "react";
import IntroduceModal from "./IntroduceModal";
import { v4 as uuidv4 } from "uuid";
import "./register.css";

const EmailAuthModal = ({setModalContent, onRequestClose, refreshUser, email, name, nickname, password, pImg, introduce}) => {
    const goPrev = () => {
        setModalContent(
            <IntroduceModal
                setModalContent={setModalContent}
                onRequestClose={onRequestClose}
                refreshUser={refreshUser}
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
                    name: name ? name : "",
                    displayName: nickname ? nickname : "",
                    email: email ? email : "",
                    introduce: introduce ? introduce : "",
                    photoURL: downURL ? downURL : "",
                    coverURL: "",
                }).then(function(){
                    refreshUser();
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
        <div className="register_modal rBase emailAuth">
            <div className="rBase rCenter">
                <button className="leftBtn iconBtn" onClick={goPrev} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <FontAwesomeIcon icon={faTwitter} color={"rgb(217, 217, 217)"} size="2x" />
            </div>
            <div className="rBase rCenter">
                <span className="text1">
                    인증 메일이 발송되었습니다
                </span>
            </div>
            <div className="rBase rCenter">
                <span className="text2">
                    메일함에서({email}) 인증 메일을 확인 바랍니다
                </span>
            </div>
            <div className="rBase input_container">
                <button className="underInput resendBtn" onClick={sendEmail}>인증 메일 재발송</button>
            </div>
        </div>
    )
}
export default EmailAuthModal;