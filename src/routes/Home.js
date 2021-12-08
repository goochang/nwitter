import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB } from "fbase";
import { reverseObject } from "helpers/help";
import React, { useEffect, useState } from "react";

function Home({userObj}) {
  const [nweets, setNweets] = useState({});

    useEffect( () =>{
      const ref = firebaseDB.ref('posts');
      ref
      .orderByChild('createdAt')
      .on('value', (snapshot) => {        
        setNweets(reverseObject(snapshot.val()));
      })
    }, []);

  return (
    <div>
      <NweetFactory userObj={userObj}  />
      <div className={`base ${nweets ? "postList" : "noPostList"}`}> 
        {
          nweets ?
          Object.keys(nweets).map((nweet) => {
            return (
              <Nweet key={nweet} nweet_key={nweet} nweetObj={nweets[nweet]} userObj={userObj}/>
            )
          })
          : <span>글이 없습니다</span>
        }
      </div>
    </div>
  );
}

export default Home;
