import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { firebaseDB } from 'fbase';
import { useCallback, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import PImg from '../../img/default_profile_normal.png';

const Comment = ({commentId, commentObj, isOwner}) => {
    const creatorId = commentObj === undefined ? "" : commentObj.creatorId;
    const [creator, setCreator] = useState(null);

    const getCreator = useCallback(()=>{
        if(creatorId !== ""){
            firebaseDB.ref('users')
            .orderByChild('uid')
            .equalTo(creatorId)
            .once('value', snapshot => {
                const user = snapshot.val();
                setCreator(user[Object.keys(user)[0]] );
            });
        }
    },[creatorId]);

    const onDeleteClick = async (event) =>{
        event.preventDefault();
        const ok = window.confirm("댓글을 삭제하시겠습니까");

        if(ok) {
            firebaseDB.ref(`/comments/${commentId}`).remove();
        }
    }

    useEffect(()=>{
        getCreator()
    }, [getCreator])
    return (
        <div>
            { commentObj && (
                <div className="base listView_container flexRow">
                    <div className="base leftProfile">
                    { creator && 
                    <Link to={`/search/${creator.uid}`}>
                        <img src={creator !== null ? (creator.photoURL !== "" ? creator.photoURL : PImg)  : ""} 
                        alt="profile_image" /> 
                    </Link>
                    }  
                    </div>
                    <div className="base rightContent">
                        { creator && 
                        <div className="mgBottom10 flexRow base">
                            <Link to={`/search/${creator.uid}`} className="fontSize16 textBold">{creator.displayName}</Link>
                            <Moment fromNow className="fromNow">{commentObj.createdAt}</Moment>
                        </div>}
                        <div className="base contentText">
                            <span className='fontSize15'>{commentObj.text}</span>
                        </div>
                        { isOwner && (
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                </div>
                            )
                        }
                    </div>
                    
                </div>
                )} 
        </div>
    )
}

export default Comment;