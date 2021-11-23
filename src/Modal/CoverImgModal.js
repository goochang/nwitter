import ProfileImgModal from "./ProfileImgModal";

const CoverImgModal = ({setModalContent}) => {
    return (
        <div className="base">
            <label for="cover-file">cover Img</label>

            <button onClick={() => setModalContent(<ProfileImgModal setModalContent={setModalContent}/>)}>go profile</button>
        </div>
    )
}

export default CoverImgModal; 