package com.example.ringo.mypage.service;

import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;
import com.example.ringo.mypage.mapperJava.GosuClassMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class GosuClassServiceImpl implements GosuClassService {

    @Autowired
    private GosuClassMapper gosuClassMapper;


    @Override
    public List<RecruitmentPostVO> findLecturesByUserId(Long userPrimaryId) {
        return gosuClassMapper.findLecturesByUserId(userPrimaryId);
    }

    @Override
    public List<RecruitmentReviewVO> findReviewsForMyLectures(Long userPrimaryId) {
        List<RecruitmentReviewVO> reviewList = gosuClassMapper.findReviewsForMyLectures(userPrimaryId);
        for (RecruitmentReviewVO vo : reviewList) {
            byte[] userProfileBytes = vo.getUserProfile();
            if (userProfileBytes != null && vo.getUserProfileMimetype() != null) {
                String base64 = Base64.getEncoder().encodeToString(userProfileBytes);
                vo.setUserProfileImage("data:" + vo.getUserProfileMimetype() + ";base64," + base64);
            }
        }
        return reviewList;
    }
}
