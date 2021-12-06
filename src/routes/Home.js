import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB } from "fbase";
import React, { useEffect, useState } from "react";

function Home({userObj}) {
  const [nweets, setNweets] = useState({});

    useEffect( () =>{
      const ref = firebaseDB.ref('posts');
      ref
      .orderByChild('createdAt')
      .on('value', (snapshot) => {
        console.log(snapshot.val()) 
        setNweets(snapshot.val());
      })
    }, []);

  return (
    <div>
      <NweetFactory userObj={userObj}  />
      <div> 
        {  
          Object.keys(nweets).map((nweet) => {
            return (<Nweet key={nweet} nweetObj={nweets[nweet]} userObj={userObj}
            // isOwner={nweet.creatorId === userObj.uid} 
              />)
            }
          )
        }
      </div>
    </div>
  );
}

export default Home;
