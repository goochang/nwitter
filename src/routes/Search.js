import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB, firebaseInstance } from "fbase";
import React, { useEffect, useState } from "react";

const Search = ({match}) => {
  const [nweets, setNweets] = useState([]);
  const search = match.params.key1;

    useEffect( () =>{
      console.log(search)

      const ref = firebaseDB.ref('posts');

      ref
      .orderByChild('text')
      .startAt(search)
      .endAt(search+"\uf8ff")
      .once('value')
      .then(c => {
        console.log(c.val()) 
        setNweets(c.val());
      });      
    }, [search]);

  return (
    <div>
        <div> 
        {  
          Object.keys(nweets).map((nweet) => {
              return (<Nweet nweetObj={nweets[nweet]} />)
            }
          )
        }
      </div>
    </div>
  );
}

export default Search;
