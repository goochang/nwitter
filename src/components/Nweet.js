import { dbService, firebaseDB, storageService} from "fbase";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faPencilAlt, faHeart as faHeart2} from "@fortawesome/free-solid-svg-icons";
import PImg from '../img/default_profile_normal.png';
import Moment from 'react-moment';
import { Link, useHistory } from "react-router-dom";

const Nweet = ({nweet_key, nweetObj, isOwner, userObj, viewRef }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [creator, setCreator] = useState(null)
    const [isHeart, setIsHeart] = useState(false);

    const history = useHistory();
    
    const onDeleteClick = async () =>{
        const ok = window.confirm("삭제 ㄱ?");

        if(ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();

            if(nweetObj.attachmentUrl !== "") {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    }

    const onChange = (event) =>{
        const {target : {value}} = event;
        setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        await dbService.doc(`nweets/${nweetObj.id}`).update({text: newNweet});
        toggleEditing();
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

        if(userObj){
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

    const toggleEditing = () => setEditing( (prev) => !prev);
    const heartClick = (event) => {
        event.preventDefault();
        console.log("heartClick")
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

    return (
        
        <div className={`nweet`} ref={viewRef} >
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input value={newNweet} onChange={onChange} required
                    placeholder="Edit your nweet" autoFocus className="formInput" />
                    <input type="submit" value="update" className="formBtn" />
                </form>
                <button onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </button>
                </>
            ) :
            <Link to={`/nweet/${nweetObj.key}`}>
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
                                <div>
                                    reply
                                </div>
                            </div>
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
                        </div>
                    </div>
                    
                </div>
                </Link>
                
        }
        </div>
    )
}
export default Nweet; 