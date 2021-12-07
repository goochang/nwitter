import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB, firebaseInstance } from "fbase";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Search = ({match}) => {
  const [nweets, setNweets] = useState([]);
  const [user, setUser] = useState(null);
  const uid = match.params.key1;

    useEffect( () =>{
      console.log(uid)
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

      const postRef = firebaseDB.ref('posts');
      postRef
      .orderByChild('creatorId')
      .startAt(uid)
      .endAt(uid+"\uf8ff")
      .once('value')
      .then(c => {
        console.log(c.val()) 
        setNweets(c.val());
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
            <span className="profile_name">{user.nickname}</span>
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
              return (<Nweet key={nweet} nweetObj={nweets[nweet]} />)
            }
          )
        }
        </div>
      </>
      )}
    </div>
  );
}

export default Search;
