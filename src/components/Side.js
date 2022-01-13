import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, firebaseDB } from "fbase";
import RegisterModal from "Modal/register/RegisterModal";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import PImg from '../img/default_profile_normal.png';

const Side = ({refreshUser}) => {
    const [searchValue, setSearchValue] = useState("")
    const [isFocus, setIsFocus] = useState(false)
    const [users, setUsers] = useState([]);
    const [isLogin, setIsLogin] = useState(false);

    const [isModal, setIsModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const history = useHistory();

    const onChange = (event) => {
        console.log("onchange")
        const { target: {value} } = event;
        setSearchValue(value)
        
        if(value !== "" && searchValue !== value){
            const ref = firebaseDB.ref('users');
            ref
            .orderByChild('displayName')
            .startAt(value)
            .endAt(value+"\uf8ff")
            .once('value')
            .then(c => {
                console.log(c.val()) 
                setUsers(c.val());
            });      
        } else {
            setUsers([])
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        history.push('/search/' + searchValue );
    }
    const openModal = () => {
        if(!isModal)
            setModalContent(
            <RegisterModal 
                setModalContent={setModalContent} 
                onRequestClose={onRequestClose}
                refreshUser={refreshUser}
            />)
        setIsModal(!isModal);
    }

    const onRequestClose = () => {
        setIsModal(false);
    }
    const handleMouseDown = (e) => {
        console.log("h")
        if(isFocus)
            e.preventDefault()
    }
    useEffect(()=> {
        authService.onAuthStateChanged((user)=>{
            setIsLogin(user !== null)
          })
    },)
    return (
        <div className="side base">
            <div className={`base ${isFocus ? "focus search_container" : "search_container"}`}>
                <label htmlFor="sInput" className="search_label base">
                    <div>
                        <FontAwesomeIcon icon={faSearch} color={"rgb(217, 217, 217)"} size="1x" />
                    </div>
                    <div>
                        <form onSubmit={onSubmit}>
                            <input type="text" value={searchValue} onChange={onChange} className="searchInput" 
                            placeholder="Search Nwitter" autoComplete="off" id="sInput"
                            onFocus={()=> {setIsFocus(true)}} onBlur={()=> {setIsFocus(false)}} />
                        </form>
                    </div>
                </label>
            </div>
            <div className={`base ${isFocus ? "focus searchResult" : "searchResult"}`}>
                <nav>
                    { isFocus && users !== null &&
                        Object.keys(users).map((nweet) => {
                            const user = users[nweet];
                            console.log(user)
                            return(   
                                <Link to={`/search/${user.uid}`}
                                onMouseDown={handleMouseDown}>
                                    <div className="base resultWrap">
                                        <img src={user.photoURL === "" ? PImg : user.photoURL } alt="" />
                                        <div className="base">
                                            <span className="displayName">
                                                {user.displayName}
                                            </span>
                                            <span className="userID">
                                                {user.email}
                                            </span>
                                            <span className="user_addi">
                                                {user.introduce}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );  
                        })
                    }
                </nav>
            </div>

            { !isLogin && (
                <>
                <div className="goRegister base">
                    <div className="t1">
                        <span>트위터에 처음이세요?</span>
                    </div>
                    <div className="t2">
                        <span>지금 가입해서 나에게 맞춤 설정된 타임라인을 만들어 보세요!</span>
                    </div>
                    <div className="t3">
                        <button onClick={openModal}>가입하기</button>
                    </div>
                </div>
                <div className="goRegister base">
                    <div className="t2">
                        <p>github.io에 구글로그인 연결관련해서 회원가입에 문제가 있습니다..</p>
                        <p>test@test.com / test123으로 로그인해서 테스트부탁드립니다</p>
                    </div>
                </div>
                </>
            )}

            <ReactModal 
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={false}
                onRequestClose={()=> onRequestClose() }
                isOpen={isModal}
                ariaHideApp={false}
                appElement={document.getElementById('app')}
                className="base"
            >
                {modalContent}
            </ReactModal>
            
        </div>
    )
}

export default Side;