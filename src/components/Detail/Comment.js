import { firebaseDB } from 'fbase';
import { useCallback, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import PImg from '../../img/default_profile_normal.png';

const Comment = ({commentObj}) => {
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
                        <div className="vCenter mgBottom10 flexRow base">
                            <Link to={`/search/${creator.uid}`} className="fontSize16 textBold">{creator.displayName}</Link>
                            <Moment fromNow className="fromNow">{commentObj.createdAt}</Moment>
                        </div>}
                        <div className="base contentText">
                            <span className='fontSize15'>{commentObj.text}</span>
                        </div>
                    </div>
                </div>
                )} 
        </div>
    )
}

export default Comment;