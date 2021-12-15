import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService, firebaseDB } from "fbase";
import { reverseObject } from "helpers/help";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { withRouter } from "react-router-dom";

const Home = ({match, userObj}) => {
  const [nweets, setNweets] = useState({});
  const [ref, inView] = useInView()
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  
  const getNweets = useCallback(async () => {
    setLoading(true)
    const ref = firebaseDB.ref('posts');
    ref
    .orderByChild('createdAt')
    .limitToLast(10 * page)
    .on('value', (snapshot) => {        
      setNweets(reverseObject(snapshot.val()));
    })

    setLoading(false);
  }, [page] );

  useEffect(() => {
    getNweets();
  }, [getNweets]);

  useEffect( () => {
    console.log(inView)
    if (inView && !loading) {
      setPage(page => page + 1)
    }
  }, [inView, loading])

  return (
    <div>
      <NweetFactory userObj={userObj}  />
      <div className={`base ${nweets ? "postList" : "noPostList"}`}> 
        {
          nweets ?
          Object.keys(nweets).map((nweet) => {
            return (
              <Nweet key={nweet} nweet_key={nweet} nweetObj={nweets[nweet]} 
              userObj={userObj} viewRef={(Object.keys(nweets).length -1) === parseInt(nweet) ? ref : null} />
            )
          })
          : <span>글이 없습니다</span>
        }

        {
          inView ? "로딩중 ": "맨끝임"
        }
      </div>
    </div>
  );

};

export default Home;
