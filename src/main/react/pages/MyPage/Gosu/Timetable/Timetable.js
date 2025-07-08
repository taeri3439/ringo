import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import './Timetable.css';

const days = ['일', '월', '화', '수', '목', '금', '토'];
const hourHeight = 60;
const dayWidth = 100;
const headerHeight = 30;
const timeColWidth = 80;

export default function Timetable() {
    const [editMode, setEditMode] = useState(false);
    const [blocks, setBlocks] = useState([]);
    const [savedBlocks, setSavedBlocks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const editingRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);        // 실제로 보여줄 블록 id
    const hoverTimer = useRef(null);                         // hover 타이머

    const snapToGrid = (value, size) => Math.round(value / size) * size;

    const addBlock = () => {
        const newBlock = {
            id: Date.now(),
            x: timeColWidth , // + dayWidth * 0
            y: headerHeight , // + hourHeight * 0
            width: dayWidth,
            height: hourHeight,
            title: '',
            color: '#4169e1',
            textColor: '#ffffff'
        };
        setBlocks([...blocks, newBlock]);
        setEditingId(newBlock.id); // 새 블록 바로 편집
    };



    const onDragStop = (id, d) => {
        const snappedX = snapToGrid(d.x - timeColWidth, dayWidth) + timeColWidth;
        const snappedY = snapToGrid(d.y - headerHeight, hourHeight) + headerHeight;
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, x: snappedX, y: snappedY } : block
        ));
    };

    const onResizeStop = (id, dir, ref, delta, position) => {
        const newWidth = snapToGrid(parseInt(ref.style.width, 10), dayWidth);
        const newHeight = snapToGrid(parseInt(ref.style.height, 10), hourHeight);
        const snappedX = snapToGrid(position.x - timeColWidth, dayWidth) + timeColWidth;
        const snappedY = snapToGrid(position.y - headerHeight, hourHeight) + headerHeight;

        setBlocks(blocks.map(block =>
            block.id === id
                ? {
                    ...block,
                    width: newWidth,
                    height: newHeight,
                    x: snappedX,
                    y: snappedY
                }
                : block
        ));
    };

    const handleSave = () => {
        setEditMode(false);
        setSavedBlocks([...blocks]);
        setEditingId(null);
    };

    const handleTitleChange = (id, value) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, title: value } : block
        ));
    };

    const deleteBlock = (id) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const getMaxHeight = (blockHeight) => {
        return blockHeight - 8; // padding 감안해서 약간 여유
    };

    const handleColorChange = (id, color) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, color } : block
        ));
    };

    const handleTextColorChange = (id, textColor) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, textColor } : block
        ));
    };

    // ✅ 외부 클릭 시 편집 종료
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                editingId !== null &&
                editingRef.current &&
                !editingRef.current.contains(e.target)
            ) {
                setEditingId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editingId]);

    return (

        <div className="timetable-container">

            <div className="timetableTitle">
                <div className="timetableTitleText">
                    수업 시간표
                </div>


                {editMode ? (
                    <>
                        <div className="editButtonInButton">
                            <button onClick={handleSave}>저장하기</button>
                            <button onClick={addBlock}>일정 추가</button>
                        </div>
                    </>
                ) : (
                    <button className="editButton"
                            onClick={() => setEditMode(true)}>수정하기</button>
                )}


            </div>



            <div className="timetable-grid-editable">
                <div className="time-column">
                    <div className="corner-cell" />
                    {Array.from({ length: 16 }, (_, i) => (
                        <div key={i} className="time-label">{7 + i}:00</div>
                    ))}
                </div>

                <div className="days-column">
                    {days.map((day) => (
                        <div key={day} className="day-label" style={{ width: dayWidth }}>{day}</div>
                    ))}
                </div>

                <div className="grid-background">
                    {Array.from({ length: 16 * 7 }, (_, i) => (
                        <div key={i} className="grid-cell" style={{ width: dayWidth, height: hourHeight }} />
                    ))}
                </div>

                {(editMode ? blocks : savedBlocks).map(block => {
                    const isEditing = editingId === block.id;
                    const isHoveredExpanded = hoveredId === block.id && !isEditing; // ✅ 요기 넣기
                    const lineCount = Math.max(2, Math.floor(block.height / hourHeight) * 2);

                    return (
                        <div
                            key={block.id}
                            className="block-wrapper"
                            style={{
                                position: 'absolute',
                                left: block.x,
                                top: block.y,
                                width: block.width,
                                height: block.height
                            }}
                        >
                            <Rnd
                                size={{ width: block.width, height: block.height }}
                                position={{ x: 0, y: 0 }}
                                bounds=".timetable-grid-editable"
                                dragGrid={[dayWidth, hourHeight]}
                                resizeGrid={[dayWidth, hourHeight]}
                                dragAxis={editMode && !isEditing ? 'both' : 'none'}
                                enableResizing={editMode && !isEditing}
                                disableDragging={!editMode || isEditing}
                                onDragStop={(e, d) => onDragStop(block.id, {
                                    x: d.x + block.x,
                                    y: d.y + block.y
                                })}
                                onResizeStop={(e, dir, ref, delta, position) =>
                                    onResizeStop(block.id, dir, ref, delta, {
                                        x: position.x + block.x,
                                        y: position.y + block.y
                                    })
                                }
                                className="block-editable"
                                style={{ backgroundColor: block.color }}
                            >
                                <div
                                    className="block-content"
                                    style={{position: 'relative'}}
                                    ref={isEditing ? editingRef : null}
                                    onClick={() => {
                                        if (editMode && !isEditing) {
                                            setEditingId(block.id);
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (!isEditing) {
                                            hoverTimer.current = setTimeout(() => {
                                                setHoveredId(block.id);
                                            }, 1500);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        clearTimeout(hoverTimer.current);
                                        setHoveredId(null);
                                    }}
                                >
                                    {isEditing ? (
                                        <textarea
                                            value={block.title}
                                            onChange={(e) => handleTitleChange(block.id, e.target.value)}
                                            rows={Math.max(2, (block.height / hourHeight) * 2)}
                                            style={{
                                                width: '100%',
                                                maxHeight: getMaxHeight(block.height),
                                                resize: 'none',
                                                border: 'none',
                                                borderRadius: '10px',
                                                outline: 'none',
                                                background: block.color,
                                                fontSize: '14px',
                                                lineHeight: '1.4',
                                                overflow: 'auto',
                                                padding: '5px 10px',
                                                opacity: 1,
                                                boxSizing: 'border-box',
                                                color: block.textColor || 'white',
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className="text-preview"
                                            style={{
                                                color: block.textColor || 'white',
                                                fontSize: '14px',
                                                lineHeight: '1.4',
                                                padding: '5px 10px',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: isHoveredExpanded ? 'unset' : lineCount,
                                                whiteSpace: 'pre-wrap', // ✅ 줄바꿈 문자도 유지하면서 자동 줄바꿈도 허용
                                                wordBreak: 'break-word', // ✅ 긴 단어 줄바꿈 가능하게
                                                height: '100%',
                                                backgroundColor: isHoveredExpanded ? block.color : 'transparent',
                                                pointerEvents: isHoveredExpanded ? 'auto' : 'none',
                                                maxHeight: isHoveredExpanded ? 'none' : `${lineCount * 20}px`,
                                            }}
                                        >
                                            {block.title || '일정없음'}
                                        </div>


                                    )}
                                </div>

                                {editMode && (
                                    <>
                                        <input
                                            type="color"
                                            value={block.color}
                                            onChange={(e) => handleColorChange(block.id, e.target.value)}
                                        />

                                        {/* 글자색 A 버튼 - label로 감싸기 */}
                                        <div style={{ marginLeft: '4px', position: 'absolute', left: '28px', top: '-27px' }}>
                                            <label style={{ position: 'relative', display: 'inline-block' }}>
                                                <div
                                                    style={{
                                                        backgroundColor: block.textColor || '#ffffff',
                                                        border: '2px solid #ccc',
                                                        borderRadius: '6px',
                                                        width: '28px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px',
                                                        color: 'black',
                                                        userSelect: 'none',
                                                    }}
                                                >
                                                    A
                                                </div>
                                                <input
                                                    type="color"
                                                    value={block.textColor || '#ffffff'}
                                                    onChange={(e) => handleTextColorChange(block.id, e.target.value)}
                                                    style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        opacity: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </label>
                                        </div>

                                    </>
                                )}
                            </Rnd>

                            {editMode && (
                                <button
                                    className="floating-delete-button"
                                    onClick={() => deleteBlock(block.id)}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
