package com.example.ringo.lecture.service;

import com.example.ringo.command.ClassManageVO;
import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;
import com.example.ringo.command.UsersVO;

import java.util.List;
import java.util.Map;

public interface LectureService {
    void writeRecruitmentPost(RecruitmentPostVO recruitmentPostVO);
    List<RecruitmentPostVO> getLectures(String category, String search);
    RecruitmentPostVO getOneLecture(Integer lectureId);
    void enrollClass(ClassManageVO vo);

    UsersVO getUserById(int userPrimaryId);

    void writeLectureReview(RecruitmentReviewVO vo);

    List<RecruitmentReviewVO> getLectureReviews(Integer lectureId);

    // LectureService.java
    List<RecruitmentPostVO> getPostsByCategory(String category);

    List<RecruitmentPostVO> getOtherClassByGosu(int userPrimaryId, int excludePostId);

    Map<String, Object> getLectureImages(Integer lectureId);

}
