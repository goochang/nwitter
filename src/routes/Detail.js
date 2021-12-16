import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisH, faHeart as faHeart2, faUpload, faRetweet} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "components/Detail/Comments";
import { firebaseDB } from "fbase";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PImg from '../img/default_profile_normal.png';

const Detail = withRouter(({match, userObj}) => {
  const [nweet, setNweet] = useState(null);
  const [creator, setCreator] = useState(null);
  const [isHeart, setIsHeart] = useState(false);

  const postId = match.params.key1;

  const getNweet = useCallback(async () => {
    firebaseDB.ref('posts/' + postId)
    .on('value', (snapshot) => {     
      console.log(snapshot.val())   
      setNweet(snapshot.val());
    })
  }, [postId] );

  const getCreator = useCallback(async () => {
    if(nweet !== null){
      firebaseDB.ref('users')
      .orderByChild('uid')
      .equalTo(nweet.creatorId)
      .once('value', snapshot => {
          const user = snapshot.val();
          setCreator(user[Object.keys(user)[0]] );
      });
    }
  }, [nweet]);

  const heartClick = (event) => {
    event.preventDefault();
    firebaseDB.ref('hearts')
    .orderByChild('value')
    .equalTo(userObj.uid+postId)
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
                value:userObj.uid + postId,
                isHeart: true
            });
        }
        const _heartCnt = isHeart ? nweet.heartCnt - 1 : nweet.heartCnt + 1;
        firebaseDB.ref('posts/' + postId).update({
            heartCnt: _heartCnt
        })
        setIsHeart(!isHeart)
    });        
}

  useEffect( () => {
    if(userObj){
      firebaseDB.ref('hearts')
      .orderByChild('value')
      .equalTo(userObj.uid+postId)
      .once('value', snapshot => {    
          if(snapshot.exists()){
              const hearts = snapshot.val();
              Object.keys(hearts).forEach((heart) => {
                  setIsHeart(hearts[heart].isHeart)
              })
          }
      });
    }
  }, [userObj, postId])

  useEffect(()=> {
    getNweet();
  }, [getNweet]);

  useEffect(()=> {
    getCreator();
  }, [getCreator]);

  return (
    <div className="base nweet_detail">
      {/* 작성자 르포필 */}
      <div className="nweet_profile base">
        <div className="profile_image">
          { creator && 
          <Link to={`/search/${creator.uid}`}>
              <img src={creator.photoURL !== "" ? creator.photoURL : PImg} alt="profile_image" /> 
          </Link>}  
        </div>
        { creator && 
        <div className="profile_detail base">
          <Link to={`/search/${creator.uid}`} className="profile_displayName">
            {creator.displayName}
          </Link>
          <span className="email">{creator.email}</span>
        </div>}
        <div>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
      </div>
      {/* 내용 및 사진 */}
      <div className="base nweet_content bbg">
        { nweet && 
          <span className="content_text">{nweet.text}</span>}{
            nweet && nweet.attachmentUrl && (
                <img src={nweet.attachmentUrl} alt="nweet_attachment" /> ) }
        {nweet && 
        <span className="content_timestamp">{moment(nweet.timestamp).format('llll')}</span>}
      </div>
      {/* 리트윗 좋아요 */}
      <div className="base nweet_cnt bbg">
        {<div>
          <span className="cnt_title">49</span>
          <span className="cnt_value">리트윗</span>
        </div>}
        {<div>
          <span className="cnt_title">1</span>
          <span className="cnt_value">인용한 트윗</span>
        </div>}
        { nweet&& nweet.heartCnt !== 0 && 
        <div>
          <span className="cnt_title">{nweet.heartCnt}</span>
          <span className="cnt_value">마음에 들어요</span>
        </div>}
      </div>
      {/* 상호작용 버튼 */}
      {nweet &&
      <div className="nweet_btn_wrap base bbg">
        <div className={`base heart${isHeart ? " active" : ""}`} onClick={heartClick}>
            <button className="iconBtn" id="nweet_heart">
                { isHeart ? <FontAwesomeIcon icon={faHeart2} /> : <FontAwesomeIcon icon={faHeart} /> }
            </button>
            <label htmlFor="nweet_heart">{nweet.heartCnt}</label>
        </div>
        <div className="base">
            <button className="iconBtn" id="nweet_comment">
                <FontAwesomeIcon icon={faComment} />
            </button>
            <label htmlFor="nweet_comment">{nweet.commentCnt}</label>
        </div>
        <div className="base">
            <button className="iconBtn" id="nweet_retweet">
                <FontAwesomeIcon icon={faRetweet} />
            </button>
            <label htmlFor="nweet_retweet">{nweet.retweetCnt}</label>
        </div>
        <div className="base">
            <button className="iconBtn" id="nweet_upload">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </div>
      </div>  }
      {/* 댓글 */}
      <Comments creator={creator} userObj={userObj} postId={postId} />
    </div>
  );
});

export default Detail;
