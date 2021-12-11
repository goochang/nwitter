import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faEllipsisH, faRetweet, faUpload, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { firebaseDB } from "fbase";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PImg from '../img/default_profile_normal.png';

const Detail = withRouter(({match, userObj}) => {
  const [nweet, setNweet] = useState(null);
  const [creator, setCreator] = useState(null);
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
      <div className="base nweet_btn bbg">
        <div><FontAwesomeIcon icon={faComment} size="2x" /></div>
        <div><FontAwesomeIcon icon={faRetweet} size="2x" /></div>
        <div><FontAwesomeIcon icon={faHeart} size="2x" /></div>
        <div><FontAwesomeIcon icon={faUpload} size="2x" /></div>
      </div>
      {/* 댓글 */}
      <div className="base nweet_comment">
        <div className="new_comment base">
          {creator && 
          <div className="new_comment_profileImg">
            <img src={creator.photoURL !== "" ? creator.photoURL : PImg} alt="profile_image" /> 
          </div>}
          <div className="new_comment_inputText">
            <input type="text" placeholder="내 답글을 트윗합니다." />
          </div>
          <div className="new_comment_btn base">
            <button>답글</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Detail;
