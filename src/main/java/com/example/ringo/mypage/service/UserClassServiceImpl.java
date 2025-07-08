package com.example.ringo.mypage.service;

import com.example.ringo.command.ClassManageVO;
import com.example.ringo.command.MyPageVO;
import com.example.ringo.command.ScheduleVO;
import com.example.ringo.mypage.mapperJava.UserClassMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class UserClassServiceImpl implements UserClassService {

    @Autowired
    private UserClassMapper userClassMapper;

    @Override
    public List<MyPageVO> getMyApplyClass(@Param("userPrimaryId") int userPrimaryId) {
        return userClassMapper.getMyApplyClass(userPrimaryId);
    }

    @Override
    public List<MyPageVO> getMyWish(@Param("userPrimaryId") int userPrimaryId) {
        return userClassMapper.getMyWish(userPrimaryId);
    }

    @Override
    public void saveOrUpdateWish(MyPageVO vo) {
        int count = userClassMapper.checkWishExists(vo);
        if (count > 0) {
            userClassMapper.updateWish(vo);
        } else {
            userClassMapper.insertWish(vo);
        }
    }

    @Override
    public List<MyPageVO> getMyReview(@Param("userPrimaryId") int userPrimaryId) {
        List<MyPageVO> reviewList = userClassMapper.getMyReview(userPrimaryId);
        for (MyPageVO vo : reviewList) {
            byte[] userProfileBytes = vo.getUserProfileBytes(); // byte[] 타입 필드
            if (userProfileBytes != null) {
                String base64 = Base64.getEncoder().encodeToString(userProfileBytes);
                vo.setUserProfile(base64); // String 타입 필드에 세팅
            }
        }
        return reviewList;
    }

    @Override
    public List<ScheduleVO> getTimetable(int userPrimaryId) {
        return userClassMapper.getTimetable(userPrimaryId);
    }

//    @Override
//    public void deleteTimetablePast(int userPrimaryId) {
//        userClassMapper.deleteTimetablePast(userPrimaryId);
//    }
//
//    @Override
//    public void insertSchedule(int userPrimaryId, ScheduleVO schedule) {
//
//    }


    @Override
    public void saveTimetable(MyPageVO vo) {
        int userPrimaryId = vo.getUserPrimaryId();

        userClassMapper.deleteTimetablePast(userPrimaryId);

        if(vo.getSchedules() != null) {
            for (ScheduleVO schedule : vo.getSchedules()) {
                userClassMapper.insertSchedule(userPrimaryId, schedule);
            }
        }

    }

    @Override
    public List<ClassManageVO> getMyStudyClass(Integer userPrimaryId) {
        return userClassMapper.getMyStudyClass(userPrimaryId);
    }

    @Override
    public List<ClassManageVO> getMyStudyClassLatest3(Integer userPrimaryId) {
        return userClassMapper.getMyStudyClassLatest3(userPrimaryId);
    }

    @Override
    public List<ClassManageVO> getMyFinishedClass(Integer userPrimaryId) {
        return userClassMapper.getMyFinishedClass(userPrimaryId);
    }

    @Override
    public List<ClassManageVO> getMyFinishedClassLatest3(Integer userPrimaryId) {
        return userClassMapper.getMyFinishedClassLatest3(userPrimaryId);
    }

    @Override
    public int getMyStudyClassCount(Integer userPrimaryId) {
        return userClassMapper.getMyStudyClassCount(userPrimaryId);
    }

    @Override
    public int getMyFinishedClassCount(Integer userPrimaryId) {
        return userClassMapper.getMyFinishedClassCount(userPrimaryId);
    }

}
