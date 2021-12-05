import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

function Home({userObj}) {
  const [nweets, setNweets] = useState([]);

    useEffect( () =>{
      console.log(userObj);
      dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>{
        const newArray = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setNweets(newArray);
      })
    }, [userObj]);

  return (
    <div>
      <NweetFactory userObj={userObj}  />
      <div> 
        {  
        nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} userObj={userObj}
          // isOwner={nweet.creatorId === userObj.uid} 
          />
        )
        )}
      </div>
    </div>
  );
}

export default Home;
