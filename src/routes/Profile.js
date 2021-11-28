import Nweet from "components/Nweet";
import ProfileEdit from "components/ProfileEdit";
import { dbService } from "fbase";
import { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';


const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);

    const getMyNweets = async () => {
        if(userObj) {
            //const nweets = 
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
    }

    useEffect(()=> {
        getMyNweets();
    }, );

    return (
        <div>
            <ProfileEdit userObj={userObj} />
            
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