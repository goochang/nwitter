import Nweet from "components/Nweet";
import ProfileEdit from "components/ProfileEdit";
import { dbService, firebaseDB } from "fbase";
import { useCallback, useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';

const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);

    const getMyNweets = useCallback(async () => {
        if(userObj) {
            const ref = firebaseDB.ref('posts');
            ref
            .orderByChild('creatorId')
            .startAt(userObj.uid)
            .endAt(userObj.uid+"\uf8ff")
            .on('value', (snapshot) => {
                console.log(snapshot.val()) 
                setNweets(snapshot.val());
            })
        }
    }, [userObj]);

    useEffect(()=> {
        getMyNweets();
    }, [getMyNweets]);

    return (
        <div>
            <ProfileEdit userObj={userObj} />
            <div>
                {
                    nweets && Object.keys(nweets).map((nweet) => {
                        return (<Nweet key={nweet} nweetObj={nweets[nweet]} userObj={userObj}
                            isOwner={nweets[nweet].creatorId === userObj.uid} />
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Profile);