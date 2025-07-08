package com.example.ringo.lecture.mapperJava;

import com.example.ringo.command.ClassManageVO;
import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;
import com.example.ringo.command.UsersVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LectureMapper {
    void writeRecruitmentPost(RecruitmentPostVO recruitmentPostVO);
    void insertRecruitmentPostImage(@Param("recruitmentPostId") int recruitmentPostId, @Param("imageUrl") String imageUrl);
    void insertRecruitmentPostMainImage(@Param("recruitmentPostId") int recruitmentPostId, @Param("imageUrl") String imageUrl);
    List<RecruitmentPostVO> getLectures(String category, String search);
    RecruitmentPostVO getOneLecture(Integer lectureId);
    void enrollClass(ClassManageVO vo);

    UsersVO getUserById(@Param("userPrimaryId") int userPrimaryId);

    void insertLectureReview(RecruitmentReviewVO vo);

    List<RecruitmentReviewVO> getLectureReviews(@Param("lectureId")Integer lectureId);

    List<RecruitmentPostVO> getPostsByCategory(String category);

    List<RecruitmentPostVO> getOtherClassByGosu(@Param("userPrimaryId") int userPrimaryId, @Param("excludePostId") int excludePostId);

    List<RecruitmentPostVO> getLectureImages(@Param("lectureId") Integer lectureId);


}
