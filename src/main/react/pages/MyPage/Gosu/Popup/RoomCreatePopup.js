import React, { useState, useEffect } from 'react';
import './RoomCreatePopup.css';

const DEFAULT_IMAGE_URL = '/img/screen1.jpg';

function RoomCreatePopup({ onClose, onClassCreate, editMode = false, initialData = {}, onUpdate }) {
    const {
        roomId = '',
        title: initialTitle = '',
        description: initialDescription = '',
        price: initialPrice = '',
        password: initialPassword = '',
        imageUrl: initialImageUrl = ''
    } = initialData;

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [usePassword, setUsePassword] = useState(!!initialData?.password);
    const [password, setPassword] = useState(initialData?.password || '');
    const [image, setImage] = useState(null);
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');

    useEffect(() => {
        fetch('/api/classes/my-classes')
            .then(res => res.json())
            .then(data => setMyClasses(data))
            .catch(err => console.error('수업 목록 불러오기 실패:', err));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handlePasswordOptionChange = (usePw) => {
        setUsePassword(usePw);
        if (!usePw) setPassword('');
    };

    const validatePrice = () => {
        const numericPrice = parseFloat(price);
        return !isNaN(numericPrice) && numericPrice <= 99999999.99;
    };

    const buildFormData = () => {
        const formData = new FormData();
        formData.append("recruitment_post_id", selectedClassId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", parseFloat(price));
        formData.append("password", usePassword ? password : "");

        if (image) {
            formData.append("image", image);
        }

        return formData;
    };

    const handleSubmit = async () => {
        if (!selectedClassId) {
            alert("수업을 선택하세요.");
            return;
        }
        if (!validatePrice()) {
            alert("가격은 99999999.99 이하의 숫자여야 합니다.");
            return;
        }

        const url = editMode ? `/api/classes/${initialData?.roomId}` : '/api/classes';
        const method = editMode ? 'PUT' : 'POST';
        const formData = buildFormData();

        try {
            const res = await fetch(url, {
                method,
                body: formData
            });

            if (res.ok) {
                if (editMode) {
                    const updatedClass = {
                        ...initialData,
                        title,
                        description,
                        price: parseFloat(price),
                        password: usePassword ? password : null,
                        imageUrl: image ? URL.createObjectURL(image) : initialImageUrl
                    };
                    onUpdate(updatedClass);
                } else {
                    const roomId = await res.text();
                    const newClass = {
                        roomId,
                        title,
                        description,
                        price: parseFloat(price),
                        imageUrl: image ? URL.createObjectURL(image) : DEFAULT_IMAGE_URL,
                        password: usePassword ? password : null
                    };
                    onClassCreate(newClass);
                }
                onClose();
            } else {
                alert(editMode ? "수업 수정 실패" : "수업 생성 실패");
            }
        } catch (err) {
            console.error("요청 중 오류 발생:", err);
        }
    };

    return (
        <div className="ai-popup-overlay" onClick={onClose}>
            <div className="ai-popup" onClick={e => e.stopPropagation()}>
                <h3>{editMode ? "방 수정하기" : "방 만들기"}</h3>

                <label>수업 선택</label>
                <select
                    className="popup-input"
                    value={selectedClassId}
                    onChange={e => setSelectedClassId(e.target.value)}
                >
                    <option value="">수업을 선택하세요</option>
                    {myClasses.map(cls => (
                        <option key={cls.recruitment_post_id} value={cls.recruitment_post_id}>
                            {cls.recruitment_post_title}
                        </option>
                    ))}
                </select>

                <label>방 제목</label>
                <input
                    type="text"
                    className="popup-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="방 제목을 입력하세요"
                />

                <label>설명</label>
                <textarea
                    className="popup-textarea"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="방에 대한 설명을 입력하세요"
                    rows="4"
                />

                <label>가격</label>
                <input
                    type="number"
                    className="popup-input"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="가격을 입력하세요"
                />

                <label>이미지</label>
                <input
                    type="file"
                    className="popup-input"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <label>비밀번호 설정</label>
                <div className="popup-radio-group">
                    <label>
                        <input
                            type="radio"
                            name="passwordOption"
                            value="no"
                            checked={!usePassword}
                            onChange={() => handlePasswordOptionChange(false)}
                        /> 없음
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="passwordOption"
                            value="yes"
                            checked={usePassword}
                            onChange={() => handlePasswordOptionChange(true)}
                        /> 있음
                    </label>
                </div>

                {usePassword && (
                    <input
                        type="password"
                        className="popup-input"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                )}

                <div className="okBtn">
                    <button onClick={handleSubmit}>확인</button>
                </div>
            </div>
        </div>
    );
}

export default RoomCreatePopup;
