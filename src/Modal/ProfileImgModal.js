import CoverImgModal from "./CoverImgModal";

const ProfileImgModal = ({setModalContent}) => {
    return (
        <div className="base">
            <label for="profile-file">profile Img</label>

            <button onClick={() => setModalContent(<CoverImgModal setModalContent={setModalContent} />)}>cover</button>
        </div>
    )
}

export default ProfileImgModal;