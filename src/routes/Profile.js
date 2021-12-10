import Nweet from "components/Nweet";
import ProfileEdit from "components/ProfileEdit";
import { dbService, firebaseDB } from "fbase";
import { reverseObject } from "helpers/help";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { withRouter } from 'react-router-dom';

const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);
    const [ref, inView] = useInView()
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false)

    const getMyNweets = useCallback(async () => {
        if(userObj) {
            const ref = firebaseDB.ref('posts');
            ref
            .orderByChild('creatorId')
            .equalTo(userObj.uid)
            .limitToLast(10 * page)
            .on('value', (snapshot) => {
                setNweets(reverseObject(snapshot.val()));
            })
        }
    }, [userObj,page]);

    useEffect(()=> {
        getMyNweets();
    }, [getMyNweets]);

    useEffect( () => {
        console.log(inView)
        if (inView && !loading) {
            console.log("next")
            setPage(page => page + 1)
        }
    }, [inView, loading])
    
    return (
        <div>
            <ProfileEdit userObj={userObj} />
            <div>
                {
                    nweets && Object.keys(nweets).map((nweet) => {
                        return (<Nweet key={nweet} nweetObj={nweets[nweet]} userObj={userObj}
                            isOwner={nweets[nweet].creatorId === userObj.uid} 
                            viewRef={(Object.keys(nweets).length -1) === parseInt(nweet) ? ref : null}/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Profile);