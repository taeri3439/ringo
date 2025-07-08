package com.example.ringo.mypage.service;

import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;

import java.util.List;

public interface GosuClassService {

    List<RecruitmentPostVO> findLecturesByUserId(Long userPrimaryId);

    //  내가 작성한 강의 전체에 달린 리뷰
    List<RecruitmentReviewVO> findReviewsForMyLectures(Long userPrimaryId);

}
