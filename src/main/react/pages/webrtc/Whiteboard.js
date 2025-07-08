import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";
import "./WhiteBoard.css";
import io from "socket.io-client";

const socket = io("http://172.30.1.12:8687");

function Whiteboard({ isActive }) {
    const canvasRef = useRef(null);
    const currentTool = useRef("pen");
    const drawing = useRef(false);
    const shapeRef = useRef(null);
    const start = useRef({ x: 0, y: 0 });
    const color = useRef("#000000");

    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

    // 삭제 단축키
    const handleKeyDown = (e) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;
        if (["Delete", "Backspace", "Escape"].includes(e.key)) {
            if (!activeObject.id) return;
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            socket.emit("remove-object", { id: activeObject.id });
        }
    };

    useEffect(() => {
        if (!isActive) return;

        // 방 입장
        const room = window.roomId || "testRoom";
        const username = window.userName || "익명";
        socket.emit("join room", { room, username });

        const canvasEl = document.getElementById("canvas");

        if (canvasRef.current) {
            canvasRef.current.setWidth(canvasEl.clientWidth);
            canvasRef.current.setHeight(canvasEl.clientHeight);
            return;
        }

        // fabric 캔버스 생성
        const canvas = new fabric.Canvas("canvas", {
            isDrawingMode: true,
            selection: true,
        });
        canvas.setWidth(canvasEl.clientWidth);
        canvas.setHeight(canvasEl.clientHeight);
        canvasRef.current = canvas;

        // 기본 펜 설정
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = "#000000";
        canvas.freeDrawingBrush.width = 5;

        // 툴바 이벤트
        document.getElementById("select").onclick = () => {
            currentTool.current = "select";
            canvas.isDrawingMode = false;
            canvas.selection = true;
            canvas.defaultCursor = "default";
        };
        document.getElementById("pen").onclick = () => {
            currentTool.current = "pen";
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = color.current;
            canvas.freeDrawingBrush.width = parseInt(document.getElementById("brushWidth").value, 10);
        };
        document.getElementById("eraser").onclick = () => {
            currentTool.current = "eraser";
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = "#f0f0f0";
            canvas.freeDrawingBrush.width = parseInt(document.getElementById("brushWidth").value, 10);
        };
        document.getElementById("addRect").onclick = () => {
            currentTool.current = "rect";
            canvas.isDrawingMode = false;
        };
        document.getElementById("addCircle").onclick = () => {
            currentTool.current = "circle";
            canvas.isDrawingMode = false;
        };

        // 색상/두께 변경
        document.getElementById("colorPicker").oninput = (e) => {
            color.current = e.target.value;
            if (currentTool.current === "pen" || currentTool.current === "eraser") {
                canvas.freeDrawingBrush.color = color.current;
            }
        };
        document.getElementById("brushWidth").oninput = (e) => {
            canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
        };

        // 도형 드래그로 생성
        canvas.on("mouse:down", (opt) => {
            if (canvas.getActiveObject()) return;
            if (currentTool.current === "rect" || currentTool.current === "circle") {
                drawing.current = true;
                canvas.selection = false;
                const p = canvas.getPointer(opt.e);
                start.current = { x: p.x, y: p.y };
                const shape = currentTool.current === "rect"
                    ? new fabric.Rect({
                        left: p.x, top: p.y, width: 1, height: 1,
                        stroke: color.current, fill: 'rgba(0,0,0,0.1)', strokeWidth: 2, id: generateId()
                    })
                    : new fabric.Circle({
                        left: p.x, top: p.y, radius: 1,
                        stroke: color.current, fill: 'rgba(0,0,0,0.1)', strokeWidth: 2, id: generateId()
                    });
                shapeRef.current = shape;
                canvas.add(shape);
            }
        });

        canvas.on("mouse:move", (opt) => {
            if (!drawing.current || !shapeRef.current) return;
            const p = canvas.getPointer(opt.e);
            const s = start.current;
            const shape = shapeRef.current;
            if (currentTool.current === "rect") {
                shape.set({
                    width: Math.abs(p.x - s.x),
                    height: Math.abs(p.y - s.y),
                    left: Math.min(p.x, s.x),
                    top: Math.min(p.y, s.y)
                });
            } else if (currentTool.current === "circle") {
                const dx = p.x - s.x;
                const dy = p.y - s.y;
                const radius = Math.sqrt(dx * dx + dy * dy) / 2;
                shape.set({
                    radius,
                    left: (p.x + s.x) / 2,
                    top: (p.y + s.y) / 2
                });
            }
            shape.setCoords();
            canvas.renderAll();
        });

        canvas.on("mouse:up", () => {
            if (drawing.current && shapeRef.current) {
                const shape = shapeRef.current;
                shape.selectable = true;
                shape.evented = true;
                shape.id = shape.id || generateId();
                shape._wasCreatedNow = true;
                setTimeout(() => {
                    const objData = shape.toObject([
                        'id', 'type', 'left', 'top', 'width', 'height', 'fill', 'stroke', 'strokeWidth',
                        'radius', 'rx', 'ry', 'angle', 'scaleX', 'scaleY', 'originX', 'originY'
                    ]);
                    objData.type = objData.type.toLowerCase();
                    if (shape._wasCreatedNow && objData.type !== "path") {
                        socket.emit("add-object", objData);
                        delete shape._wasCreatedNow;
                    } else if (objData.type !== "path") {
                        socket.emit("modify-object", objData);
                    }
                }, 20);
                drawing.current = false;
                shapeRef.current = null;
                canvas.selection = true;
                canvas.renderAll();
                return;
            }
        });

        // 소켓 연동
        canvas.on("path:created", (e) => {
            const pathData = e.path.toObject(['path','left','top','stroke','strokeWidth','fill','id']);
            socket.emit("draw-path", pathData);
        });

        socket.on("draw-path", (pathObj) => {
            const safeObj = {
                ...pathObj,
                left: pathObj.left ?? 0,
                top: pathObj.top ?? 0,
                scaleX: pathObj.scaleX ?? 1,
                scaleY: pathObj.scaleY ?? 1,
            };
            const path = new fabric.Path(safeObj.path, safeObj);
            path.id = pathObj.id || generateId();
            canvas.add(path);
            canvas.renderAll();
        });

        socket.on("add-object", (objData) => {
            const { type, ...rest } = objData;
            let obj = null;
            switch ((type || '').toLowerCase()) {
                case "rect":
                    obj = new fabric.Rect(rest);
                    break;
                case "circle":
                    obj = new fabric.Circle(rest);
                    break;
                case "triangle":
                    obj = new fabric.Triangle(rest);
                    break;
                case "path":
                    obj = new fabric.Path(rest.path, rest);
                    break;
                default:
                    return;
            }
            obj.id = objData.id || generateId();
            obj.scaleX = rest.scaleX || 1;
            obj.scaleY = rest.scaleY || 1;
            obj.setCoords();
            obj._isRemote = true;
            canvas.add(obj);
            canvas.renderAll();
        });

        canvas.on("object:modified", (e) => {
            const obj = e.target;
            if (!obj.id) return;
            const data = obj.toObject(['id','left','top','scaleX','scaleY','angle','width','height','radius']);
            socket.emit("modify-object", data);
        });

        socket.on("modify-object", (data) => {
            const obj = canvas.getObjects().find(o => o.id === data.id);
            if (obj) {
                obj.set(data);
                canvas.renderAll();
            }
        });

        canvas.on("object:removed", (e) => {
            const obj = e.target;
            if (obj && obj.id) {
                socket.emit("remove-object", obj.id);
            }
        });

        socket.on("remove-object", ({ id }) => {
            const target = canvas.getObjects().find(obj => obj.id === id);
            if (target) {
                canvas.remove(target);
                canvas.renderAll();
            }
        });

        socket.emit("request-canvas-init");
        socket.on("canvas-init", (json) => {
            canvas.loadFromJSON(json, () => canvas.renderAll());
        });

        // 단축키
        window.addEventListener("keydown", handleKeyDown);

        // 해제
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            socket.off("draw-path");
            socket.off("add-object");
            socket.off("modify-object");
            socket.off("remove-object");
            socket.off("canvas-init");
        };
    }, [isActive]);

    return (
        <div className="whiteboard-container">
            <div className="toolbar">
                <button id="select">선택</button>
                <button id="pen">펜</button>
                <button id="eraser">지우개</button>
                <button id="addRect">사각형</button>
                <button id="addCircle">원</button>
                <label>
                    두께:<br/>
                    <input
                        type="range"
                        id="brushWidth"
                        min="1"
                        max="50"
                        defaultValue="5"
                        className="width-slider"
                    />
                </label>
                <label>
                    색상:<br/>
                    <input type="color" id="colorPicker" defaultValue="#000000"/>
                </label>
            </div>
            <canvas id="canvas" className="canvas"></canvas>
        </div>
    );
}

export default Whiteboard;
