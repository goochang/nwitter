import { dbService, firebaseDB, storageService} from "fbase";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faPencilAlt, faHeart as faHeart2, faUpload, faRetweet} from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';
import Moment from 'react-moment';
import { Link, NavLink, useHistory } from "react-router-dom";
import NweetFactory from "./NweetFactory";

const Nweet = ({nweet_key, nweetObj, isOwner, userObj, viewRef }) => {
    const [editing, setEditing] = useState(false);
    const [creator, setCreator] = useState(null)
    const [isHeart, setIsHeart] = useState(false);

    const onDeleteClick = async (event) =>{
        event.preventDefault();
        const ok = window.confirm("삭제 ㄱ?");

        if(ok) {
            firebaseDB.ref(`/posts/${nweetObj.key}`).remove();

            if(nweetObj.attachmentUrl !== "") {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    }

    const toggleEditing = (event) => {
        if(event !== undefined){
            event.preventDefault();
            const {target:{parentNode}} = event;
            const updateElement = document.getElementsByClassName('update');

            if(updateElement.length !== 0 && parentNode.classList[2] !== "update"){
                document.getElementsByClassName('cancelBtn')[0].click();
            }
        }
        setEditing( (prev) => !prev)
    };
    const heartClick = (event) => {
        event.preventDefault();
        firebaseDB.ref('hearts')
        .orderByChild('value')
        .equalTo(userObj.uid+nweetObj.key)
        .once('value', snapshot => {
            if(snapshot.exists()){ // 이미 누른적 있는경우
                const hearts = snapshot.val();
                Object.keys(hearts).forEach((heart) => {
                    firebaseDB.ref('hearts/' + heart).update({
                        isHeart: !hearts[heart].isHeart
                    })
                })                
            } else {
                firebaseDB.ref('hearts').push({
                    value:userObj.uid + nweetObj.key,
                    isHeart: true
                });
            }
            const _heartCnt = isHeart ? nweetObj.heartCnt - 1 : nweetObj.heartCnt + 1;
            firebaseDB.ref('posts/' + nweetObj.key).update({
                heartCnt: _heartCnt
            })
            setIsHeart(!isHeart)
        });        
    }

    useEffect( () => {
        if(nweetObj){
            firebaseDB.ref('users')
            .orderByChild('uid')
            .startAt(nweetObj.creatorId)
            .endAt(nweetObj.creatorId+"\uf8ff")
            .once('value', snapshot => {
                const user = snapshot.val();
                setCreator(user[Object.keys(user)[0]] );
            });
        }
    }, [nweetObj])

    useEffect( () => {
        if(userObj && nweetObj){
            firebaseDB.ref('hearts')
            .orderByChild('value')
            .equalTo(userObj.uid+nweetObj.key)
            .once('value', snapshot => {    
                if(snapshot.exists()){
                    const hearts = snapshot.val();
                    Object.keys(hearts).forEach((heart) => {
                        setIsHeart(hearts[heart].isHeart)
                    })
                }
            });
        }
    }, [nweetObj, userObj])

    return (
        
        <div className={`nweet ${editing ? 'update' : ''}`} ref={viewRef} >
            {editing ? (
                <>
                <NweetFactory userObj={userObj} isUpdate={true} updateCancel={toggleEditing}
                nweetObj={nweetObj} toggleEditing={toggleEditing} />
                </>
            ) :
            <NavLink to={`/nweet/${nweetObj.key}`}>
                <div className="nweet_container base" >
                    <div className="nweet_profile base">
                        { creator && 
                        <Link to={`/search/${creator.uid}`}>
                            <img src={creator !== null ? (creator.photoURL !== "" ? creator.photoURL : PImg)  : ""} 
                            alt="profile_image" /> 
                        </Link>
                        }  
                    </div>
                    <div className="nweet_content base">
                        { creator && 
                        <div className="nweet_profile_name_container base">
                            <Link to={`/search/${creator.uid}`} className="profile_displayName">{creator.displayName}</Link>
                            <Moment fromNow className="fromNow">{nweetObj.createdAt}</Moment>
                            {
                                isOwner && (
                                    <div className="nweet__actions">
                                        <span onClick={onDeleteClick}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>
                                        <span onClick={toggleEditing}>
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </span>
                                    </div>
                                )
                            }
                        </div>}
                        <div className="nweet_content_box base">
                            <span>{nweetObj.text}</span>
                            {
                                nweetObj.attachmentUrl && (
                                    <img src={nweetObj.attachmentUrl} alt="nweet_attachment" /> 
                                )
                            }
                            <div className="nweet_btn_wrap base">
                                <div className={`base heart${isHeart ? " active" : ""}`} onClick={heartClick}>
                                    <button className="iconBtn" id="nweet_heart">
                                        { isHeart ? <FontAwesomeIcon icon={faHeart2} /> : <FontAwesomeIcon icon={faHeart} /> }
                                    </button>
                                    <label htmlFor="nweet_heart">{nweetObj.heartCnt}</label>
                                </div>
                                <div className="base">
                                    <button className="iconBtn" id="nweet_comment">
                                        <FontAwesomeIcon icon={faComment} />
                                    </button>
                                    <label htmlFor="nweet_comment">{nweetObj.commentCnt}</label>
                                </div>
                                <div className="base">
                                    <button className="iconBtn" id="nweet_retweet">
                                        <FontAwesomeIcon icon={faRetweet} />
                                    </button>
                                    <label htmlFor="nweet_retweet">{nweetObj.retweetCnt}</label>
                                </div>
                                <div className="base">
                                    <button className="iconBtn" id="nweet_upload">
                                        <FontAwesomeIcon icon={faUpload} />
                                    </button>
                                </div>
                            </div>  
                        </div>
                        
                    </div> 
                </div>
            </NavLink>
        }
        </div>
    )
}
export default Nweet; 