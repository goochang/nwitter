import Nweet from "components/Nweet";
import ProfileEdit from "components/ProfileEdit";
import { dbService } from "fbase";
import { useCallback, useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';


const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);
    const [cover, setCover] = useState("");

    const getMyNweets = useCallback(async () => {
        if(userObj) {
            await dbService.collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "asc")
            .onSnapshot((snapshot) =>{
                const newArray = snapshot.docs.map((document) => ({
                  id: document.id,
                  ...document.data(),
                }));
                setNweets(newArray);
            });
        }
    }, [userObj]);

    const getCover = useCallback(async () => {
        const users = await dbService.collection("users")
        .where("email", "==", userObj.email)
        .get();
    
        console.log("no cover")
        users.forEach((user) => {
            const _user = user.data();
            setCover(_user.coverURL);
        })
    }, [userObj]);

    useEffect(()=> {
        getMyNweets();
        getCover();
    }, [getMyNweets, getCover]);

    return (
        <div>
            <ProfileEdit userObj={userObj} cover={cover} />
            
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} userObj={userObj}
                    isOwner={nweet.creatorId === userObj.uid} />
                )
                )}
            </div>
        </div>
    )
}

export default withRouter(Profile);