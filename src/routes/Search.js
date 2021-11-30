import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB, firebaseInstance } from "fbase";
import React, { useEffect, useState } from "react";

const Search = ({match}) => {
  const [nweets, setNweets] = useState([]);
  const search = match.params.key1;

    useEffect( () =>{
      console.log(search)
      // dbService
      // .collection("nweets")
      // // .where("creatorName", "==", )
      // .orderBy("createdAt", "desc")
      // .get()
      // .then((snapshot) =>{
      //   const newArray = snapshot.docs.map((document) => ({
      //     id: document.id,
      //     ...document.data(),
      //   }));
      //   setNweets(newArray);
      // })

      // const db = firebaseDB;
      // const ref = db.ref('nweets');
      // console.log(ref)
      // ref.on("value", function(snapshot) {
      //   console.log(snapshot.val());
      //   snapshot.forEach(function(data) {
      //       console.log(data.key);
      //   });
      // });

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
      // .orderByChild('createdAt')
      // .on("child_added", function (snapshot) {
      //   snapshot.forEach(function(child) {
      //       console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
      //   });
      // });
      // .startAt('cho')
      // .endAt("cho\uf8ff")
      // .once('value')
      // .then(c => console.log(c.val()));
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
