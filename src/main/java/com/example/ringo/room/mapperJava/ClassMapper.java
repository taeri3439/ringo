package com.example.ringo.room.mapperJava;

import com.example.ringo.command.ClassVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ClassMapper {
    void insertClass(ClassVO classVO);
    List<ClassVO> getAllClasses();
    ClassVO selectClassByRoomId(String roomId);

    List<ClassVO> selectClassesByUserId(String userId);

    void updateClass(ClassVO classVO);
    void deleteClass(String roomId);

    List<Map<String, Object>> selectRecruitmentPostsByUserId(int userPk);

    ClassVO selectClassByRecruitmentPostId(int recruitmentPostId);

}
