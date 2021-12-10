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
  const uid = match.params.key1;

  const [ref, inView] = useInView()
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  
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

  useEffect(() => {
    getNweets();
  }, [getNweets]);

  useEffect( () => {
    if (inView && !loading) {
      setPage(page => page + 1)
    }
  }, [inView, loading])

  useEffect( () =>{
    const userRef = firebaseDB.ref('users');
    userRef
    .orderByChild('uid')
    .startAt(uid)
    .endAt(uid+"\uf8ff")
    .once('value')
    .then(c => {
      const user = c.val()        
      setUser(user[Object.keys(user)[0]] );
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
            <span className="join_date">Joined {moment(user.timestamp).format('ll')}</span>
            <div className="follow_wrap">
                <span className="f_cnt">10</span>
                <span className="f_text">Following</span>
                <span className="f_cnt">0</span>
                <span className="f_text">Followers</span>
            </div>
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
        {
          inView ? "로딩중 ": "맨끝임"
        }
      </>
      )}

    </div>
  );
});

export default Search;
