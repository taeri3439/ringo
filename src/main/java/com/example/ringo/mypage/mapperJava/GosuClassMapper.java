package com.example.ringo.mypage.mapperJava;

import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GosuClassMapper {

    List<RecruitmentPostVO> findLecturesByUserId(Long userPrimaryId);

    //  내가 작성한 강의 전체에 달린 리뷰
    List<RecruitmentReviewVO> findReviewsForMyLectures(Long userPrimaryId);



}
