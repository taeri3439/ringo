package com.example.ringo.room.service;

import com.example.ringo.command.ClassVO;

import java.util.List;
import java.util.Map;

public interface ClassService {
    void createClass(ClassVO classVO);
    List<ClassVO> getAllClasses();
    ClassVO getClassByRoomId(String roomId);

    List<ClassVO> getClassesByUserId(String userId);

    void updateClass(ClassVO classVO);
    void deleteClass(String roomId);

    List<Map<String, Object>> getRecruitmentPostsByUserId(int userPk);

    ClassVO getClassByRecruitmentPostId(int recruitmentPostId);
}
