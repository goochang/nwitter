import { firebaseDB } from 'fbase';
import { useCallback, useEffect, useState } from 'react';
import PImg from '../../img/default_profile_normal.png';
import Comment from './Comment';

const Comments = ({creator, userObj, postId}) => {
    const [text, setText] = useState("");
    const [comments, setComments] = useState(null);
    const onSubmit = (event) => {
        event.preventDefault();

        firebaseDB.ref("/comments").push({
            text:text,
            createdAt: Date.now(),
            postId: postId,
            creatorId: userObj.uid,
            creatorName: userObj.displayName,
            creatorEmail: userObj.email,
        });
        const commentCnt = comments === null ? 1 : Object.keys(comments).length+1;
        firebaseDB.ref("posts/"+ postId).update({
            commentCnt: commentCnt
        });

        setText("");
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setText(value);
    }

    const getComments = useCallback(()=>{
        firebaseDB
        .ref('comments')
        .orderByChild('postId')
        .equalTo(postId)
        .on('value', (snapshot) => {     
            console.log(snapshot.val())   
            setComments(snapshot.val());
        })
    }, [postId]);
    useEffect(()=> {
        getComments();
    }, [getComments])
    return (
        <div className="base nweet_comment">
            <form onSubmit={onSubmit}>
                <div className="new_comment base">
                    {creator && 
                    <div className="new_comment_profileImg">
                        <img src={creator.photoURL !== "" ? creator.photoURL : PImg} alt="profile_image" /> 
                    </div>}
                
                    <div className="new_comment_inputText">
                        <input type="text" onChange={onChange} value={text} placeholder="내 답글을 트윗합니다." />
                    </div>
                    <div className="new_comment_btn base">
                        <button onClick={onSubmit} aria-disabled={text === ""}>답글</button>
                    </div>
                </div>
            </form>

            <div className='base listView'>
                {
                comments ?
                Object.keys(comments).map((comment) => {
                    return (
                    <Comment commentId={comment} commentObj={comments[comment]} 
                    isOwner={comments[comment].creatorId === userObj.uid } />
                    )
                })
                : <span className='noComment'>댓글이 없습니다</span>
                }

            </div>
        </div>
    )
}

export default Comments;