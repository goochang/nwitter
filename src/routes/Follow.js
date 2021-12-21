import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB } from "fbase";
import { reverseObject, toArrayObject } from "helpers/help";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { withRouter } from "react-router-dom";

const Follow = ({match, userObj}) => {
  const [nweets, setNweets] = useState([]);
  const [follows, setFollows] = useState({});
  const [ref, inView] = useInView()
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
 
  const getFollwers = useCallback(async () => {
    if(userObj !== null && userObj){
      const ref = firebaseDB.ref('follows');
      ref
      .orderByChild('from')
      .equalTo(userObj.uid)
      .on('value', (snapshot) => {    
        setFollows(toArrayObject(snapshot.val()))
      });
    }
  }, [userObj] );

  const getNweets = useCallback(async () => {
    setLoading(true)
    const ref = firebaseDB.ref('posts');
    ref
    .orderByChild('createdAt')
    .limitToLast(10 * page)
    .on('value', (snapshot) => {      
      const result = reverseObject(snapshot.val());
      let nweets_result = [];
      Object.keys(result).forEach((nweet) => {
        const value = result[nweet];
        if(Array.isArray(follows) && follows.find(val => val.to === value.creatorId) ){
          // console.log(value)
          nweets_result = [...nweets_result, value];
        }
      });
      setNweets(nweets_result)
      
    })
    setLoading(false);
  }, [page, follows] );

  useEffect(() => {
    getFollwers();
  }, [getFollwers]);

  useEffect(() => {
    getNweets();
  }, [getNweets]);

  useEffect( () => {
    if (inView && !loading) {
      setPage(page => page + 1)
    }
  }, [inView, loading])

  return (
    <div>
      {/* <NweetFactory userObj={userObj}  /> */}
      <div className={`base ${nweets ? "postList" : "noPostList"}`}> 
        {
          nweets.length !== 0 ?
          Object.keys(nweets).map((nweet) => {
            return (
              <Nweet key={nweet} nweet_key={nweet} nweetObj={nweets[nweet]} 
              userObj={userObj} viewRef={(Object.keys(nweets).length -1) === parseInt(nweet) ? ref : null} />
            )
          })
          : <span>팔로워중인 사람이 없습니다</span>
        }
      </div>
    </div>
  );

};

export default Follow;
