import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CoverImgModal from "./CoverImgModal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import React, { useRef, useState } from "react";

const CoverImgEditModal = ({setModalContent, userObj, setModalNum, profileImg, coverImg, setProfileImg, setCoverImg, openModal, prevCover}) => {

    const [crop, setCrop] = useState({
        unit: "px",
        width: 500,
        height: 200,
        aspect: 16 / 9
    });
    const [completedCrop, setCompletedCrop] = useState(null);

    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const onImageLoaded = (image) => {
        imageRef.current = image;
    };

    const onChange = (_crop) => {
        setCrop(_crop);
        console.log(_crop)
        if(imageRef.current !== null) {
            const y_val = (_crop.y - 25) + "px";
            imageRef.current.style.bottom = y_val;
        }  
    }

    const onCropComplete = (crop) => {
        setCompletedCrop(crop)
        makeClineCrop(crop);        
    }

    const makeClineCrop = async (crop)  =>{
        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg();
            setCroppedImageUrl(croppedImageUrl);
            setProfileImg(croppedImageUrl);
        }
    }

    const getCroppedImg = () =>{
        if (!completedCrop || !previewCanvasRef.current || !imageRef.current) {
            return;
        }
        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
    
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
    
        canvas.width = 500;
        canvas.height = 200;
        canvas.style.width = "500px";
        canvas.style.height = "200px";
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            500,
            200
        ); 

        console.log("cap")
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = "newFile.jpeg";
                    window.URL.revokeObjectURL(fileUrl);
                    setFileUrl(window.URL.createObjectURL(blob));
                    resolve(fileUrl);
                },
                'image/jpeg',
                1
            );
        });
    }

    return (
        <div className="profile_modal base profile_edit_modal">
            <div className="profile_edit_nav base">
                <button className="cancelBtn" onClick={() => {
                    setModalNum(1);
                    setModalContent(
                        <CoverImgModal 
                            setModalContent={setModalContent} 
                            userObj={userObj}
                            setModalNum={setModalNum}
                            profileImg={profileImg}
                            coverImg={prevCover}
                            openModal={openModal}
                            setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                    />);
                }} >
                    <FontAwesomeIcon icon={faArrowLeft} color={"rgb(217, 217, 217)"} size="1x" />
                </button>
                <span>미디어 편집</span>
                <div>
                    <button className="okBtn" aria-disabled={fileUrl === ""} onClick={() => {
                        if(fileUrl === "") return;
                        setModalNum(3);
                        setModalContent(
                            <CoverImgModal 
                            setModalContent={setModalContent} 
                            userObj={userObj}
                            setModalNum={setModalNum}
                            profileImg={profileImg}
                            coverImg={fileUrl}
                            openModal={openModal}
                            setProfileImg={setProfileImg} setCoverImg={setCoverImg}
                        />);
                    }} >적용하기</button>
                </div>
            </div>

            <div className="img_preview base center ">
                {coverImg && (
                
                <ReactCrop
                    src={coverImg}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={(i) => onImageLoaded(i)}
                    onChange={(c, pc) => onChange(c)}
                    onCropChange
                    onComplete={(c, pc) => onCropComplete(c)}
                    locked={true}
                    className="cover_crop"
                />
                )}
                {coverImg && (
                    <div>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                      }}
                    />
                  </div>
                )}
            </div>
        </div>
    )
}
export default CoverImgEditModal;