package com.example.ringo.mypage.mapperJava;

import com.example.ringo.command.ClassManageVO;
import com.example.ringo.command.MyPageVO;
import com.example.ringo.command.ScheduleVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserClassMapper {
    List<MyPageVO> getMyApplyClass(@Param("userPrimaryId") int userPrimaryId);

    List<MyPageVO> getMyWish(@Param("userPrimaryId") int userPrimaryId);

    int checkWishExists(MyPageVO vo);

    void updateWish(MyPageVO vo);

    void insertWish(MyPageVO vo);

    List<MyPageVO> getMyReview(@Param("userPrimaryId") int userPrimaryId);

    List<ScheduleVO> getTimetable(@Param("userPrimaryId") int userPrimaryId);

    void deleteTimetablePast(@Param("userPrimaryId") int userPrimaryId);

    void insertSchedule(@Param("userPrimaryId") int userPrimaryId,
                        @Param("schedule") ScheduleVO schedule);

    List<ClassManageVO> getMyStudyClass(Integer userPrimaryId);

    List<ClassManageVO> getMyStudyClassLatest3(Integer userPrimaryId);

    List<ClassManageVO> getMyFinishedClass(Integer userPrimaryId);

    List<ClassManageVO> getMyFinishedClassLatest3(Integer userPrimaryId);

    int getMyStudyClassCount(Integer userPrimaryId);

    int getMyFinishedClassCount(Integer userPrimaryId);


}
