package com.example.ringo.room.service;

import com.example.ringo.command.ClassVO;

import com.example.ringo.room.mapperJava.ClassMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ClassServiceImpl implements ClassService {

    @Autowired
    private ClassMapper classMapper;

    @Override
    public void createClass(ClassVO classVO) {
        // 고유 roomId 생성
        classVO.setRoomId(UUID.randomUUID().toString());
        classMapper.insertClass(classVO);
    }

    @Override
    public List<ClassVO> getAllClasses() {
        return classMapper.getAllClasses();
    }

    @Override
    public ClassVO getClassByRoomId(String roomId) {
        return classMapper.selectClassByRoomId(roomId);
    }

    @Override
    public List<ClassVO> getClassesByUserId(String userId) {
        return classMapper.selectClassesByUserId(userId);
    }

    @Override
    public void updateClass(ClassVO classVO) {
        classMapper.updateClass(classVO);
    }

    @Override
    public void deleteClass(String roomId) {
        classMapper.deleteClass(roomId);
    }

    @Override
    public List<Map<String, Object>> getRecruitmentPostsByUserId(int userPk) {
        return classMapper.selectRecruitmentPostsByUserId(userPk);
    }

    @Override
    public ClassVO getClassByRecruitmentPostId(int recruitmentPostId) {
        return classMapper.selectClassByRecruitmentPostId(recruitmentPostId);
    }
}
