import Nweet from "components/Nweet";
import { firebaseDB,  } from "fbase";
import { reverseObject } from "helpers/help";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { withRouter } from "react-router-dom";

const Search = withRouter(({match, userObj}) => {
  const [nweets, setNweets] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const uid = match.params.key1;

  const [ref, inView] = useInView()
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [isFollow, setIsFollow] = useState(false);

  const [followCnt, setfollowCnt] = useState(0);
  const [followingCnt, setfollowingCnt] = useState(0);
  const [loginfollowCnt, setLoginfollowCnt] = useState(0);
  
  const getNweets = useCallback(async () => {
    setLoading(true)
    const ref = firebaseDB.ref('posts');
    ref
    .orderByChild('creatorId')
    .startAt(uid)
    .endAt(uid+"\uf8ff")
    .limitToLast(10 * page)
    .on('value', (snapshot) => {        
      setNweets(reverseObject(snapshot.val()));
    })

    setLoading(false);
  }, [page, uid] );

  const followClick = (event) => {
    event.preventDefault();
    console.log(userObj)
    console.log(user)
    firebaseDB.ref('follows')
    .orderByChild('value')
    .equalTo(userObj.uid+uid)
    .once('value', snapshot => {
        if(snapshot.exists()){ // 이미 누른적 있는경우
            const follows = snapshot.val();
            Object.keys(follows).forEach((follow) => {
              firebaseDB.ref('follows/' + follow).update({
                  isFollow: !follows[follow].isFollow
              })
            })                
        } else {
            firebaseDB.ref('follows').push({
                value: userObj.uid + uid,
                isFollow: true
            });
        }
        console.log(isFollow)
        const _followCnt = loginfollowCnt + (snapshot.exists() && isFollow ? -1 : 1)
        const _followingCnt = followingCnt + (snapshot.exists() && isFollow ? -1 : 1)
        firebaseDB.ref('users/' + userObj.userId).update({
            followCnt: _followCnt
        })
        firebaseDB.ref('users/' + userId).update({
          followingCnt: _followingCnt
        })
        setfollowingCnt(_followingCnt)
        setLoginfollowCnt(_followCnt)
        setIsFollow(!isFollow)
    });  
  }

  useEffect(() => {
    getNweets();
  }, [getNweets]);

  useEffect( () => {
    if (inView && !loading) {
      setPage(page => page + 1)
    }
  }, [inView, loading])
  useEffect(()=>{
    console.log("user")
    if(userObj !== null){
      setLoginfollowCnt(userObj.followCnt);
    }
  }, [userObj])

  useEffect( () =>{
    const userRef = firebaseDB.ref('users');
    userRef
    .orderByChild('uid')
    .startAt(uid)
    .endAt(uid+"\uf8ff")
    .once('value')
    .then(c => {
      const user = c.val()        
      const userId = Object.keys(user)[0];
      setUserId(userId);
      setUser(user[userId] );
      setfollowCnt(user[userId].followCnt)
      setfollowingCnt(user[userId].followingCnt)
    });       
  }, [uid]);

  return (
    <div className="profileEdit_container base">
      { user && (
        <>
        <div className="cover_image base">
            {
                user.coverURL !== "" && <img src={user.coverURL} alt="cover_image" /> 
            }
        </div>
        <div className="profile_container base">
            <img src={user.photoURL} 
                alt="profile_image" /> 
            <span className="profile_name">{user.displayName}</span>
            <span className="user_id">{user.email}</span>
            <span className="join_date">가입일 {moment(user.timestamp).format('ll')}</span>
            <div className="follow_wrap">
                <span className="f_cnt">{followCnt}</span>
                <span className="f_text">팔로우 중</span>
                <span className="f_cnt">{followingCnt}</span>
                <span className="f_text">팔로워</span>
            </div>
            { userObj && userObj.uid !== uid &&
            <button className={`followBtn${isFollow ? ' active' : ''}`} onClick={followClick} >
              {isFollow ? '팔로잉' : '팔로우'}
            </button>
            }
        </div>
        <div> 
        {  
          Object.keys(nweets).map((nweet) => {
              return (<Nweet key={nweet} nweetObj={nweets[nweet]} 
                userObj={userObj} viewRef={(Object.keys(nweets).length -1) === parseInt(nweet) ? ref : null} />)
            }
          )
        }
        </div>
      </>
      )}

    </div>
  );
});

export default Search;
