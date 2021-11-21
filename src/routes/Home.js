import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

function Home({userObj}) {
  const [nweets, setNweets] = useState([]);

    useEffect( () =>{
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
    }, []);


    console.log(nweets)
  return (
    <div className="container">
      <NweetFactory userObj={userObj}  />
      <div> 
        {  
        nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet}
          // isOwner={nweet.creatorId === userObj.uid} 
          />
        )
        )}
      </div>
    </div>
  );
}

export default Home;
